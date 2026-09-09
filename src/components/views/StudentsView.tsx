import React, { useState, useMemo } from 'react';
import {
  Users,
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  Edit2,
  Trash2,
  Eye,
  Phone,
  User,
  Calendar,
  Layers,
  Award,
  AlertCircle,
  X,
  Check,
  ShieldCheck,
} from 'lucide-react';
import { Student, Team, Badge } from '../../types';

interface StudentsViewProps {
  students: Student[];
  teams: Team[];
  badges: Badge[];
  onAddStudent: (student: Omit<Student, 'id' | 'stt'>) => void;
  onUpdateStudent: (student: Student) => void;
  onDeleteStudent: (studentId: string) => void;
}

export const StudentsView: React.FC<StudentsViewProps> = ({
  students,
  teams,
  badges,
  onAddStudent,
  onUpdateStudent,
  onDeleteStudent,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeamFilter, setSelectedTeamFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'stt' | 'name' | 'points'>('stt');

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);

  // Form State
  const initialFormState = {
    fullName: '',
    birthDate: '2014-01-01',
    gender: 'Nam' as 'Nam' | 'Nữ',
    teamId: teams[0]?.id || 'team-1',
    position: 'Thành viên',
    parentName: '',
    parentRelationship: 'Bố',
    parentPhone: '',
    parentEmail: '',
    address: '',
    notes: '',
    points: 30,
    absentDays: 0,
    excusedDays: 0,
    unexcusedDays: 0,
    lateDays: 0,
    badges: [] as string[],
  };

  const [formData, setFormData] = useState(initialFormState);

  // Filter & Search & Sort
  const filteredStudents = useMemo(() => {
    let list = [...students];

    // Filter team
    if (selectedTeamFilter !== 'all') {
      list = list.filter((s) => s.teamId === selectedTeamFilter);
    }

    // Search
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter(
        (s) =>
          s.fullName.toLowerCase().includes(q) ||
          s.parentPhone.includes(q) ||
          s.position.toLowerCase().includes(q)
      );
    }

    // Sort
    list.sort((a, b) => {
      if (sortBy === 'stt') return a.stt - b.stt;
      if (sortBy === 'name') {
        const nameA = a.fullName.split(' ').slice(-1)[0];
        const nameB = b.fullName.split(' ').slice(-1)[0];
        return nameA.localeCompare(nameB, 'vi');
      }
      if (sortBy === 'points') return b.points - a.points;
      return 0;
    });

    return list;
  }, [students, selectedTeamFilter, searchTerm, sortBy]);

  const handleOpenAddModal = () => {
    setFormData({
      ...initialFormState,
      teamId: teams[0]?.id || 'team-1',
    });
    setEditingStudent(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (student: Student) => {
    setEditingStudent(student);
    setFormData({
      fullName: student.fullName,
      birthDate: student.birthDate,
      gender: student.gender,
      teamId: student.teamId,
      position: student.position,
      parentName: student.parentName,
      parentRelationship: student.parentRelationship,
      parentPhone: student.parentPhone,
      parentEmail: student.parentEmail || '',
      address: student.address || '',
      notes: student.notes || '',
      points: student.points,
      absentDays: student.absentDays,
      excusedDays: student.excusedDays,
      unexcusedDays: student.unexcusedDays,
      lateDays: student.lateDays,
      badges: student.badges || [],
    });
    setIsAddModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim()) return;

    if (editingStudent) {
      onUpdateStudent({
        ...editingStudent,
        ...formData,
      });
    } else {
      onAddStudent(formData);
    }

    setIsAddModalOpen(false);
    setEditingStudent(null);
  };

  const confirmDelete = () => {
    if (studentToDelete) {
      onDeleteStudent(studentToDelete.id);
      setStudentToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" />
            <span>Danh sách học sinh lớp</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Tổng cộng: <strong className="text-slate-800">{students.length} học sinh</strong> • Hiện lọc:{' '}
            <strong className="text-blue-600">{filteredStudents.length} em</strong>
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs md:text-sm font-bold rounded-xl shadow-md shadow-blue-500/20 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>THÊM HỌC SINH</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Tìm theo tên, SĐT phụ huynh..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs md:text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Team filter */}
        <div className="relative">
          <Filter className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <select
            value={selectedTeamFilter}
            onChange={(e) => setSelectedTeamFilter(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs md:text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
          >
            <option value="all">Tất cả các tổ</option>
            {teams.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        {/* Sort */}
        <div className="relative">
          <ArrowUpDown className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'stt' | 'name' | 'points')}
            className="w-full pl-9 pr-3 py-2 text-xs md:text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
          >
            <option value="stt">Sắp xếp theo STT</option>
            <option value="name">Sắp xếp theo Tên (A - Z)</option>
            <option value="points">Sắp xếp theo Điểm thi đua cao nhất</option>
          </select>
        </div>
      </div>

      {/* Students Table / Cards */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs md:text-sm">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase font-bold text-[11px] tracking-wider">
              <tr>
                <th className="p-3.5 text-center w-12">STT</th>
                <th className="p-3.5">Họ và tên</th>
                <th className="p-3.5">Ngày sinh / Giới tính</th>
                <th className="p-3.5">Tổ / Chức vụ</th>
                <th className="p-3.5 text-center">Điểm thi đua</th>
                <th className="p-3.5 text-center">Chuyên cần</th>
                <th className="p-3.5">Phụ huynh</th>
                <th className="p-3.5 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((st) => {
                  const team = teams.find((t) => t.id === st.teamId);
                  return (
                    <tr key={st.id} className="hover:bg-blue-50/40 transition-colors">
                      <td className="p-3.5 text-center font-bold text-slate-500">{st.stt}</td>
                      <td className="p-3.5">
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-xs shadow-xs"
                            style={{ backgroundColor: team?.color || '#3B82F6' }}
                          >
                            {st.fullName.split(' ').slice(-1)[0][0]}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block">{st.fullName}</span>
                            <div className="flex items-center gap-1 mt-0.5">
                              {st.badges &&
                                st.badges.slice(0, 3).map((bId) => {
                                  const b = badges.find((x) => x.id === bId);
                                  return b ? (
                                    <span key={bId} title={b.name} className="text-xs">
                                      {b.icon}
                                    </span>
                                  ) : null;
                                })}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-3.5 text-slate-600">
                        <span>{st.birthDate.split('-').reverse().join('/')}</span>
                        <span className="block text-[11px] text-slate-400">{st.gender}</span>
                      </td>
                      <td className="p-3.5">
                        <span
                          className="inline-block px-2 py-0.5 rounded-md text-xs font-semibold text-white mb-0.5"
                          style={{ backgroundColor: team?.color || '#64748B' }}
                        >
                          {team?.name || 'Chưa chia'}
                        </span>
                        <span className="block text-[11px] text-slate-500 font-medium">
                          {st.position}
                        </span>
                      </td>
                      <td className="p-3.5 text-center">
                        <span
                          className={`font-black text-xs px-2.5 py-1 rounded-full ${
                            st.points >= 35
                              ? 'bg-emerald-100 text-emerald-800'
                              : st.points >= 25
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {st.points} đ
                        </span>
                      </td>
                      <td className="p-3.5 text-center text-xs">
                        <span className="text-rose-600 font-bold">Vắng: {st.absentDays}</span>
                        <span className="text-slate-400 block text-[11px]">Muộn: {st.lateDays}</span>
                      </td>
                      <td className="p-3.5 text-slate-600">
                        <span className="font-medium text-slate-800 block text-xs">
                          {st.parentName} ({st.parentRelationship})
                        </span>
                        <a
                          href={`tel:${st.parentPhone}`}
                          className="text-[11px] text-blue-600 hover:underline flex items-center gap-1 mt-0.5"
                        >
                          <Phone className="w-3 h-3" />
                          <span>{st.parentPhone}</span>
                        </a>
                      </td>
                      <td className="p-3.5 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => setViewingStudent(st)}
                            title="Xem hồ sơ chi tiết"
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenEditModal(st)}
                            title="Chỉnh sửa thông tin"
                            className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setStudentToDelete(st)}
                            title="Xóa học sinh"
                            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-slate-400 text-sm">
                    Không tìm thấy học sinh nào phù hợp với bộ lọc.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Student Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl animate-in zoom-in-95 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-black text-slate-900">
                {editingStudent ? 'Chỉnh sửa thông tin học sinh' : 'Thêm học sinh mới'}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Họ và tên học sinh *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="VD: Nguyễn Minh Anh"
                    className="w-full px-3 py-2 text-xs md:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Ngày sinh</label>
                  <input
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                    className="w-full px-3 py-2 text-xs md:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Giới tính</label>
                  <select
                    value={formData.gender}
                    onChange={(e) =>
                      setFormData({ ...formData, gender: e.target.value as 'Nam' | 'Nữ' })
                    }
                    className="w-full px-3 py-2 text-xs md:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                  >
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tổ phân công</label>
                  <select
                    value={formData.teamId}
                    onChange={(e) => setFormData({ ...formData, teamId: e.target.value })}
                    className="w-full px-3 py-2 text-xs md:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                  >
                    {teams.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Chức vụ</label>
                  <select
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    className="w-full px-3 py-2 text-xs md:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                  >
                    <option value="Thành viên">Thành viên</option>
                    <option value="Lớp trưởng">Lớp trưởng</option>
                    <option value="Lớp phó học tập">Lớp phó học tập</option>
                    <option value="Lớp phó văn thể mỹ">Lớp phó văn thể mỹ</option>
                    <option value="Lớp phó lao động">Lớp phó lao động</option>
                    <option value="Tổ trưởng">Tổ trưởng</option>
                    <option value="Tổ phó">Tổ phó</option>
                    <option value="Thủ quỹ">Thủ quỹ</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Điểm thi đua ban đầu
                  </label>
                  <input
                    type="number"
                    value={formData.points}
                    onChange={(e) =>
                      setFormData({ ...formData, points: parseInt(e.target.value) || 0 })
                    }
                    className="w-full px-3 py-2 text-xs md:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Parent Info */}
              <div className="pt-2 border-t border-slate-100">
                <h4 className="text-xs font-black text-slate-500 uppercase tracking-wider mb-2">
                  Thông tin phụ huynh
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Họ tên phụ huynh
                    </label>
                    <input
                      type="text"
                      value={formData.parentName}
                      onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                      placeholder="VD: Nguyễn Văn Hùng"
                      className="w-full px-3 py-2 text-xs md:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Mối quan hệ
                    </label>
                    <select
                      value={formData.parentRelationship}
                      onChange={(e) =>
                        setFormData({ ...formData, parentRelationship: e.target.value })
                      }
                      className="w-full px-3 py-2 text-xs md:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                    >
                      <option value="Bố">Bố</option>
                      <option value="Mẹ">Mẹ</option>
                      <option value="Ông bà">Ông bà</option>
                      <option value="Người giám hộ">Người giám hộ</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Số điện thoại *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.parentPhone}
                      onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                      placeholder="0912xxxxxx"
                      className="w-full px-3 py-2 text-xs md:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Notes & Address */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Địa chỉ</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="VD: Phố Tiền An, Bắc Ninh"
                    className="w-full px-3 py-2 text-xs md:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Ghi chú của GVCN
                  </label>
                  <input
                    type="text"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Đặc điểm, lưu ý sức khỏe, năng khiếu..."
                    className="w-full px-3 py-2 text-xs md:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs"
                >
                  {editingStudent ? 'Lưu thay đổi' : 'Thêm học sinh'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Student Profile Detail Modal */}
      {viewingStudent && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-blue-600 text-white font-black text-lg flex items-center justify-center">
                  {viewingStudent.fullName.split(' ').slice(-1)[0][0]}
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">{viewingStudent.fullName}</h3>
                  <p className="text-xs text-slate-500">
                    STT: {viewingStudent.stt} • {viewingStudent.position} •{' '}
                    {teams.find((t) => t.id === viewingStudent.teamId)?.name}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setViewingStudent(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 mt-4 text-xs md:text-sm">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-xl">
                <div>
                  <span className="text-slate-500 text-xs">Ngày sinh:</span>
                  <p className="font-bold text-slate-800">
                    {viewingStudent.birthDate.split('-').reverse().join('/')} ({viewingStudent.gender})
                  </p>
                </div>
                <div>
                  <span className="text-slate-500 text-xs">Điểm thi đua:</span>
                  <p className="font-bold text-blue-600 text-base">+{viewingStudent.points} điểm</p>
                </div>
                <div>
                  <span className="text-slate-500 text-xs">Số ngày vắng:</span>
                  <p className="font-bold text-rose-600">
                    {viewingStudent.absentDays} ngày ({viewingStudent.excusedDays} phép,{' '}
                    {viewingStudent.unexcusedDays} không phép)
                  </p>
                </div>
                <div>
                  <span className="text-slate-500 text-xs">Số lần đi muộn:</span>
                  <p className="font-bold text-amber-600">{viewingStudent.lateDays} lần</p>
                </div>
              </div>

              {/* Badges list */}
              <div>
                <span className="text-xs font-bold text-slate-700 mb-1.5 block">
                  Huy hiệu đã đạt:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {viewingStudent.badges && viewingStudent.badges.length > 0 ? (
                    viewingStudent.badges.map((bId) => {
                      const b = badges.find((x) => x.id === bId);
                      return b ? (
                        <span
                          key={bId}
                          className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 font-semibold"
                        >
                          <span>{b.icon}</span>
                          <span>{b.name}</span>
                        </span>
                      ) : null;
                    })
                  ) : (
                    <span className="text-xs text-slate-400">Chưa có huy hiệu nào</span>
                  )}
                </div>
              </div>

              {/* Parents & Notes */}
              <div className="space-y-2 border-t border-slate-100 pt-3">
                <p className="text-xs">
                  <strong className="text-slate-700">Phụ huynh:</strong> {viewingStudent.parentName} (
                  {viewingStudent.parentRelationship}) - SĐT: {viewingStudent.parentPhone}
                </p>
                {viewingStudent.address && (
                  <p className="text-xs">
                    <strong className="text-slate-700">Địa chỉ:</strong> {viewingStudent.address}
                  </p>
                )}
                {viewingStudent.notes && (
                  <p className="text-xs bg-amber-50/70 p-2.5 rounded-lg border border-amber-100 text-amber-900">
                    <strong>Ghi chú GVCN:</strong> {viewingStudent.notes}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setViewingStudent(null)}
                className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl"
              >
                Đóng hồ sơ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {studentToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl animate-in zoom-in-95 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 mx-auto flex items-center justify-center mb-3">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black text-slate-900 mb-1">Xác nhận xóa học sinh</h3>
            <p className="text-xs text-slate-500 mb-4">
              Bạn có chắc chắn muốn xóa học sinh{' '}
              <strong className="text-slate-800">{studentToDelete.fullName}</strong> khỏi danh sách
              không? Thao tác này không thể hoàn tác.
            </p>
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setStudentToDelete(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Hủy bỏ
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs"
              >
                Xác nhận xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
