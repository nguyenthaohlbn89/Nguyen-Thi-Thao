import React, { useState } from 'react';
import {
  Users,
  CheckSquare,
  XCircle,
  Clock,
  HelpCircle,
  Trophy,
  Award,
  Calendar,
  Disc,
  BarChart3,
  Edit3,
  Cake,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Check,
  Flame,
} from 'lucide-react';
import {
  Student,
  Team,
  ClassSettings,
  ClassInfo,
  ClassActivity,
  AttendanceRecord,
  DutyDay,
  NavigationTab,
} from '../../types';

interface DashboardViewProps {
  settings?: ClassSettings;
  classInfo?: ClassInfo;
  students: Student[];
  teams: Team[];
  activities: ClassActivity[];
  attendances: AttendanceRecord[];
  dutySchedule?: DutyDay[];
  onNavigate?: (tab: any) => void;
  onSelectTab?: (tab: any) => void;
  onUpdateSettings?: (newSettings: ClassSettings) => void;
  onUpdateClassInfo?: (info: ClassInfo) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  settings,
  classInfo,
  students = [],
  teams = [],
  activities = [],
  attendances = [],
  dutySchedule = [],
  onNavigate,
  onSelectTab,
  onUpdateSettings,
  onUpdateClassInfo,
}) => {
  const cName = classInfo?.className || settings?.className || '6A7';
  const aYear = classInfo?.academicYear || settings?.academicYear || '2026 - 2027';
  const sName = classInfo?.schoolName || settings?.schoolName || 'THCS Tiền An';
  const tName = classInfo?.teacherName || settings?.homeroomTeacher || 'Nguyễn Văn Thuận';

  const navigateTo = (tab: any) => {
    if (onNavigate) onNavigate(tab);
    else if (onSelectTab) onSelectTab(tab);
  };

  const [isEditingClassInfo, setIsEditingClassInfo] = useState(false);
  const [editForm, setEditForm] = useState({
    schoolName: sName,
    className: cName,
    academicYear: aYear,
    homeroomTeacher: tName,
  });

  const todayStr = new Date().toISOString().split('T')[0];

  // Today attendance stats
  const todayAttendances = attendances.filter((a) => a.date === todayStr);
  const presentCount = todayAttendances.filter((a) => a.status === 'present').length;
  const absentCount = todayAttendances.filter((a) => a.status === 'absent').length;
  const lateCount = todayAttendances.filter((a) => a.status === 'late').length;
  const excusedCount = todayAttendances.filter((a) => a.status === 'excused').length;

  // Leading Team calculation: student points + team directPoints
  const teamScores = teams.map((team) => {
    const memberPoints = students
      .filter((s) => s.teamId === team.id)
      .reduce((sum, s) => sum + s.points, 0);
    const total = memberPoints + team.directPoints;
    const memberCount = students.filter((s) => s.teamId === team.id).length;
    return { ...team, totalPoints: total, memberCount };
  });
  teamScores.sort((a, b) => b.totalPoints - a.totalPoints);
  const leadingTeam = teamScores[0];

  // Top Student
  const sortedStudents = [...students].sort((a, b) => b.points - a.points);
  const topStudent = sortedStudents[0];

  // Upcoming activities
  const upcomingActivities = activities
    .filter((a) => a.status !== 'completed')
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 3);

  // Attention students: absent > 1 or late > 1 or points < 20
  const attentionStudents = students.filter(
    (s) => s.absentDays >= 2 || s.lateDays >= 2 || s.points < 20 || s.unexcusedDays >= 1
  );

  // Today Duty Day
  const dayNames = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
  const currentDayName = dayNames[new Date().getDay()];
  const todayDuty = (dutySchedule || []).find((d) => d.dayOfWeek === currentDayName);
  const dutyTeam = todayDuty?.teamId ? teams.find((t) => t.id === todayDuty.teamId) : null;

  // Upcoming birthdays (within 14 days)
  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const currentDay = today.getDate();

  const upcomingBirthdays = students
    .map((s) => {
      const parts = s.birthDate.split('-');
      if (parts.length < 3) return null;
      const bMonth = parseInt(parts[1], 10);
      const bDay = parseInt(parts[2], 10);

      let diffDays = 0;
      const thisYearBirthday = new Date(today.getFullYear(), bMonth - 1, bDay);
      if (thisYearBirthday < new Date(today.getFullYear(), today.getMonth(), today.getDate())) {
        thisYearBirthday.setFullYear(today.getFullYear() + 1);
      }
      const diffTime = thisYearBirthday.getTime() - new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
      diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      return {
        ...s,
        daysLeft: diffDays,
        isToday: bMonth === currentMonth && bDay === currentDay,
      };
    })
    .filter((s): s is NonNullable<typeof s> => s !== null && s.daysLeft <= 14)
    .sort((a, b) => a.daysLeft - b.daysLeft);

  const handleSaveInfo = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateSettings && settings) {
      onUpdateSettings({
        ...settings,
        ...editForm,
      });
    }
    if (onUpdateClassInfo) {
      onUpdateClassInfo({
        schoolName: editForm.schoolName,
        className: editForm.className,
        academicYear: editForm.academicYear,
        teacherName: editForm.homeroomTeacher,
        initialPoints: classInfo?.initialPoints ?? 30,
        maxPointsPerAction: classInfo?.maxPointsPerAction ?? 10,
      });
    }
    setIsEditingClassInfo(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Hero Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 p-6 md:p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-amber-400 text-amber-950 text-xs font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                GVCN 360 PRO
              </span>
              <span className="text-xs font-medium text-blue-200">Bản quyền Giáo Thuận AI</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              TRỢ LÝ SỐ CHO GIÁO VIÊN CHỦ NHIỆM
            </h2>
            <p className="text-blue-100 text-sm md:text-base max-w-xl leading-relaxed">
              Quản lý lớp học thông minh, số hóa điểm danh, thi đua nề nếp, sổ liên lạc phụ huynh và tổng hợp báo cáo chuyên nghiệp.
            </p>

            {/* Class Info Badges */}
            <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
              <span className="bg-white/20 backdrop-blur-xs px-3 py-1 rounded-lg font-semibold">
                Trường: {sName}
              </span>
              <span className="bg-white/20 backdrop-blur-xs px-3 py-1 rounded-lg font-semibold">
                Lớp: {cName}
              </span>
              <span className="bg-white/20 backdrop-blur-xs px-3 py-1 rounded-lg font-semibold">
                Năm học: {aYear}
              </span>
              <span className="bg-amber-300 text-amber-950 px-3 py-1 rounded-lg font-bold">
                GVCN: {tName}
              </span>
              <button
                onClick={() => setIsEditingClassInfo(true)}
                className="inline-flex items-center gap-1 bg-white text-blue-800 hover:bg-blue-50 px-2.5 py-1 rounded-lg font-bold transition-all shadow-xs"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Sửa thông tin</span>
              </button>
            </div>
          </div>

          {/* Today duty fast highlight */}
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 flex flex-col justify-center min-w-[220px]">
            <span className="text-xs text-blue-200 font-medium">Trực nhật hôm nay ({currentDayName})</span>
            <div className="text-lg font-black text-amber-300 mt-1 flex items-center gap-2">
              <span>{dutyTeam ? dutyTeam.name : 'Chưa phân công'}</span>
            </div>
            <p className="text-xs text-blue-100 mt-1 line-clamp-1">
              {todayDuty ? todayDuty.tasks : 'Chưa có lịch'}
            </p>
            <button
              onClick={() => navigateTo('activities')}
              className="mt-3 text-xs font-semibold text-white/90 hover:text-white flex items-center gap-1 self-start"
            >
              <span>Xem kế hoạch lớp</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Action Navigation Grid */}
      <div>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
          Truy cập nhanh chức năng
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <button
            onClick={() => navigateTo('attendance')}
            className="flex flex-col items-center justify-center p-4 rounded-xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all group text-center"
          >
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <CheckSquare className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-slate-800">✅ Điểm danh</span>
            <span className="text-[11px] text-slate-500 mt-0.5">Nhanh chóng</span>
          </button>

          <button
            onClick={() => navigateTo('competition')}
            className="flex flex-col items-center justify-center p-4 rounded-xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all group text-center"
          >
            <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Trophy className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-slate-800">🏆 Thi đua</span>
            <span className="text-[11px] text-slate-500 mt-0.5">Cộng / trừ điểm</span>
          </button>

          <button
            onClick={() => navigateTo('wheel')}
            className="flex flex-col items-center justify-center p-4 rounded-xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all group text-center"
          >
            <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Disc className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-slate-800">🎡 Vòng quay</span>
            <span className="text-[11px] text-slate-500 mt-0.5">Gọi tên ngẫu nhiên</span>
          </button>

          <button
            onClick={() => navigateTo('students')}
            className="flex flex-col items-center justify-center p-4 rounded-xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all group text-center"
          >
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-slate-800">👨‍🎓 Học sinh</span>
            <span className="text-[11px] text-slate-500 mt-0.5">Hồ sơ 20 em</span>
          </button>

          <button
            onClick={() => navigateTo('activities')}
            className="flex flex-col items-center justify-center p-4 rounded-xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all group text-center"
          >
            <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Calendar className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-slate-800">📅 Hoạt động</span>
            <span className="text-[11px] text-slate-500 mt-0.5">Kế hoạch lớp</span>
          </button>

          <button
            onClick={() => navigateTo('reports')}
            className="flex flex-col items-center justify-center p-4 rounded-xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all group text-center"
          >
            <div className="w-11 h-11 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <BarChart3 className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-slate-800">📊 Báo cáo</span>
            <span className="text-[11px] text-slate-500 mt-0.5">Số liệu trực quan</span>
          </button>
        </div>
      </div>

      {/* Main Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Students */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Tổng số học sinh</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-black text-slate-900">{students.length}</span>
            <span className="text-xs text-slate-500 font-medium">100% sĩ số</span>
          </div>
        </div>

        {/* Present Today */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Có mặt hôm nay</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-black text-emerald-600">{presentCount}</span>
            <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
              {students.length > 0 ? Math.round((presentCount / students.length) * 100) : 0}%
            </span>
          </div>
        </div>

        {/* Absent */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Vắng hôm nay</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-black text-rose-600">{absentCount}</span>
            <span className="text-xs text-slate-400 font-medium">Học sinh</span>
          </div>
        </div>

        {/* Late Today */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Đi muộn</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-black text-amber-600">{lateCount}</span>
            <span className="text-xs text-slate-400 font-medium">Cần nhắc nhở</span>
          </div>
        </div>

        {/* Excused */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Nghỉ có phép</span>
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
              <HelpCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-black text-sky-600">{excusedCount}</span>
            <span className="text-xs text-slate-400 font-medium">Có đơn PH</span>
          </div>
        </div>
      </div>

      {/* Highlights & Rankings Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leading Team Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                <Trophy className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-800 text-sm">Tổ đang dẫn đầu</h3>
            </div>
            <span className="text-xs font-black text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
              HẠNG 1 🥇
            </span>
          </div>

          {leadingTeam ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-md"
                  style={{ backgroundColor: leadingTeam.color }}
                >
                  🏆
                </div>
                <div>
                  <h4 className="text-lg font-black text-slate-900">{leadingTeam.name}</h4>
                  <p className="text-xs text-slate-500">{leadingTeam.description || 'Hoạt động năng nổ'}</p>
                </div>
              </div>
              <div className="bg-slate-50 rounded-xl p-3 flex items-center justify-between text-xs">
                <span className="text-slate-600">Tổng điểm thi đua:</span>
                <span className="text-base font-black text-amber-600">{leadingTeam.totalPoints} điểm</span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-400">Chưa có dữ liệu thi đua</p>
          )}

          <button
            onClick={() => onNavigate('teams')}
            className="mt-4 text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1.5 pt-3 border-t border-slate-100"
          >
            <span>Xem bảng xếp hạng các tổ</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Top Student Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-800 text-sm">Học sinh nổi bật tuần</h3>
            </div>
            <span className="text-xs font-black text-indigo-600 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full">
              TOP 1 🌟
            </span>
          </div>

          {topStudent ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-black text-lg flex items-center justify-center shadow-md">
                  {topStudent.fullName.split(' ').slice(-1)[0][0]}
                </div>
                <div>
                  <h4 className="text-lg font-black text-slate-900">{topStudent.fullName}</h4>
                  <p className="text-xs text-slate-500">
                    {topStudent.position} • {teams.find((t) => t.id === topStudent.teamId)?.name}
                  </p>
                </div>
              </div>
              <div className="bg-slate-50 rounded-xl p-3 flex items-center justify-between text-xs">
                <span className="text-slate-600">Điểm rèn luyện cá nhân:</span>
                <span className="text-base font-black text-indigo-600">+{topStudent.points} điểm</span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-400">Chưa có dữ liệu</p>
          )}

          <button
            onClick={() => onNavigate('leaderboard')}
            className="mt-4 text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1.5 pt-3 border-t border-slate-100"
          >
            <span>Xem Top 10 học sinh</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Upcoming Activities Widget */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-800 text-sm">Hoạt động sắp tới</h3>
            </div>
            <span className="text-xs font-semibold text-slate-400">{upcomingActivities.length} sự kiện</span>
          </div>

          <div className="space-y-2.5 flex-1">
            {upcomingActivities.length > 0 ? (
              upcomingActivities.map((act) => (
                <div
                  key={act.id}
                  className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors border border-slate-100"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 line-clamp-1">{act.title}</span>
                    <span className="text-[10px] font-semibold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">
                      {act.date.split('-').reverse().slice(0, 2).join('/')}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{act.leadPerson} • {act.location || 'Tại lớp'}</p>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 text-center py-4">Chưa có kế hoạch mới</p>
            )}
          </div>

          <button
            onClick={() => onNavigate('activities')}
            className="mt-4 text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1.5 pt-3 border-t border-slate-100"
          >
            <span>Xem lịch hoạt động lớp</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Birthday & Attention Dual Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Birthday Card */}
        <div className="bg-gradient-to-br from-pink-50 to-rose-50 p-5 rounded-2xl border border-pink-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-rose-700">
              <Cake className="w-5 h-5" />
              <h3 className="font-black text-sm">🎂 Sinh nhật sắp tới</h3>
            </div>
            <button
              onClick={() => onNavigate('birthdays')}
              className="text-xs font-bold text-rose-600 hover:underline"
            >
              Xem tất cả
            </button>
          </div>

          {upcomingBirthdays.length > 0 ? (
            <div className="space-y-2">
              {upcomingBirthdays.slice(0, 2).map((st) => (
                <div
                  key={st.id}
                  className="bg-white/90 p-3 rounded-xl border border-pink-100 flex items-center justify-between"
                >
                  <div>
                    <p className="text-xs font-bold text-slate-800">{st.fullName}</p>
                    <p className="text-[11px] text-slate-500">
                      Ngày sinh: {st.birthDate.split('-').reverse().join('/')}
                    </p>
                  </div>
                  {st.isToday ? (
                    <span className="text-xs font-black text-white bg-rose-500 px-2.5 py-1 rounded-full animate-bounce">
                      Hôm nay 🎉
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-rose-700 bg-rose-100 px-2.5 py-1 rounded-full">
                      Còn {st.daysLeft} ngày
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 py-3">Không có sinh nhật nào trong 2 tuần tới.</p>
          )}
        </div>

        {/* Attention Needed Card */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-5 rounded-2xl border border-amber-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-amber-800">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="font-black text-sm">⚠️ Học sinh cần quan tâm ({attentionStudents.length})</h3>
            </div>
            <button
              onClick={() => onNavigate('attention')}
              className="text-xs font-bold text-amber-700 hover:underline"
            >
              Chi tiết
            </button>
          </div>

          {attentionStudents.length > 0 ? (
            <div className="space-y-2">
              {attentionStudents.slice(0, 2).map((st) => (
                <div
                  key={st.id}
                  className="bg-white/90 p-3 rounded-xl border border-amber-100 flex items-center justify-between"
                >
                  <div>
                    <p className="text-xs font-bold text-slate-800">{st.fullName}</p>
                    <p className="text-[11px] text-amber-700">
                      {st.absentDays > 0 && `Vắng: ${st.absentDays} buổi • `}
                      {st.lateDays > 0 && `Muộn: ${st.lateDays} lần • `}
                      Điểm: {st.points}
                    </p>
                  </div>
                  <span className="text-[11px] font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                    Cần theo dõi
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 py-3">Không có học sinh nào trong diện cảnh báo.</p>
          )}
        </div>
      </div>

      {/* Edit Class Info Modal */}
      {isEditingClassInfo && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95">
            <h3 className="text-lg font-black text-slate-900 mb-4">Cập nhật thông tin lớp học</h3>
            <form onSubmit={handleSaveInfo} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tên trường</label>
                <input
                  type="text"
                  value={editForm.schoolName}
                  onChange={(e) => setEditForm({ ...editForm, schoolName: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tên lớp</label>
                <input
                  type="text"
                  value={editForm.className}
                  onChange={(e) => setEditForm({ ...editForm, className: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Năm học</label>
                <input
                  type="text"
                  value={editForm.academicYear}
                  onChange={(e) => setEditForm({ ...editForm, academicYear: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tên giáo viên chủ nhiệm</label>
                <input
                  type="text"
                  value={editForm.homeroomTeacher}
                  onChange={(e) => setEditForm({ ...editForm, homeroomTeacher: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsEditingClassInfo(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs"
                >
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
