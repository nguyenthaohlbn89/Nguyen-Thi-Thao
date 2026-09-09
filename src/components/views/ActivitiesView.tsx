import React, { useState } from 'react';
import {
  Calendar,
  Plus,
  Clock,
  MapPin,
  Edit2,
  Trash2,
  CheckCircle2,
  Filter,
  X,
  Sparkles,
} from 'lucide-react';
import { ClassActivity } from '../../types';

interface ActivitiesViewProps {
  activities: ClassActivity[];
  onAddActivity: (act: Omit<ClassActivity, 'id'>) => void;
  onUpdateActivity: (act: ClassActivity) => void;
  onDeleteActivity: (actId: string) => void;
}

export const ActivitiesView: React.FC<ActivitiesViewProps> = ({
  activities,
  onAddActivity,
  onUpdateActivity,
  onDeleteActivity,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<ClassActivity | null>(null);
  const [filterType, setFilterType] = useState<string>('all');

  const initialForm = {
    title: '',
    date: new Date().toISOString().split('T')[0],
    time: '08:00',
    location: 'Phòng học 6A7',
    type: 'event' as 'event' | 'exam' | 'duty' | 'meeting' | 'extracurricular',
    notes: '',
    status: 'upcoming' as 'upcoming' | 'ongoing' | 'completed',
  };

  const [formData, setFormData] = useState(initialForm);

  const typeLabels: Record<string, { label: string; color: string }> = {
    event: { label: 'Sự kiện lớp', color: 'bg-blue-100 text-blue-800' },
    exam: { label: 'Kiểm tra', color: 'bg-rose-100 text-rose-800' },
    duty: { label: 'Trực nhật', color: 'bg-amber-100 text-amber-800' },
    meeting: { label: 'Họp phụ huynh', color: 'bg-purple-100 text-purple-800' },
    extracurricular: { label: 'Ngoại khóa', color: 'bg-emerald-100 text-emerald-800' },
  };

  const filteredActivities = activities
    .filter((a) => (filterType === 'all' ? true : a.type === filterType))
    .sort((a, b) => a.date.localeCompare(b.date));

  const handleOpenAdd = () => {
    setEditingActivity(null);
    setFormData(initialForm);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (act: ClassActivity) => {
    setEditingActivity(act);
    setFormData({
      title: act.title,
      date: act.date,
      time: act.time || '08:00',
      location: act.location || 'Phòng học 6A7',
      type: act.type,
      notes: act.notes || '',
      status: act.status,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    if (editingActivity) {
      onUpdateActivity({
        ...editingActivity,
        ...formData,
      });
    } else {
      onAddActivity(formData);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-blue-600" />
            <span>Hoạt động & Lịch trình lớp 6A7</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Quản lý sự kiện, lịch kiểm tra, họp phụ huynh, trực nhật và hoạt động ngoại khóa
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs md:text-sm rounded-xl shadow-md shadow-blue-500/20 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>THÊM HOẠT ĐỘNG MỚI</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
        <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5 px-2">
          <Filter className="w-3.5 h-3.5" />
          <span>Lọc loại:</span>
        </span>
        {[
          { id: 'all', label: 'Tất cả' },
          { id: 'event', label: 'Sự kiện' },
          { id: 'exam', label: 'Lịch kiểm tra' },
          { id: 'duty', label: 'Trực nhật' },
          { id: 'meeting', label: 'Họp phụ huynh' },
          { id: 'extracurricular', label: 'Ngoại khóa' },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setFilterType(t.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              filterType === t.id
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Activities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredActivities.length > 0 ? (
          filteredActivities.map((act) => {
            const badge = typeLabels[act.type] || {
              label: 'Hoạt động',
              color: 'bg-slate-100 text-slate-800',
            };

            return (
              <div
                key={act.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${badge.color}`}
                    >
                      {badge.label}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        act.status === 'completed'
                          ? 'bg-slate-100 text-slate-500'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {act.status === 'completed' ? 'Đã diễn ra' : 'Sắp diễn ra'}
                    </span>
                  </div>

                  <h3 className="font-black text-slate-900 text-base line-clamp-2 mt-1">
                    {act.title}
                  </h3>

                  <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-blue-600" />
                      <span>{act.date.split('-').reverse().join('/')}</span>
                      {act.time && (
                        <>
                          <span>•</span>
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{act.time}</span>
                        </>
                      )}
                    </div>

                    {act.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-rose-500" />
                        <span>{act.location}</span>
                      </div>
                    )}

                    {act.notes && (
                      <p className="text-[11px] text-slate-400 pt-1 border-t border-slate-100 mt-2">
                        {act.notes}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleOpenEdit(act)}
                    className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteActivity(act.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-400">
            <Calendar className="w-12 h-12 mx-auto text-slate-300 mb-2" />
            <p className="font-bold text-sm">Chưa có hoạt động nào phù hợp</p>
          </div>
        )}
      </div>

      {/* Add / Edit Activity Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900">
                {editingActivity ? 'Chỉnh sửa hoạt động' : 'Thêm hoạt động mới'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tên hoạt động / Sự kiện *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="VD: Kiểm tra giữa kỳ môn Toán"
                  className="w-full px-3 py-2 text-xs md:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Loại hoạt động</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="event">Sự kiện lớp</option>
                    <option value="exam">Lịch kiểm tra</option>
                    <option value="duty">Trực nhật</option>
                    <option value="meeting">Họp phụ huynh</option>
                    <option value="extracurricular">Ngoại khóa</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Trạng thái</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="upcoming">Sắp diễn ra</option>
                    <option value="ongoing">Đang diễn ra</option>
                    <option value="completed">Đã hoàn thành</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Ngày diễn ra</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Giờ diễn ra</label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Địa điểm</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="VD: Phòng học 6A7 hoặc Sân trường"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Ghi chú thêm</label>
                <input
                  type="text"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Nội dung cần chuẩn bị, trang phục..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs"
                >
                  {editingActivity ? 'Lưu thay đổi' : 'Thêm hoạt động'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
