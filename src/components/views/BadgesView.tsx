import React, { useState } from 'react';
import { Sparkles, Award, Plus, History, X, Check, Search } from 'lucide-react';
import { Badge, Student, BadgeAward } from '../../types';

interface BadgesViewProps {
  badges: Badge[];
  students: Student[];
  badgeAwards: BadgeAward[];
  onAwardBadge: (studentId: string, badgeId: string, reason: string) => void;
}

export const BadgesView: React.FC<BadgesViewProps> = ({
  badges,
  students,
  badgeAwards,
  onAwardBadge,
}) => {
  const [selectedBadgeToAward, setSelectedBadgeToAward] = useState<Badge | null>(null);
  const [targetStudentId, setTargetStudentId] = useState(students[0]?.id || '');
  const [awardReason, setAwardReason] = useState('Đạt thành tích xuất sắc trong tuần');
  const [searchTerm, setSearchTerm] = useState('');

  const handleConfirmAward = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBadgeToAward || !targetStudentId) return;
    onAwardBadge(targetStudentId, selectedBadgeToAward.id, awardReason);
    setSelectedBadgeToAward(null);
  };

  const filteredAwards = badgeAwards.filter((a) => {
    const student = students.find((s) => s.id === a.studentId);
    if (!student) return true;
    return (
      student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.reason.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-amber-500" />
            <span>Huy hiệu khen thưởng học sinh</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Khích lệ tinh thần học tập, tình bạn và sự tiến bộ từng ngày của học sinh
          </p>
        </div>
      </div>

      {/* Badges Catalog Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {badges.map((badge) => {
          // Count how many students have this badge
          const count = students.filter((s) => s.badges?.includes(badge.id)).length;

          return (
            <div
              key={badge.id}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-amber-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl p-2 bg-slate-50 rounded-2xl border border-slate-100">
                    {badge.icon}
                  </span>
                  <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                    {count} học sinh đã nhận
                  </span>
                </div>

                <h3 className="text-base font-black text-slate-900">{badge.name}</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{badge.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100">
                <button
                  onClick={() => {
                    setSelectedBadgeToAward(badge);
                    setTargetStudentId(students[0]?.id || '');
                    setAwardReason(`Thành tích xuất sắc danh hiệu ${badge.name}`);
                  }}
                  className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold rounded-xl border border-amber-200 transition-colors"
                >
                  <Award className="w-4 h-4" />
                  <span>Trao huy hiệu này</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Award History Log */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2 text-slate-900 font-black text-base">
            <History className="w-5 h-5 text-blue-600" />
            <span>Lịch sử vinh danh & Trao huy hiệu ({badgeAwards.length})</span>
          </div>

          <div className="relative max-w-xs w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Tìm theo tên học sinh, lý do..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-xl focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredAwards.length > 0 ? (
            filteredAwards.map((award) => {
              const student = students.find((s) => s.id === award.studentId);
              const badge = badges.find((b) => b.id === award.badgeId);

              return (
                <div
                  key={award.id}
                  className="py-3 flex items-center justify-between text-xs md:text-sm hover:bg-slate-50 px-2 rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{badge?.icon || '⭐'}</span>
                    <div>
                      <p className="font-bold text-slate-900">
                        {student?.fullName || 'Học sinh'}{' '}
                        <span className="text-amber-700 font-semibold">
                          — nhận huy hiệu &quot;{badge?.name}&quot;
                        </span>
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">{award.reason}</p>
                    </div>
                  </div>

                  <span className="text-xs text-slate-400 font-medium">
                    {award.date.split('-').reverse().join('/')}
                  </span>
                </div>
              );
            })
          ) : (
            <p className="text-center py-6 text-xs text-slate-400">Chưa có lịch sử trao huy hiệu</p>
          )}
        </div>
      </div>

      {/* Award Badge Modal */}
      {selectedBadgeToAward && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{selectedBadgeToAward.icon}</span>
                <h3 className="text-base font-black text-slate-900">
                  Trao &quot;{selectedBadgeToAward.name}&quot;
                </h3>
              </div>
              <button
                onClick={() => setSelectedBadgeToAward(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmAward} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Chọn học sinh nhận huy hiệu
                </label>
                <select
                  value={targetStudentId}
                  onChange={(e) => setTargetStudentId(e.target.value)}
                  className="w-full px-3 py-2 text-xs md:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white font-medium"
                >
                  {students.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.stt}. {st.fullName} ({st.position})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Lý do trao tặng</label>
                <input
                  type="text"
                  required
                  value={awardReason}
                  onChange={(e) => setAwardReason(e.target.value)}
                  placeholder="VD: Tiến bộ vượt bậc trong tuần 2..."
                  className="w-full px-3 py-2 text-xs md:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedBadgeToAward(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-amber-500 hover:bg-amber-600 rounded-xl shadow-xs flex items-center gap-1.5"
                >
                  <Award className="w-4 h-4" />
                  <span>Xác nhận trao tặng</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
