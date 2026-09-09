import React, { useState } from 'react';
import {
  Trophy,
  Plus,
  Minus,
  PlusCircle,
  Edit2,
  Trash2,
  Search,
  Check,
  Calendar,
  History,
  X,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';
import { Student, Team, CompetitionCriterion, CompetitionLog } from '../../types';

interface CompetitionViewProps {
  students: Student[];
  teams: Team[];
  criteria: CompetitionCriterion[];
  competitionLogs: CompetitionLog[];
  onAwardPoints: (studentId: string, points: number, criterionName: string, notes?: string, date?: string) => void;
  onAddCriterion: (crit: Omit<CompetitionCriterion, 'id'>) => void;
  onUpdateCriterion: (crit: CompetitionCriterion) => void;
  onDeleteCriterion: (critId: string) => void;
}

export const CompetitionView: React.FC<CompetitionViewProps> = ({
  students,
  teams,
  criteria,
  competitionLogs,
  onAwardPoints,
  onAddCriterion,
  onUpdateCriterion,
  onDeleteCriterion,
}) => {
  // Modal states
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedCriterion, setSelectedCriterion] = useState<CompetitionCriterion | null>(null);
  const [customPoints, setCustomPoints] = useState<number>(2);
  const [customNote, setCustomNote] = useState('');
  const [logDate, setLogDate] = useState(() => new Date().toISOString().split('T')[0]);

  // Criteria manager modal state
  const [isCriteriaManagerOpen, setIsCriteriaManagerOpen] = useState(false);
  const [editingCriterion, setEditingCriterion] = useState<CompetitionCriterion | null>(null);
  const [criterionForm, setCriterionForm] = useState({
    name: '',
    points: 2,
    type: 'positive' as 'positive' | 'negative',
    icon: '⭐',
  });

  // Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('all');

  const positiveCriteria = criteria.filter((c) => c.type === 'positive');
  const negativeCriteria = criteria.filter((c) => c.type === 'negative');

  const filteredStudents = students.filter((s) => {
    if (selectedTeam !== 'all' && s.teamId !== selectedTeam) return false;
    if (
      searchTerm &&
      !s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !s.stt.toString().includes(searchTerm)
    ) {
      return false;
    }
    return true;
  });

  const handleOpenAwardModal = (student: Student, defaultType: 'positive' | 'negative') => {
    setSelectedStudent(student);
    const defaultCrit = defaultType === 'positive' ? positiveCriteria[0] : negativeCriteria[0];
    setSelectedCriterion(defaultCrit || null);
    setCustomPoints(defaultCrit ? defaultCrit.points : defaultType === 'positive' ? 2 : -2);
    setCustomNote('');
    setLogDate(new Date().toISOString().split('T')[0]);
  };

  const handleConfirmAward = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;
    const criterionName = selectedCriterion ? selectedCriterion.name : 'Điểm tùy chỉnh';
    onAwardPoints(selectedStudent.id, customPoints, criterionName, customNote, logDate);
    setSelectedStudent(null);
  };

  const handleSaveCriterion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!criterionForm.name.trim()) return;

    if (editingCriterion) {
      onUpdateCriterion({
        ...editingCriterion,
        name: criterionForm.name,
        points: criterionForm.type === 'negative' ? -Math.abs(criterionForm.points) : Math.abs(criterionForm.points),
        type: criterionForm.type,
        icon: criterionForm.icon,
      });
      setEditingCriterion(null);
    } else {
      onAddCriterion({
        name: criterionForm.name,
        points: criterionForm.type === 'negative' ? -Math.abs(criterionForm.points) : Math.abs(criterionForm.points),
        type: criterionForm.type,
        icon: criterionForm.icon,
      });
    }

    setCriterionForm({ name: '', points: 2, type: 'positive', icon: '⭐' });
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-500" />
            <span>Thi đua học sinh & Cộng/Trừ điểm</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Ghi nhận khen thưởng tích cực hoặc nhắc nhở vi phạm tức thời kèm nhật ký
          </p>
        </div>

        <button
          onClick={() => {
            setEditingCriterion(null);
            setCriterionForm({ name: '', points: 2, type: 'positive', icon: '⭐' });
            setIsCriteriaManagerOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs md:text-sm font-bold rounded-xl transition-all"
        >
          <Edit2 className="w-4 h-4" />
          <span>Cài đặt tiêu chí thi đua ({criteria.length})</span>
        </button>
      </div>

      {/* Quick Criteria Badges Preview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Tích cực */}
        <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black text-emerald-900 uppercase flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Tiêu chí tích cực (Cộng điểm)</span>
            </span>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
              {positiveCriteria.length} tiêu chí
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {positiveCriteria.map((c) => (
              <span
                key={c.id}
                className="bg-white px-2.5 py-1 rounded-lg text-xs font-semibold text-emerald-800 border border-emerald-200 flex items-center gap-1 shadow-2xs"
              >
                <span>{c.icon || '⭐'}</span>
                <span>{c.name}</span>
                <strong className="text-emerald-600 font-bold ml-0.5">+{c.points}</strong>
              </span>
            ))}
          </div>
        </div>

        {/* Vi phạm */}
        <div className="bg-rose-50/60 p-4 rounded-2xl border border-rose-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black text-rose-900 uppercase flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>Tiêu chí vi phạm (Trừ điểm)</span>
            </span>
            <span className="text-[11px] font-semibold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full">
              {negativeCriteria.length} tiêu chí
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {negativeCriteria.map((c) => (
              <span
                key={c.id}
                className="bg-white px-2.5 py-1 rounded-lg text-xs font-semibold text-rose-800 border border-rose-200 flex items-center gap-1 shadow-2xs"
              >
                <span>{c.icon || '⚠️'}</span>
                <span>{c.name}</span>
                <strong className="text-rose-600 font-bold ml-0.5">{c.points}</strong>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Tìm theo tên học sinh..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs md:text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <select
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
            className="w-full px-3 py-2 text-xs md:text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
          >
            <option value="all">Tất cả các tổ</option>
            {teams.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Student List for Scoring */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs md:text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold text-[11px] tracking-wider">
              <tr>
                <th className="p-3.5 text-center w-12">STT</th>
                <th className="p-3.5">Học sinh</th>
                <th className="p-3.5">Tổ</th>
                <th className="p-3.5 text-center">Điểm hiện tại</th>
                <th className="p-3.5 text-center">Thao tác thi đua</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((st) => {
                const team = teams.find((t) => t.id === st.teamId);
                return (
                  <tr key={st.id} className="hover:bg-blue-50/40 transition-colors">
                    <td className="p-3.5 text-center font-bold text-slate-400">{st.stt}</td>
                    <td className="p-3.5 font-bold text-slate-900">
                      <span>{st.fullName}</span>
                      <span className="block text-[11px] text-slate-400 font-normal">
                        {st.position}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span
                        className="inline-block text-[11px] font-semibold text-white px-2 py-0.5 rounded-md"
                        style={{ backgroundColor: team?.color || '#64748B' }}
                      >
                        {team?.name || 'Tổ'}
                      </span>
                    </td>
                    <td className="p-3.5 text-center">
                      <span className="text-sm font-black text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
                        {st.points} điểm
                      </span>
                    </td>
                    <td className="p-3.5 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenAwardModal(st, 'positive')}
                          className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-transform active:scale-95"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>+ Cộng điểm</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenAwardModal(st, 'negative')}
                          className="flex items-center gap-1 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition-transform active:scale-95"
                        >
                          <Minus className="w-3.5 h-3.5" />
                          <span>- Trừ điểm</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Competition Logs */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 text-slate-900 font-black text-sm mb-4">
          <History className="w-4 h-4 text-blue-600" />
          <span>Nhật ký cộng / trừ điểm gần đây</span>
        </div>

        <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
          {competitionLogs.length > 0 ? (
            competitionLogs.slice(0, 10).map((log) => {
              const student = log.studentId ? students.find((s) => s.id === log.studentId) : null;
              const team = log.teamId ? teams.find((t) => t.id === log.teamId) : null;

              return (
                <div
                  key={log.id}
                  className="py-2.5 flex items-center justify-between text-xs hover:bg-slate-50 px-2 rounded-lg"
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs ${
                        log.points > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {log.points > 0 ? `+${log.points}` : log.points}
                    </span>
                    <div>
                      <p className="font-bold text-slate-800">
                        {student ? student.fullName : team ? team.name : 'Chung'}:{' '}
                        <span className="font-semibold text-slate-600">{log.criterionName}</span>
                      </p>
                      {log.notes && <p className="text-[11px] text-slate-400">{log.notes}</p>}
                    </div>
                  </div>

                  <span className="text-[11px] text-slate-400">
                    {log.date.split('-').reverse().join('/')}
                  </span>
                </div>
              );
            })
          ) : (
            <p className="text-center py-4 text-xs text-slate-400">Chưa có nhật ký cộng trừ điểm</p>
          )}
        </div>
      </div>

      {/* Award Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900">
                Ghi nhận thi đua: {selectedStudent.fullName}
              </h3>
              <button
                onClick={() => setSelectedStudent(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmAward} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Chọn tiêu chí mẫu
                </label>
                <select
                  value={selectedCriterion?.id || ''}
                  onChange={(e) => {
                    const found = criteria.find((c) => c.id === e.target.value);
                    setSelectedCriterion(found || null);
                    if (found) setCustomPoints(found.points);
                  }}
                  className="w-full px-3 py-2 text-xs md:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                >
                  <optgroup label="🌟 Tiêu chí tích cực (Cộng điểm)">
                    {positiveCriteria.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} (+{c.points} điểm)
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="⚠️ Tiêu chí vi phạm (Trừ điểm)">
                    {negativeCriteria.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.points} điểm)
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Số điểm áp dụng
                  </label>
                  <input
                    type="number"
                    value={customPoints}
                    onChange={(e) => setCustomPoints(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 text-xs md:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Ngày ghi nhận</label>
                  <input
                    type="date"
                    value={logDate}
                    onChange={(e) => setLogDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs md:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Ghi chú chi tiết (nếu có)
                </label>
                <input
                  type="text"
                  placeholder="VD: Trong tiết Ngữ Văn, hỗ trợ bạn Linh..."
                  value={customNote}
                  onChange={(e) => setCustomNote(e.target.value)}
                  className="w-full px-3 py-2 text-xs md:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedStudent(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 text-xs font-bold text-white rounded-xl shadow-xs ${
                    customPoints >= 0
                      ? 'bg-emerald-600 hover:bg-emerald-700'
                      : 'bg-rose-600 hover:bg-rose-700'
                  }`}
                >
                  Xác nhận {customPoints >= 0 ? `+${customPoints}` : customPoints} điểm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Criteria Management Modal */}
      {isCriteriaManagerOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl animate-in zoom-in-95 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900">
                Quản lý bảng tiêu chí thi đua
              </h3>
              <button
                onClick={() => setIsCriteriaManagerOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Criteria Form */}
            <form onSubmit={handleSaveCriterion} className="py-3 border-b border-slate-100 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tên tiêu chí</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Hăng hái xây dựng bài..."
                    value={criterionForm.name}
                    onChange={(e) => setCriterionForm({ ...criterionForm, name: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-xl focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Loại</label>
                  <select
                    value={criterionForm.type}
                    onChange={(e) =>
                      setCriterionForm({
                        ...criterionForm,
                        type: e.target.value as 'positive' | 'negative',
                      })
                    }
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-xl focus:ring-1 focus:ring-blue-500 focus:outline-none bg-white"
                  >
                    <option value="positive">Tích cực (+)</option>
                    <option value="negative">Vi phạm (-)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Số điểm (tuyệt đối)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={Math.abs(criterionForm.points)}
                    onChange={(e) =>
                      setCriterionForm({
                        ...criterionForm,
                        points: Math.abs(parseInt(e.target.value) || 1),
                      })
                    }
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-xl focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs"
                  >
                    {editingCriterion ? 'Cập nhật tiêu chí' : '+ Thêm tiêu chí mới'}
                  </button>
                </div>
              </div>
            </form>

            {/* List of existing criteria */}
            <div className="flex-1 overflow-y-auto py-3 space-y-2">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Danh sách tiêu chí hiện có
              </h4>
              {criteria.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-black px-2 py-0.5 rounded text-[11px] ${
                        c.type === 'positive'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {c.points > 0 ? `+${c.points}` : c.points}
                    </span>
                    <span className="font-bold text-slate-800">{c.name}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setEditingCriterion(c);
                        setCriterionForm({
                          name: c.name,
                          points: Math.abs(c.points),
                          type: c.type,
                          icon: c.icon || '⭐',
                        });
                      }}
                      className="p-1 text-slate-400 hover:text-blue-600"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteCriterion(c.id)}
                      className="p-1 text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setIsCriteriaManagerOpen(false)}
                className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
