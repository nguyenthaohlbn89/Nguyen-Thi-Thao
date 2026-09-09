import React, { useState } from 'react';
import {
  FileText,
  Download,
  Calendar,
  Trophy,
  AlertTriangle,
  UserCheck,
  TrendingUp,
  Award,
  Layers,
  Sparkles,
} from 'lucide-react';
import { Student, Team, AttendanceRecord, CompetitionLog } from '../../types';
import {
  exportStudentsToCSV,
  exportAttendanceToCSV,
  exportCompetitionToCSV,
} from '../../utils/export';

interface ReportsViewProps {
  students: Student[];
  teams: Team[];
  attendances: AttendanceRecord[];
  competitionLogs: CompetitionLog[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  students,
  teams,
  attendances,
  competitionLogs,
}) => {
  const [reportPeriod, setReportPeriod] = useState<'week' | 'month' | 'semester'>('week');

  // Calculations
  const totalStudents = students.length;
  const totalPoints = students.reduce((sum, s) => sum + s.points, 0);

  // Top Student
  const topStudent = [...students].sort((a, b) => b.points - a.points)[0];

  // Needs Attention (highest absent or lowest points)
  const studentsNeedingAttention = [...students]
    .filter((s) => s.absentDays >= 2 || s.points < 25)
    .sort((a, b) => b.absentDays - a.absentDays);

  // Top Team
  const teamScores = teams.map((team) => {
    const memberPoints = students
      .filter((s) => s.teamId === team.id)
      .reduce((sum, s) => sum + s.points, 0);
    return {
      ...team,
      totalPoints: memberPoints + team.directPoints,
    };
  });
  const topTeam = [...teamScores].sort((a, b) => b.totalPoints - a.totalPoints)[0];

  // Overall attendance rate
  const totalAbsentCount = students.reduce((sum, s) => sum + s.absentDays, 0);
  const avgAttendanceRate = Math.round(
    Math.max(0, 100 - (totalAbsentCount / (totalStudents * 20)) * 100)
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-600" />
            <span>Báo cáo tổng hợp & Xuất dữ liệu Excel</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Tổng kết đánh giá hoạt động lớp định kỳ và kết xuất hồ sơ báo cáo Ban Giám Hiệu
          </p>
        </div>

        {/* Period toggle */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl">
          <button
            onClick={() => setReportPeriod('week')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              reportPeriod === 'week'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Báo cáo Tuần
          </button>
          <button
            onClick={() => setReportPeriod('month')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              reportPeriod === 'month'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Báo cáo Tháng
          </button>
          <button
            onClick={() => setReportPeriod('semester')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              reportPeriod === 'semester'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Báo cáo Học kỳ
          </button>
        </div>
      </div>

      {/* Export Buttons Action Card */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 p-6 rounded-3xl text-white shadow-lg space-y-4">
        <div>
          <h3 className="text-base font-black flex items-center gap-2">
            <Download className="w-5 h-5 text-amber-400" />
            <span>XUẤT BÁO CÁO EXCEL (CSV UTF-8 TIẾNG VIỆT)</span>
          </h3>
          <p className="text-xs text-blue-200 mt-1">
            File định dạng CSV chuẩn hóa font tiếng Việt mở trực tiếp bằng Microsoft Excel không bị lỗi phông chữ.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            onClick={() => exportStudentsToCSV(students, teams)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-xs font-bold transition-all active:scale-95"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Xuất danh sách học sinh</span>
          </button>

          <button
            onClick={() => exportAttendanceToCSV(attendances, students)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-xs font-bold transition-all active:scale-95"
          >
            <Download className="w-4 h-4 text-amber-400" />
            <span>Xuất bảng điểm danh</span>
          </button>

          <button
            onClick={() => exportCompetitionToCSV(students, teams, competitionLogs)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-xs font-bold transition-all active:scale-95"
          >
            <Download className="w-4 h-4 text-sky-400" />
            <span>Xuất bảng thi đua & nhật ký</span>
          </button>
        </div>
      </div>

      {/* Report Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Tỷ lệ chuyên cần</span>
            <UserCheck className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-emerald-600">{avgAttendanceRate}%</p>
          <span className="text-[11px] text-slate-400">Đánh giá chung: Rất tốt</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Tổng điểm thi đua</span>
            <TrendingUp className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl font-black text-blue-600">{totalPoints} điểm</p>
          <span className="text-[11px] text-slate-400">Trung bình: {Math.round(totalPoints / totalStudents)} đ/em</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Học sinh xuất sắc</span>
            <Trophy className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-base font-black text-slate-900 truncate">
            {topStudent ? topStudent.fullName : 'N/A'}
          </p>
          <span className="text-[11px] text-amber-600 font-bold">
            {topStudent ? `+${topStudent.points} điểm dẫn đầu` : ''}
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Tổ dẫn đầu</span>
            <Layers className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-base font-black text-slate-900 truncate">
            {topTeam ? topTeam.name : 'N/A'}
          </p>
          <span className="text-[11px] text-purple-600 font-bold">
            {topTeam ? `${topTeam.totalPoints} điểm tổng` : ''}
          </span>
        </div>
      </div>

      {/* Two Columns: Top Honors vs Attention List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Outstanding Students */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-slate-900 font-black text-sm">
            <Award className="w-4 h-4 text-amber-500" />
            <span>Danh sách tuyên dương & Khen thưởng</span>
          </div>

          <div className="divide-y divide-slate-100">
            {students.slice(0, 5).map((s, idx) => (
              <div key={s.id} className="py-2.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-amber-600 w-5">#{idx + 1}</span>
                  <span className="font-bold text-slate-800">{s.fullName}</span>
                </div>
                <span className="font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  +{s.points} đ
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Attention needed students */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-slate-900 font-black text-sm">
            <AlertTriangle className="w-4 h-4 text-rose-500" />
            <span>Học sinh cần GVCN quan tâm & Nhắc nhở</span>
          </div>

          <div className="divide-y divide-slate-100">
            {studentsNeedingAttention.length > 0 ? (
              studentsNeedingAttention.map((s) => (
                <div key={s.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-800 block">{s.fullName}</span>
                    <span className="text-[11px] text-slate-400">
                      SĐT PH: {s.parentPhone} ({s.parentName})
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-rose-600 font-bold block">Vắng {s.absentDays} buổi</span>
                    <span className="text-slate-400 text-[11px]">{s.points} điểm thi đua</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center py-6 text-xs text-slate-400">
                Tất cả học sinh đều duy trì nề nếp tốt!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
