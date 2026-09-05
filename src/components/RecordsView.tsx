import React, { useState, useMemo } from 'react';
import { CoreRecord } from '../types';
import { 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Filter,
  Gem,
  Award,
  ChevronDown
} from 'lucide-react';

interface RecordsViewProps {
  records: CoreRecord[];
  onOpenCreateModal: () => void;
  onEditRecord: (record: CoreRecord) => void;
  onDeleteRecord: (id: string) => void;
  onUpdateStatus: (id: string, newStatus: 'activo' | 'pendiente' | 'completado') => void;
}

export const RecordsView: React.FC<RecordsViewProps> = ({
  records,
  onOpenCreateModal,
  onEditRecord,
  onDeleteRecord,
  onUpdateStatus,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'activo' | 'pendiente' | 'completado'>('all');
  const [recordToDelete, setRecordToDelete] = useState<CoreRecord | null>(null);

  // Filtered records
  const filteredRecords = useMemo(() => {
    return records.filter((rec) => {
      const matchesSearch =
        rec.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rec.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (rec.authorOrTarget && rec.authorOrTarget.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesStatus = statusFilter === 'all' || rec.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [records, searchTerm, statusFilter]);

  const confirmDelete = () => {
    if (recordToDelete) {
      onDeleteRecord(recordToDelete.id);
      setRecordToDelete(null);
    }
  };

  return (
    <div id="records-view" className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header & Actions Bar */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Directorio de Cuentos y Registros
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Administra los cuentos asignados, evaluaciones en curso y recompensas de gemas.
          </p>
        </div>

        {/* Create button */}
        <button
          id="btn-create-new-record"
          onClick={onOpenCreateModal}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs shadow-md transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Nuevo Registro</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        {/* Real-time search */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            id="input-search-records"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por título, categoría o destinatario..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
          />
        </div>

        {/* Status Pills Filter */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          <span className="text-xs text-slate-500 font-semibold flex items-center gap-1 shrink-0 ml-1">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            Estado:
          </span>
          {(['all', 'activo', 'pendiente', 'completado'] as const).map((st) => (
            <button
              key={st}
              id={`filter-status-${st}`}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap capitalize transition-all ${
                statusFilter === st
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st === 'all' ? 'Todos' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table id="table-core-records" className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4 sm:px-6">Título & Actividad</th>
                <th className="py-3.5 px-4">Categoría</th>
                <th className="py-3.5 px-4">Nivel / Gemas</th>
                <th className="py-3.5 px-4">Estado</th>
                <th className="py-3.5 px-4">Fecha Creación</th>
                <th className="py-3.5 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <p className="font-semibold text-sm">No se encontraron registros</p>
                    <p className="text-xs mt-1">Intenta con otro término de búsqueda o cambia los filtros.</p>
                  </td>
                </tr>
              ) : (
                filteredRecords.map((record) => {
                  const isCompletado = record.status === 'completado';
                  const isActivo = record.status === 'activo';

                  return (
                    <tr
                      key={record.id}
                      id={`record-row-${record.id}`}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      {/* Title */}
                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="font-bold text-slate-900 text-sm">{record.title}</div>
                        {record.authorOrTarget && (
                          <div className="text-[11px] text-slate-400 mt-0.5">{record.authorOrTarget}</div>
                        )}
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                          {record.category}
                        </span>
                      </td>

                      {/* Level & Gems */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-slate-700">
                            Nivel {record.level || 1}
                          </span>
                          <span className="text-xs font-bold text-sky-600 flex items-center gap-0.5">
                            <Gem className="w-3 h-3 fill-sky-200" />
                            {record.gemsReward || 10}
                          </span>
                        </div>
                      </td>

                      {/* Status with Direct Changer */}
                      <td className="py-3.5 px-4">
                        <div className="relative inline-block">
                          <select
                            id={`select-status-${record.id}`}
                            value={record.status}
                            onChange={(e) =>
                              onUpdateStatus(record.id, e.target.value as 'activo' | 'pendiente' | 'completado')
                            }
                            className={`text-xs font-bold rounded-lg px-2.5 py-1 appearance-none pr-6 cursor-pointer border transition-colors ${
                              isCompletado
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                : isActivo
                                ? 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100'
                                : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                            }`}
                          >
                            <option value="activo">Activo</option>
                            <option value="pendiente">Pendiente</option>
                            <option value="completado">Completado</option>
                          </select>
                          <ChevronDown className="w-3 h-3 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-50" />
                        </div>
                      </td>

                      {/* Created At */}
                      <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                        {record.createdAt}
                      </td>

                      {/* Direct Actions: Edit & Delete with confirmation */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            id={`btn-edit-record-${record.id}`}
                            onClick={() => onEditRecord(record)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                            title="Editar Registro"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            id={`btn-delete-record-${record.id}`}
                            onClick={() => setRecordToDelete(record)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Eliminar Registro"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Mostrando {filteredRecords.length} de {records.length} registros</span>
          <span className="text-[11px]">Sincronizado con LocalStorage</span>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {recordToDelete && (
        <div id="modal-delete-confirmation" className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h4 className="font-bold text-base text-slate-900">¿Eliminar Registro?</h4>
              <p className="text-xs text-slate-500">
                ¿Estás seguro de que deseas eliminar <strong>"{recordToDelete.title}"</strong>? Esta acción actualizará tu LocalStorage.
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                id="btn-cancel-delete"
                onClick={() => setRecordToDelete(null)}
                className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
              >
                Cancelar
              </button>
              <button
                id="btn-confirm-delete"
                onClick={confirmDelete}
                className="flex-1 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
