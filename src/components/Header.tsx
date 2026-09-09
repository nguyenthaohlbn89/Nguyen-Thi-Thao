import React from 'react';
import { Menu, Volume2, VolumeX, Sparkles, Plus, CheckSquare, Trophy, Disc } from 'lucide-react';
import { ClassSettings, ClassInfo, NavigationTab } from '../types';

interface HeaderProps {
  settings?: ClassSettings;
  classInfo?: ClassInfo;
  currentTab?: string;
  onOpenMobileNav?: () => void;
  onToggleSound?: () => void;
  onNavigate?: (tab: any) => void;
  onSelectTab?: (tab: any) => void;
  onQuickAddStudent?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  classInfo,
  currentTab,
  onOpenMobileNav = () => {},
  onToggleSound = () => {},
  onNavigate,
  onSelectTab,
  onQuickAddStudent = () => {},
}) => {
  const cName = classInfo?.className || settings?.className || '6A7';
  const aYear = classInfo?.academicYear || settings?.academicYear || '2026 - 2027';
  const sName = classInfo?.schoolName || settings?.schoolName || 'THCS Tiền An';
  const tName = classInfo?.teacherName || settings?.homeroomTeacher || 'Nguyễn Văn Thuận';
  const soundEnabled = settings?.soundEnabled ?? true;

  const navigateTo = (tab: string) => {
    if (onNavigate) onNavigate(tab);
    else if (onSelectTab) onSelectTab(tab);
  };

  // Format current date in Vietnamese
  const today = new Date();
  const dayNames = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
  const formattedDate = `${dayNames[today.getDay()]}, ${String(today.getDate()).padStart(2, '0')}/${String(
    today.getMonth() + 1
  ).padStart(2, '0')}/${today.getFullYear()}`;

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 lg:px-8 py-3 flex items-center justify-between transition-all">
      {/* Left section: Hamburger & Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileNav}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 focus:outline-none"
          aria-label="Mở menu"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg md:text-xl font-black text-slate-900 tracking-tight">
              {cName} - {sName}
            </h1>
            <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
              {aYear}
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium hidden sm:block">
            {formattedDate} • GVCN: {tName}
          </p>
        </div>
      </div>

      {/* Right section: Quick action buttons */}
      <div className="flex items-center gap-2">
        {/* Quick actions on larger screens */}
        <div className="hidden md:flex items-center gap-1.5 mr-2">
          <button
            onClick={() => navigateTo('attendance')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors border border-emerald-200"
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Điểm danh</span>
          </button>
          <button
            onClick={() => navigateTo('competition')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors border border-amber-200"
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Thi đua</span>
          </button>
          <button
            onClick={() => navigateTo('wheel')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors border border-purple-200"
          >
            <Disc className="w-3.5 h-3.5" />
            <span>Vòng quay</span>
          </button>
        </div>

        {/* Quick Add Student Button */}
        <button
          onClick={onQuickAddStudent}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs md:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Thêm học sinh</span>
        </button>

        {/* Sound toggle */}
        <button
          onClick={onToggleSound}
          title={soundEnabled ? 'Tắt âm thanh hiệu ứng' : 'Bật âm thanh hiệu ứng'}
          className={`p-2 rounded-xl border transition-colors ${
            soundEnabled
              ? 'text-blue-600 bg-blue-50 border-blue-200 hover:bg-blue-100'
              : 'text-slate-400 bg-slate-100 border-slate-200 hover:text-slate-600'
          }`}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
};
