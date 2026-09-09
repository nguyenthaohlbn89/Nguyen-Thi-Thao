import React, { useState } from 'react';
import {
  Settings,
  Save,
  RotateCcw,
  Upload,
  Download,
  ShieldAlert,
  School,
  User,
  Calendar,
  Sparkles,
  Check,
} from 'lucide-react';
import { ClassInfo } from '../../types';

interface SettingsViewProps {
  classInfo: ClassInfo;
  onUpdateClassInfo: (info: ClassInfo) => void;
  onResetToDefault: () => void;
  onExportBackup: () => void;
  onImportBackup: (jsonString: string) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  classInfo,
  onUpdateClassInfo,
  onResetToDefault,
  onExportBackup,
  onImportBackup,
}) => {
  const [formData, setFormData] = useState<ClassInfo>({ ...classInfo });
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateClassInfo(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        onImportBackup(content);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Settings className="w-6 h-6 text-slate-700" />
            <span>Cài đặt lớp học & Hệ thống</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Cấu hình thông tin lớp 6A7, niên khóa, giáo viên chủ nhiệm và quản lý sao lưu dữ liệu
          </p>
        </div>

        {isSaved && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold animate-in fade-in">
            <Check className="w-4 h-4" />
            <span>Đã lưu thành công!</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Settings Form */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-2">
              Thông tin hành chính lớp
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tên trường học *
                </label>
                <div className="relative">
                  <School className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={formData.schoolName}
                    onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 text-xs md:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tên lớp học *</label>
                <input
                  type="text"
                  required
                  value={formData.className}
                  onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                  className="w-full px-3 py-2 text-xs md:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Niên khóa *</label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={formData.academicYear}
                    onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 text-xs md:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Giáo viên chủ nhiệm *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={formData.teacherName}
                    onChange={(e) => setFormData({ ...formData, teacherName: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 text-xs md:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Điểm thi đua ban đầu (cho học sinh mới)
                </label>
                <input
                  type="number"
                  value={formData.initialPoints}
                  onChange={(e) =>
                    setFormData({ ...formData, initialPoints: parseInt(e.target.value) || 0 })
                  }
                  className="w-full px-3 py-2 text-xs md:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Điểm cộng/trừ tối đa 1 lần
                </label>
                <input
                  type="number"
                  value={formData.maxPointsPerAction}
                  onChange={(e) =>
                    setFormData({ ...formData, maxPointsPerAction: parseInt(e.target.value) || 10 })
                  }
                  className="w-full px-3 py-2 text-xs md:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs md:text-sm rounded-xl shadow-md shadow-blue-500/20 active:scale-95 transition-all"
              >
                <Save className="w-4 h-4" />
                <span>LƯU CẤU HÌNH</span>
              </button>
            </div>
          </form>
        </div>

        {/* Backup & System Reset */}
        <div className="space-y-4">
          {/* Backup & Restore */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider">
              Sao lưu & Phục hồi dữ liệu
            </h3>
            <p className="text-xs text-slate-500">
              Tải file dự phòng toàn bộ dữ liệu lớp học về máy hoặc nạp lại khi đổi trình duyệt.
            </p>

            <button
              onClick={onExportBackup}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors"
            >
              <Download className="w-4 h-4 text-blue-600" />
              <span>Tải file sao lưu (JSON)</span>
            </button>

            <label className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl cursor-pointer transition-colors">
              <Upload className="w-4 h-4 text-emerald-600" />
              <span>Nạp file sao lưu từ máy</span>
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Reset To Default */}
          <div className="bg-rose-50/70 p-5 rounded-2xl border border-rose-200 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-rose-800 font-black text-xs uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <span>Khôi phục dữ liệu gốc</span>
            </div>
            <p className="text-xs text-rose-700 leading-relaxed">
              Xóa các thay đổi tạm thời và đưa lớp về danh sách mẫu 20 học sinh ban đầu của trường Tiền An.
            </p>

            <button
              onClick={() => setShowResetConfirm(true)}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Đặt lại dữ liệu mẫu</span>
            </button>
          </div>
        </div>
      </div>

      {/* Reset Confirmation Dialog */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl animate-in zoom-in-95 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 mx-auto flex items-center justify-center mb-3">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black text-slate-900 mb-1">Xác nhận khôi phục mẫu</h3>
            <p className="text-xs text-slate-500 mb-4">
              Toàn bộ dữ liệu điểm danh và thi đua hiện tại sẽ được thay thế bằng bộ dữ liệu mẫu chuẩn của lớp 6A7. Bạn có chắc chắn không?
            </p>
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Hủy bỏ
              </button>
              <button
                onClick={() => {
                  onResetToDefault();
                  setShowResetConfirm(false);
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs"
              >
                Đồng ý khôi phục
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
