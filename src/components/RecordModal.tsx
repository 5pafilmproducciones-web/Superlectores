import React, { useState, useEffect } from 'react';
import { CoreRecord } from '../types';
import { X, Save, Plus, AlertCircle } from 'lucide-react';

interface RecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (record: CoreRecord) => void;
  recordToEdit?: CoreRecord | null;
}

export const RecordModal: React.FC<RecordModalProps> = ({
  isOpen,
  onClose,
  onSave,
  recordToEdit,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Cuentos Nivel 1');
  const [status, setStatus] = useState<'activo' | 'pendiente' | 'completado'>('activo');
  const [level, setLevel] = useState<number>(1);
  const [gemsReward, setGemsReward] = useState<number>(10);
  const [authorOrTarget, setAuthorOrTarget] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (recordToEdit) {
      setTitle(recordToEdit.title);
      setCategory(recordToEdit.category);
      setStatus(recordToEdit.status);
      setLevel(recordToEdit.level || 1);
      setGemsReward(recordToEdit.gemsReward || 10);
      setAuthorOrTarget(recordToEdit.authorOrTarget || '');
    } else {
      setTitle('');
      setCategory('Cuentos Nivel 1');
      setStatus('activo');
      setLevel(1);
      setGemsReward(10);
      setAuthorOrTarget('');
    }
    setError(null);
  }, [recordToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('El título del cuento o registro es obligatorio.');
      return;
    }

    const newOrUpdatedRecord: CoreRecord = {
      id: recordToEdit ? recordToEdit.id : `rec-${Date.now()}`,
      title: title.trim(),
      category: category.trim(),
      status,
      createdAt: recordToEdit ? recordToEdit.createdAt : new Date().toISOString().split('T')[0],
      level: Number(level),
      gemsReward: Number(gemsReward),
      authorOrTarget: authorOrTarget.trim() || 'Estudiante Infantil',
    };

    onSave(newOrUpdatedRecord);
    onClose();
  };

  return (
    <div id="modal-record-container" className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <h3 className="font-bold text-base text-slate-900">
            {recordToEdit ? 'Editar Registro de Lectura' : '+ Nuevo Registro de Lectura'}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Título del Cuento o Actividad <span className="text-rose-500">*</span>
            </label>
            <input
              id="input-record-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej. La Aventura del Cohete Espacial"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Categoría</label>
              <select
                id="select-record-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="General">General</option>
                <option value="Core">Core</option>
                <option value="Cuentos Nivel 1">Cuentos Nivel 1 (7 años)</option>
                <option value="Cuentos Nivel 2">Cuentos Nivel 2 (8-9 años)</option>
                <option value="Cuentos Nivel 3">Cuentos Nivel 3 (10 años)</option>
                <option value="Comprensión Lectora">Comprensión Lectora</option>
                <option value="Práctica Auditiva">Práctica Auditiva</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Estado</label>
              <select
                id="select-record-status"
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="activo">Activo</option>
                <option value="pendiente">Pendiente</option>
                <option value="completado">Completado</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nivel Recomendado</label>
              <select
                id="select-record-level"
                value={level}
                onChange={(e) => setLevel(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value={1}>Nivel 1 (7 años)</option>
                <option value={2}>Nivel 2 (8-9 años)</option>
                <option value={3}>Nivel 3 (10 años)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Gemas de Recompensa</label>
              <input
                id="input-record-gems"
                type="number"
                min={1}
                max={100}
                value={gemsReward}
                onChange={(e) => setGemsReward(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Asignado a / Destinatario</label>
            <input
              id="input-record-target"
              type="text"
              value={authorOrTarget}
              onChange={(e) => setAuthorOrTarget(e.target.value)}
              placeholder="Ej. Estudiante o Aula 1A"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              id="btn-save-record-submit"
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Guardar Registro</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
