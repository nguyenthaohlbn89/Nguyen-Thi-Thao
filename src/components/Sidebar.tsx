import React from 'react';
import {
  LayoutDashboard,
  Users,
  CheckSquare,
  Trophy,
  Disc,
  CalendarDays,
  ListTodo,
  Sparkles,
  Award,
  Cake,
  ShieldAlert,
  BookOpen,
  PhoneCall,
  BarChart3,
  Settings,
  Bot,
  FileDown,
  Layers,
  FileSpreadsheet,
  AlertTriangle,
  UserCheck,
  X,
  GraduationCap,
} from 'lucide-react';
import { NavigationTab, ClassSettings, ClassInfo } from '../types';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: any) => void;
  settings?: ClassSettings;
  classInfo?: ClassInfo;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  attentionCount?: number;
  birthdayCount?: number;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  badgeColor?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  settings,
  classInfo,
  isOpenMobile = false,
  onCloseMobile = () => {},
  attentionCount = 0,
  birthdayCount = 0,
}) => {
  const cName = classInfo?.className || settings?.className || '6A7';
  const aYear = classInfo?.academicYear || settings?.academicYear || '2026 - 2027';
  const sName = classInfo?.schoolName || settings?.schoolName || 'THCS Tiền An';
  const tName = classInfo?.teacherName || settings?.homeroomTeacher || 'Nguyễn Văn Thuận';

  const mainNavItems: NavItem[] = [
    { id: 'dashboard', label: 'Tổng quan', icon: LayoutDashboard },
    { id: 'students', label: 'Học sinh', icon: Users },
    { id: 'teams', label: 'Chia tổ & Đội', icon: Layers },
    { id: 'attendance', label: 'Điểm danh hằng ngày', icon: CheckSquare },
    { id: 'attendance_stats', label: 'Thống kê chuyên cần', icon: UserCheck },
    { id: 'competition', label: 'Thi đua học sinh', icon: Trophy },
    { id: 'leaderboard', label: 'Bảng xếp hạng', icon: Award },
    { id: 'badges', label: 'Huy hiệu khen thưởng', icon: Sparkles },
    { id: 'wheel', label: 'Vòng quay gọi tên', icon: Disc },
    { id: 'grouping', label: 'Chia nhóm ngẫu nhiên', icon: Users },
    { id: 'activities', label: 'Hoạt động lớp', icon: CalendarDays },
    { id: 'reports', label: 'Báo cáo & Thống kê', icon: BarChart3 },
    { id: 'ai_assistant', label: 'Trợ lý A.I GVCN', icon: Bot },
    { id: 'settings', label: 'Cài đặt hệ thống', icon: Settings },
  ];

  const handleItemClick = (tab: string) => {
    onSelectTab(tab);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-blue-900 tracking-tight text-base">GVCN 360</span>
                <span className="text-[10px] uppercase font-bold bg-amber-500 text-white px-1.5 py-0.5 rounded-full">PRO</span>
              </div>
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                {cName} • {aYear}
              </p>
            </div>
          </div>
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Subheader info */}
        <div className="px-4 py-2.5 bg-blue-50/60 border-b border-blue-100/60 flex items-center justify-between text-xs text-blue-900">
          <span className="font-medium truncate">{sName}</span>
          <span className="font-semibold text-blue-700 truncate max-w-[110px]">{tName}</span>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1 scrollbar-thin scrollbar-thumb-slate-200">
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              currentTab === item.id ||
              (item.id === 'wheel' && currentTab === 'lucky-wheel') ||
              (item.id === 'attendance_stats' && currentTab === 'attendance-stats') ||
              (item.id === 'ai_assistant' && currentTab === 'ai-assistant');
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs md:text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs font-semibold'
                    : 'text-slate-700 hover:bg-slate-100/80 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3 truncate">
                  <Icon
                    className={`w-4 h-4 flex-shrink-0 ${
                      isActive ? 'text-white' : 'text-slate-400'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && item.badge > 0 && (
                  <span
                    className={`text-[11px] text-white px-2 py-0.5 rounded-full font-bold shadow-xs ${
                      item.badgeColor || 'bg-blue-500'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer Brand */}
        <div className="p-3.5 border-t border-slate-100 bg-slate-50/70">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-800 tracking-wide">GIÁO THUẬN AI</p>
              <p className="text-[10px] text-slate-500">Ứng dụng A.I trong giảng dạy</p>
            </div>
            <span className="text-[10px] bg-slate-200 text-slate-600 font-mono px-2 py-0.5 rounded">v2.6</span>
          </div>
        </div>
      </aside>
    </>
  );
};
