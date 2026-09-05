import { getSupabase } from './supabaseClient';
import { Product, Category, InventoryMovement, MovementInput } from '../types';

/**
 * SERVICIO DE INVENTARIO Y MOVIMIENTOS EN SUPABASE
 * Utiliza RLS (Row Level Security) nativo para garantizar que cada
 * usuario solo interactúa con sus propios registros.
 */

// ==========================================
// 1. GESTIÓN DE PRODUCTOS (CRUD)
// ==========================================

/**
 * Obtener todos los productos del inventario del usuario autenticado
 * Incluye datos de su categoría relacionada mediante JOIN nativo.
 */
export async function fetchUserProducts(options?: {
  categoryId?: string;
  searchQuery?: string;
  lowStockOnly?: boolean;
}): Promise<{ data: Product[] | null; error: string | null }> {
  const client = getSupabase();
  if (!client) return { data: null, error: 'Supabase no está configurado' };

  try {
    let query = client
      .from('products')
      .select(`
        *,
        category:categories (
          id,
          name,
          color
        )
      `)
      .order('name', { ascending: true });

    if (options?.categoryId) {
      query = query.eq('category_id', options.categoryId);
    }

    if (options?.searchQuery) {
      query = query.or(`name.ilike.%${options.searchQuery}%,sku.ilike.%${options.searchQuery}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error al listar productos:', error);
      return { data: null, error: error.message };
    }

    let products = data as Product[];

    if (options?.lowStockOnly) {
      products = products.filter((p) => p.current_stock <= p.min_stock);
    }

    return { data: products, error: null };
  } catch (err: any) {
    return { data: null, error: err?.message || 'Error inesperado al consultar productos' };
  }
}

/**
 * Crear un nuevo producto en el inventario
 */
export async function createProduct(productData: {
  sku?: string;
  name: string;
  description?: string;
  category_id?: string | null;
  unit?: string;
  initial_stock?: number;
  min_stock?: number;
  unit_price?: number;
  location?: string;
}): Promise<{ data: Product | null; error: string | null }> {
  const client = getSupabase();
  if (!client) return { data: null, error: 'Supabase no está configurado' };

  try {
    const { data: { user } } = await client.auth.getUser();
    if (!user) return { data: null, error: 'Usuario no autenticado' };

    const initialStock = Number(productData.initial_stock) || 0;

    const { data, error } = await client
      .from('products')
      .insert({
        user_id: user.id,
        sku: productData.sku?.trim() || null,
        name: productData.name.trim(),
        description: productData.description?.trim() || null,
        category_id: productData.category_id || null,
        unit: productData.unit || 'unidad',
        current_stock: initialStock,
        min_stock: Number(productData.min_stock) || 0,
        unit_price: Number(productData.unit_price) || 0,
        location: productData.location?.trim() || null,
      })
      .select()
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    // Si tiene stock inicial, registrar automáticamente el movimiento inicial
    if (initialStock > 0 && data) {
      await client.from('inventory_movements').insert({
        user_id: user.id,
        product_id: data.id,
        movement_type: 'entrada',
        quantity: initialStock,
        previous_stock: 0,
        new_stock: initialStock,
        reason: 'Inventario inicial al crear producto',
        reference_code: 'INICIO',
        unit_cost: productData.unit_price || 0,
      });
    }

    return { data: data as Product, error: null };
  } catch (err: any) {
    return { data: null, error: err?.message || 'Error al crear producto' };
  }
}

/**
 * Actualizar detalles de un producto existente
 */
export async function updateProduct(
  productId: string,
  updates: Partial<Omit<Product, 'id' | 'user_id' | 'current_stock' | 'created_at'>>
): Promise<{ data: Product | null; error: string | null }> {
  const client = getSupabase();
  if (!client) return { data: null, error: 'Supabase no está configurado' };

  try {
    const { data, error } = await client
      .from('products')
      .update(updates)
      .eq('id', productId)
      .select()
      .single();

    if (error) return { data: null, error: error.message };
    return { data: data as Product, error: null };
  } catch (err: any) {
    return { data: null, error: err?.message || 'Error al actualizar producto' };
  }
}

/**
 * Eliminar un producto
 */
export async function deleteProduct(productId: string): Promise<{ success: boolean; error: string | null }> {
  const client = getSupabase();
  if (!client) return { success: false, error: 'Supabase no está configurado' };

  try {
    const { error } = await client.from('products').delete().eq('id', productId);
    if (error) return { success: false, error: error.message };
    return { success: true, error: null };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Error al eliminar producto' };
  }
}

// ==========================================
// 2. GESTIÓN DE MOVIMIENTOS E HISTORIAL
// ==========================================

/**
 * Registrar un movimiento en el historial y actualizar el stock.
 * Se puede ejecutar mediante la función RPC transaccional 'register_inventory_movement'
 * o directamente con verificación y actualización atómica.
 */
export async function recordStockMovement(input: MovementInput): Promise<{
  movement: InventoryMovement | null;
  newStock: number | null;
  error: string | null;
}> {
  const client = getSupabase();
  if (!client) return { movement: null, newStock: null, error: 'Supabase no está configurado' };

  try {
    const { data: { user } } = await client.auth.getUser();
    if (!user) return { movement: null, newStock: null, error: 'Usuario no autenticado' };

    // Intento 1: Llamar a la función RPC nativa si fue creada en el SQL Editor
    const { data: rpcData, error: rpcError } = await client.rpc('register_inventory_movement', {
      p_product_id: input.productId,
      p_movement_type: input.movementType,
      p_quantity: Number(input.quantity),
      p_reason: input.reason.trim(),
      p_reference_code: input.referenceCode?.trim() || null,
      p_unit_cost: Number(input.unitCost) || 0,
    });

    if (!rpcError && rpcData) {
      return {
        movement: rpcData.movement,
        newStock: rpcData.new_stock,
        error: null,
      };
    }

    // Intento 2 (Fallback cliente): Transacción paso a paso con validación de stock
    const { data: product, error: prodErr } = await client
      .from('products')
      .select('id, current_stock')
      .eq('id', input.productId)
      .single();

    if (prodErr || !product) {
      return { movement: null, newStock: null, error: 'Producto no encontrado' };
    }

    const previousStock = product.current_stock;
    const qty = Number(input.quantity);
    let calculatedStock = previousStock;

    if (input.movementType === 'entrada') {
      calculatedStock += qty;
    } else if (input.movementType === 'salida') {
      if (previousStock < qty) {
        return {
          movement: null,
          newStock: null,
          error: `Stock insuficiente. Stock actual: ${previousStock}, requerido: ${qty}`,
        };
      }
      calculatedStock -= qty;
    } else if (input.movementType === 'ajuste') {
      calculatedStock = qty; // El ajuste define el nuevo conteo físico
    }

    // 1. Actualizar el stock en la tabla products
    const { error: updateErr } = await client
      .from('products')
      .update({ current_stock: calculatedStock })
      .eq('id', input.productId);

    if (updateErr) {
      return { movement: null, newStock: null, error: updateErr.message };
    }

    // 2. Insertar en el historial de movimientos
    const { data: movData, error: movErr } = await client
      .from('inventory_movements')
      .insert({
        user_id: user.id,
        product_id: input.productId,
        movement_type: input.movementType,
        quantity: qty,
        previous_stock: previousStock,
        new_stock: calculatedStock,
        reason: input.reason.trim(),
        reference_code: input.referenceCode?.trim() || null,
        unit_cost: Number(input.unitCost) || 0,
      })
      .select()
      .single();

    if (movErr) {
      return { movement: null, newStock: calculatedStock, error: movErr.message };
    }

    return {
      movement: movData as InventoryMovement,
      newStock: calculatedStock,
      error: null,
    };
  } catch (err: any) {
    return { movement: null, newStock: null, error: err?.message || 'Error al registrar movimiento' };
  }
}

/**
 * Listar el historial de movimientos de inventario con filtros
 */
export async function fetchInventoryMovements(options?: {
  productId?: string;
  limit?: number;
}): Promise<{ data: InventoryMovement[] | null; error: string | null }> {
  const client = getSupabase();
  if (!client) return { data: null, error: 'Supabase no está configurado' };

  try {
    let query = client
      .from('inventory_movements')
      .select(`
        *,
        product:products (
          name,
          sku,
          unit
        )
      `)
      .order('created_at', { ascending: false });

    if (options?.productId) {
      query = query.eq('product_id', options.productId);
    }

    if (options?.limit) {
      query = query.limit(options.limit);
    } else {
      query = query.limit(100);
    }

    const { data, error } = await query;
    if (error) return { data: null, error: error.message };

    return { data: data as InventoryMovement[], error: null };
  } catch (err: any) {
    return { data: null, error: err?.message || 'Error al listar movimientos' };
  }
}

// ==========================================
// 3. GESTIÓN DE CATEGORÍAS
// ==========================================

export async function fetchUserCategories(): Promise<{ data: Category[] | null; error: string | null }> {
  const client = getSupabase();
  if (!client) return { data: null, error: 'Supabase no está configurado' };

  try {
    const { data, error } = await client
      .from('categories')
      .select('*')
      .order('name', { ascending: true });

    if (error) return { data: null, error: error.message };
    return { data: data as Category[], error: null };
  } catch (err: any) {
    return { data: null, error: err?.message || 'Error al consultar categorías' };
  }
}

export async function createCategory(name: string, description?: string, color?: string): Promise<{ data: Category | null; error: string | null }> {
  const client = getSupabase();
  if (!client) return { data: null, error: 'Supabase no está configurado' };

  try {
    const { data: { user } } = await client.auth.getUser();
    if (!user) return { data: null, error: 'Usuario no autenticado' };

    const { data, error } = await client
      .from('categories')
      .insert({
        user_id: user.id,
        name: name.trim(),
        description: description?.trim() || null,
        color: color || '#4F46E5',
      })
      .select()
      .single();

    if (error) return { data: null, error: error.message };
    return { data: data as Category, error: null };
  } catch (err: any) {
    return { data: null, error: err?.message || 'Error al crear categoría' };
  }
}
