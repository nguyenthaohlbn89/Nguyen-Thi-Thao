import React, { useState } from 'react';
import {
  Layers,
  Plus,
  Edit2,
  Trash2,
  Users,
  Trophy,
  ArrowRightLeft,
  Check,
  X,
  Sparkles,
} from 'lucide-react';
import { Team, Student } from '../../types';

interface TeamsViewProps {
  teams: Team[];
  students: Student[];
  onAddTeam: (team: Omit<Team, 'id'>) => void;
  onUpdateTeam: (team: Team) => void;
  onDeleteTeam: (teamId: string) => void;
  onMoveStudentTeam: (studentId: string, newTeamId: string) => void;
  onAdjustTeamPoints: (teamId: string, points: number, reason: string) => void;
}

export const TeamsView: React.FC<TeamsViewProps> = ({
  teams,
  students,
  onAddTeam,
  onUpdateTeam,
  onDeleteTeam,
  onMoveStudentTeam,
  onAdjustTeamPoints,
}) => {
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [isAddTeamModalOpen, setIsAddTeamModalOpen] = useState(false);
  const [movingStudent, setMovingStudent] = useState<Student | null>(null);
  const [pointAdjustTeam, setPointAdjustTeam] = useState<Team | null>(null);
  const [pointAmount, setPointAmount] = useState(2);
  const [pointReason, setPointReason] = useState('Trực nhật sạch sẽ');

  // New Team Form State
  const [teamForm, setTeamForm] = useState({
    name: '',
    color: '#3B82F6',
    description: '',
  });

  const availableColors = [
    '#3B82F6', // Blue
    '#10B981', // Green
    '#F59E0B', // Amber
    '#EC4899', // Pink
    '#8B5CF6', // Purple
    '#EF4444', // Red
    '#06B6D4', // Cyan
    '#6366F1', // Indigo
  ];

  // Calculate team scores and member lists
  const teamStats = teams.map((team) => {
    const members = students.filter((s) => s.teamId === team.id);
    const memberPoints = members.reduce((sum, s) => sum + s.points, 0);
    const totalPoints = memberPoints + team.directPoints;
    return {
      ...team,
      members,
      memberCount: members.length,
      memberPoints,
      totalPoints,
    };
  });

  // Sort by totalPoints descending for ranking
  const rankedTeams = [...teamStats].sort((a, b) => b.totalPoints - a.totalPoints);

  const handleSaveTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamForm.name.trim()) return;

    if (editingTeam) {
      onUpdateTeam({
        ...editingTeam,
        name: teamForm.name,
        color: teamForm.color,
        description: teamForm.description,
      });
      setEditingTeam(null);
    } else {
      onAddTeam({
        name: teamForm.name,
        color: teamForm.color,
        directPoints: 0,
        description: teamForm.description,
      });
      setIsAddTeamModalOpen(false);
    }
  };

  const handleOpenEdit = (team: Team) => {
    setEditingTeam(team);
    setTeamForm({
      name: team.name,
      color: team.color,
      description: team.description || '',
    });
    setIsAddTeamModalOpen(true);
  };

  const handleConfirmPoints = (isPositive: boolean) => {
    if (pointAdjustTeam) {
      const delta = isPositive ? Math.abs(pointAmount) : -Math.abs(pointAmount);
      onAdjustTeamPoints(pointAdjustTeam.id, delta, pointReason);
      setPointAdjustTeam(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Layers className="w-6 h-6 text-blue-600" />
            <span>Quản lý tổ & Thi đua các tổ</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Tổng cộng: <strong className="text-slate-800">{teams.length} tổ</strong> • Điểm tổ = Điểm
            tất cả thành viên + Điểm trực tiếp của tổ
          </p>
        </div>

        <button
          onClick={() => {
            setEditingTeam(null);
            setTeamForm({ name: `Tổ ${teams.length + 1}`, color: '#3B82F6', description: '' });
            setIsAddTeamModalOpen(true);
          }}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs md:text-sm font-bold rounded-xl shadow-md shadow-blue-500/20 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>TẠO THÊM TỔ</span>
        </button>
      </div>

      {/* Team Leaderboard Podiums (Cúp Vàng) */}
      <div className="bg-gradient-to-br from-amber-500/10 via-white to-blue-500/10 p-6 rounded-2xl border border-amber-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center shadow-sm">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-base">🏆 BẢNG XẾP HẠNG THI ĐUA CÁC TỔ</h3>
              <p className="text-xs text-slate-500">Tổ dẫn đầu nhận cúp vàng danh dự</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {rankedTeams.map((team, index) => {
            const isFirst = index === 0;
            const medals = ['🥇', '🥈', '🥉', '🏅'];
            return (
              <div
                key={team.id}
                className={`relative p-5 rounded-2xl border transition-all ${
                  isFirst
                    ? 'bg-gradient-to-b from-amber-50 to-white border-amber-300 shadow-md ring-2 ring-amber-400/50'
                    : 'bg-white border-slate-200 shadow-xs'
                }`}
              >
                {isFirst && (
                  <div className="absolute -top-3 right-4 bg-amber-500 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-sm">
                    <Sparkles className="w-3 h-3" />
                    <span>DẪN ĐẦU</span>
                  </div>
                )}

                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">{medals[index] || '🏅'}</span>
                  <div
                    className="w-4 h-4 rounded-full border-2 border-white shadow-xs"
                    style={{ backgroundColor: team.color }}
                  />
                </div>

                <h4 className="font-black text-slate-900 text-base line-clamp-1">{team.name}</h4>
                <p className="text-xs text-slate-500 mt-0.5">{team.memberCount} thành viên</p>

                <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-500">
                    <span>Điểm thành viên:</span>
                    <span className="font-bold text-slate-800">{team.memberPoints} đ</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Điểm tổ trực tiếp:</span>
                    <span className="font-bold text-blue-600">
                      {team.directPoints > 0 ? `+${team.directPoints}` : team.directPoints} đ
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-1.5 border-t border-dashed border-slate-200">
                    <span className="font-bold text-slate-700">TỔNG ĐIỂM:</span>
                    <span className="text-lg font-black text-amber-600">{team.totalPoints} điểm</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-1">
                  <button
                    onClick={() => setPointAdjustTeam(team)}
                    className="text-xs font-bold text-blue-600 hover:bg-blue-50 px-2 py-1 rounded-lg transition-colors"
                  >
                    ± Cộng/Trừ điểm tổ
                  </button>
                  <button
                    onClick={() => handleOpenEdit(team)}
                    className="text-slate-400 hover:text-slate-600 p-1"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detail Teams List with Members */}
      <div className="space-y-4">
        <h3 className="text-sm font-black text-slate-700 uppercase tracking-wider">
          Danh sách thành viên từng tổ
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {teamStats.map((team) => (
            <div
              key={team.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col"
            >
              {/* Card Header */}
              <div
                className="p-4 flex items-center justify-between text-white"
                style={{ backgroundColor: team.color }}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center font-black">
                    {team.name.replace(/[^0-9]/g, '') || '#'}
                  </div>
                  <div>
                    <h4 className="font-black text-sm md:text-base">{team.name}</h4>
                    <p className="text-xs text-white/80">{team.description || 'Chưa có khẩu hiệu'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="bg-white/25 px-2.5 py-1 rounded-full text-xs font-bold">
                    {team.memberCount} học sinh
                  </span>
                  <button
                    onClick={() => handleOpenEdit(team)}
                    className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                    title="Chỉnh sửa tổ"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Members List */}
              <div className="p-4 flex-1 divide-y divide-slate-100 max-h-72 overflow-y-auto">
                {team.members.length > 0 ? (
                  team.members.map((st) => (
                    <div
                      key={st.id}
                      className="py-2 flex items-center justify-between text-xs hover:bg-slate-50 px-2 rounded-lg transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-400 w-5">{st.stt}</span>
                        <div>
                          <span className="font-bold text-slate-800">{st.fullName}</span>
                          <span className="text-[11px] text-slate-400 block">{st.position}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                          +{st.points} đ
                        </span>
                        <button
                          onClick={() => setMovingStudent(st)}
                          title="Chuyển sang tổ khác"
                          className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <ArrowRightLeft className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center py-6 text-xs text-slate-400">Chưa có học sinh trong tổ</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add / Edit Team Modal */}
      {isAddTeamModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900">
                {editingTeam ? 'Chỉnh sửa thông tin tổ' : 'Tạo tổ mới'}
              </h3>
              <button
                onClick={() => setIsAddTeamModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTeam} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tên tổ</label>
                <input
                  type="text"
                  required
                  value={teamForm.name}
                  onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })}
                  placeholder="VD: Tổ 1 - Rồng Vàng"
                  className="w-full px-3 py-2 text-xs md:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Khẩu hiệu / Mô tả</label>
                <input
                  type="text"
                  value={teamForm.description}
                  onChange={(e) => setTeamForm({ ...teamForm, description: e.target.value })}
                  placeholder="VD: Đoàn kết - Tự tin - Bứt phá"
                  className="w-full px-3 py-2 text-xs md:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Màu đại diện của tổ
                </label>
                <div className="flex items-center gap-2">
                  {availableColors.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setTeamForm({ ...teamForm, color: c })}
                      className={`w-7 h-7 rounded-full border-2 transition-transform ${
                        teamForm.color === c ? 'scale-115 border-slate-900 shadow-md' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddTeamModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs"
                >
                  Lưu tổ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Move Student Team Modal */}
      {movingStudent && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl animate-in zoom-in-95">
            <h3 className="text-base font-black text-slate-900 mb-2">Chuyển học sinh sang tổ khác</h3>
            <p className="text-xs text-slate-500 mb-4">
              Chuyển em <strong className="text-slate-800">{movingStudent.fullName}</strong> từ{' '}
              <span className="font-semibold text-blue-600">
                {teams.find((t) => t.id === movingStudent.teamId)?.name}
              </span>{' '}
              sang:
            </p>

            <div className="space-y-2">
              {teams.map((t) => (
                <button
                  key={t.id}
                  disabled={t.id === movingStudent.teamId}
                  onClick={() => {
                    onMoveStudentTeam(movingStudent.id, t.id);
                    setMovingStudent(null);
                  }}
                  className={`w-full p-2.5 rounded-xl text-left text-xs font-bold flex items-center justify-between border transition-all ${
                    t.id === movingStudent.teamId
                      ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                      : 'hover:bg-blue-50 text-slate-800 border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: t.color }} />
                    <span>{t.name}</span>
                  </div>
                  {t.id === movingStudent.teamId && (
                    <span className="text-[10px] text-slate-400">Tổ hiện tại</span>
                  )}
                </button>
              ))}
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setMovingStudent(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Adjust Team Direct Points Modal */}
      {pointAdjustTeam && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl animate-in zoom-in-95">
            <h3 className="text-base font-black text-slate-900 mb-1">
              Cộng / Trừ điểm cho {pointAdjustTeam.name}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Điểm này sẽ được cộng trực tiếp vào tổng điểm thi đua của cả tổ.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Số điểm</label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={pointAmount}
                  onChange={(e) => setPointAmount(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Lý do / Nội dung</label>
                <input
                  type="text"
                  value={pointReason}
                  onChange={(e) => setPointReason(e.target.value)}
                  placeholder="VD: Trực nhật sạch sẽ, tham gia kéo co..."
                  className="w-full px-3 py-2 text-xs md:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-5">
              <button
                onClick={() => handleConfirmPoints(true)}
                className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs"
              >
                + Cộng {pointAmount} điểm
              </button>
              <button
                onClick={() => handleConfirmPoints(false)}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs"
              >
                - Trừ {pointAmount} điểm
              </button>
            </div>

            <div className="mt-3 flex justify-center">
              <button
                onClick={() => setPointAdjustTeam(null)}
                className="text-xs font-bold text-slate-500 hover:text-slate-700"
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
