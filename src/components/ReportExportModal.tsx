import React from 'react';
import { ChildProfile, CoreRecord, ReadingEvaluation, Story } from '../types';
import { 
  X, 
  Printer, 
  Download, 
  Award, 
  BookOpen, 
  Gem, 
  CheckCircle2, 
  Calendar,
  Sparkles,
  FileCheck
} from 'lucide-react';

interface ReportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: ChildProfile;
  records: CoreRecord[];
  evaluations: ReadingEvaluation[];
  stories: Story[];
}

export const ReportExportModal: React.FC<ReportExportModalProps> = ({
  isOpen,
  onClose,
  profile,
  records,
  evaluations,
  stories,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJSON = () => {
    const reportData = {
      student: profile,
      evaluationHistory: evaluations,
      recordsSummary: records,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reporte-lecturakids-${profile.name.toLowerCase().replace(/\s+/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const completedCount = records.filter((r) => r.status === 'completado').length;

  return (
    <div id="modal-report-export" className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 my-6 flex flex-col">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white border-b border-slate-800">
          <div className="flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-indigo-400" />
            <div>
              <h3 className="font-bold text-sm">Informe de Desempeño y Comprensión Lectora</h3>
              <p className="text-[11px] text-slate-400">Documento Oficial para Padres y Tutores</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Report Preview Document */}
        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto max-h-[70vh] bg-slate-50/50">
          {/* Printable Sheet */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            {/* Header Document */}
            <div className="flex items-start justify-between border-b border-slate-200 pb-5">
              <div>
                <div className="flex items-center gap-2.5">
                  <img
                    src="/logo_superlectores.png"
                    alt="Super Lectores"
                    className="w-8 h-8 rounded-full object-cover border border-amber-400/50"
                  />
                  <span className="font-black text-xl text-indigo-700 tracking-tight">Super Lectores</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                    Certificado Oficial
                  </span>
                </div>
                <h4 className="text-base font-bold text-slate-800 mt-1">Evaluación de Fluidez y Comprensión</h4>
                <p className="text-xs text-slate-500">Programa de Lectura por Niveles y Recompensas</p>
              </div>

              <div className="text-right text-xs text-slate-400">
                <div className="flex items-center justify-end gap-1 font-semibold text-slate-600">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{new Date().toLocaleDateString('es-ES', { dateStyle: 'long' })}</span>
                </div>
                <span className="text-[10px]">ID: LKT-{profile.age}992</span>
              </div>
            </div>

            {/* Student Profile Card in Report */}
            <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <img
                src={profile.avatar}
                alt={profile.name}
                referrerPolicy="no-referrer"
                className="w-16 h-16 rounded-full object-cover border-2 border-indigo-400"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h5 className="font-extrabold text-base text-slate-900 truncate">{profile.name}</h5>
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800">
                    Nivel {profile.level}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5">
                  Edad: <strong>{profile.age} años</strong> • Días de hábito continuo: <strong>{profile.streakDays} días</strong>
                </p>
              </div>

              <div className="text-right shrink-0">
                <div className="flex items-center gap-1 text-sm font-extrabold text-indigo-700">
                  <Gem className="w-4 h-4 text-sky-500 fill-sky-300" />
                  <span>{profile.gems} Gemas</span>
                </div>
                <span className="text-xs font-bold text-amber-600">{profile.score} Puntos</span>
              </div>
            </div>

            {/* Metrics Breakdown Grid */}
            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Resultados Globales de Aprendizaje
              </h5>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200">
                  <span className="text-[10px] text-emerald-800 font-semibold block">FLUIDEZ AUDITIVA</span>
                  <span className="text-xl font-black text-emerald-700">{profile.audioAccuracyAverage}%</span>
                  <span className="text-[10px] text-emerald-600 block mt-0.5">Nivel Alto</span>
                </div>

                <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-200">
                  <span className="text-[10px] text-indigo-800 font-semibold block">COMPRENSIÓN V/F</span>
                  <span className="text-xl font-black text-indigo-700">96%</span>
                  <span className="text-[10px] text-indigo-600 block mt-0.5">3/3 Preguntas</span>
                </div>

                <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200">
                  <span className="text-[10px] text-amber-800 font-semibold block">LIBROS LEÍDOS</span>
                  <span className="text-xl font-black text-amber-700">{completedCount}</span>
                  <span className="text-[10px] text-amber-600 block mt-0.5">de {records.length} asignados</span>
                </div>

                <div className="p-3 rounded-xl bg-purple-50/70 border border-purple-200">
                  <span className="text-[10px] text-purple-800 font-semibold block">RECESOS JUGADOS</span>
                  <span className="text-xl font-black text-purple-700">4</span>
                  <span className="text-[10px] text-purple-600 block mt-0.5">Canjes Realizados</span>
                </div>
              </div>
            </div>

            {/* Detailed Completed Stories History */}
            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Historial de Evaluaciones Auditivas y de Escritura
              </h5>
              <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden text-xs">
                {evaluations.slice(0, 4).map((item) => {
                  const storyMatch = stories.find((s) => s.id === item.storyId || s.title === item.storyTitle);
                  return (
                    <div key={item.id} className="p-3 flex items-center justify-between gap-3 bg-white">
                      <div className="flex items-center gap-3 min-w-0">
                        {storyMatch?.coverImage ? (
                          <img
                            src={storyMatch.coverImage}
                            alt={item.storyTitle}
                            className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0 shadow-xs"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0 text-base">
                            📖
                          </div>
                        )}
                        <div className="min-w-0">
                          <span className="font-bold text-slate-900 block truncate">{item.storyTitle}</span>
                          <span className="text-[11px] text-slate-500">
                            {item.completedAt} • Precisión en voz: {item.voiceAccuracy}% • Quiz: {item.quizScore}/{item.totalQuestions}
                          </span>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                        +{item.gemsEarned} Gemas
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Pedagogical Observations */}
            <div className="p-4 rounded-xl bg-indigo-50/40 border border-indigo-100 space-y-1.5 text-xs">
              <span className="font-bold text-indigo-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                Observaciones del Tutor / Sistema:
              </span>
              <p className="text-slate-600 leading-relaxed">
                El estudiante demuestra excelente pronunciación y entonación en las lecturas de Nivel {profile.level}. En la evaluación de comprensión falso/verdadero identifica con facilidad la idea principal. El sistema de incentivo por gemas ha incrementado su motivación y tiempo de concentración diaria.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Cerrar Vista Previa
          </button>

          <div className="flex gap-2">
            <button
              onClick={handleDownloadJSON}
              className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exportar JSON</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir / PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
