import React, { useState, useMemo } from 'react';
import {
  UserCheck,
  TrendingUp,
  Award,
  AlertTriangle,
  Search,
  Filter,
  BarChart,
} from 'lucide-react';
import { Student, AttendanceRecord, Team } from '../../types';

interface AttendanceStatsViewProps {
  students: Student[];
  teams: Team[];
  attendances: AttendanceRecord[];
}

export const AttendanceStatsView: React.FC<AttendanceStatsViewProps> = ({
  students,
  teams,
  attendances,
}) => {
  const [filterTeam, setFilterTeam] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Calculate statistics per student
  const statsList = useMemo(() => {
    // Total school sessions recorded in database
    const distinctDates = Array.from(new Set(attendances.map((a) => a.date)));
    const baseTotalSessions = Math.max(distinctDates.length, 20); // At least 20 recorded days for demo or actual length

    return students.map((s) => {
      // Find actual records in attendances
      const records = attendances.filter((a) => a.studentId === s.id);
      const recordedPresent = records.filter((a) => a.status === 'present').length;
      const recordedAbsent = records.filter((a) => a.status === 'absent').length;
      const recordedExcused = records.filter((a) => a.status === 'excused').length;
      const recordedLate = records.filter((a) => a.status === 'late').length;

      // Integrate with student summary fields
      const totalExcused = Math.max(s.excusedDays, recordedExcused);
      const totalUnexcused = Math.max(s.unexcusedDays, recordedAbsent);
      const totalAbsent = totalExcused + totalUnexcused;
      const totalLate = Math.max(s.lateDays, recordedLate);

      const totalSchoolDays = baseTotalSessions;
      const presentDays = Math.max(0, totalSchoolDays - totalAbsent);
      const attendanceRate = totalSchoolDays > 0 ? Math.round((presentDays / totalSchoolDays) * 100) : 100;

      return {
        ...s,
        totalSchoolDays,
        presentDays,
        totalAbsent,
        totalExcused,
        totalUnexcused,
        totalLate,
        attendanceRate,
      };
    });
  }, [students, attendances]);

  // Overall class averages
  const classAvgRate =
    statsList.length > 0
      ? Math.round(statsList.reduce((sum, s) => sum + s.attendanceRate, 0) / statsList.length)
      : 100;

  const perfectAttendanceCount = statsList.filter((s) => s.attendanceRate === 100).length;
  const warningAttendanceCount = statsList.filter((s) => s.attendanceRate < 90).length;

  // Filtered list
  const filteredStats = statsList
    .filter((s) => {
      if (filterTeam !== 'all' && s.teamId !== filterTeam) return false;
      if (
        searchTerm &&
        !s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !s.stt.toString().includes(searchTerm)
      ) {
        return false;
      }
      return true;
    })
    .sort((a, b) => b.attendanceRate - a.attendanceRate);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-blue-600" />
            <span>Thống kê chuyên cần học sinh</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Theo dõi chi tiết số buổi có mặt, nghỉ phép, không phép và tỷ lệ chuyên cần (%)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-xs text-slate-400 font-semibold uppercase">Tỷ lệ chuyên cần cả lớp</span>
            <p className="text-2xl font-black text-blue-600">{classAvgRate}%</p>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-emerald-800 font-bold">Chuyên cần 100%</p>
            <p className="text-xl font-black text-emerald-700">{perfectAttendanceCount} học sinh</p>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 p-4 rounded-2xl flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-blue-800 font-bold">Tổng số ngày theo dõi</p>
            <p className="text-xl font-black text-blue-700">{statsList[0]?.totalSchoolDays || 20} buổi</p>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-amber-800 font-bold">Cần lưu ý (&lt; 90%)</p>
            <p className="text-xl font-black text-amber-700">{warningAttendanceCount} học sinh</p>
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

        <div className="relative">
          <Filter className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <select
            value={filterTeam}
            onChange={(e) => setFilterTeam(e.target.value)}
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
      </div>

      {/* Detailed Attendance Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredStats.map((st) => {
          const team = teams.find((t) => t.id === st.teamId);
          return (
            <div
              key={st.id}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="font-black text-slate-400 text-xs w-5">{st.stt}</span>
                    <div>
                      <h4 className="font-black text-slate-900 text-sm md:text-base">{st.fullName}</h4>
                      <span className="text-[11px] text-slate-500">{team?.name}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`text-sm font-black px-2.5 py-1 rounded-full ${
                        st.attendanceRate >= 95
                          ? 'bg-emerald-100 text-emerald-800'
                          : st.attendanceRate >= 90
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {st.attendanceRate}%
                    </span>
                    <span className="block text-[10px] text-slate-400 mt-0.5">Chuyên cần</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mb-3">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      st.attendanceRate >= 95
                        ? 'bg-emerald-500'
                        : st.attendanceRate >= 90
                        ? 'bg-blue-500'
                        : 'bg-rose-500'
                    }`}
                    style={{ width: `${st.attendanceRate}%` }}
                  />
                </div>

                {/* Stats Breakdown Pills */}
                <div className="grid grid-cols-4 gap-2 text-center text-xs pt-2 border-t border-slate-100">
                  <div className="bg-slate-50 p-2 rounded-xl">
                    <span className="text-[10px] text-slate-500 block">Có mặt</span>
                    <strong className="text-emerald-600 font-black">{st.presentDays}</strong> ngày
                  </div>
                  <div className="bg-slate-50 p-2 rounded-xl">
                    <span className="text-[10px] text-slate-500 block">Có phép</span>
                    <strong className="text-sky-600 font-black">{st.totalExcused}</strong> buổi
                  </div>
                  <div className="bg-slate-50 p-2 rounded-xl">
                    <span className="text-[10px] text-slate-500 block">K.phép</span>
                    <strong className="text-rose-600 font-black">{st.totalUnexcused}</strong> buổi
                  </div>
                  <div className="bg-slate-50 p-2 rounded-xl">
                    <span className="text-[10px] text-slate-500 block">Đi muộn</span>
                    <strong className="text-amber-600 font-black">{st.totalLate}</strong> lần
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
