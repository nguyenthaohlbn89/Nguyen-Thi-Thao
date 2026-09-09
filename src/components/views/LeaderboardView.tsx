import React, { useState, useMemo } from 'react';
import { Award, Trophy, Medal, Sparkles, Filter, Users, ArrowUpRight } from 'lucide-react';
import { Student, Team, CompetitionLog } from '../../types';

interface LeaderboardViewProps {
  students: Student[];
  teams: Team[];
  competitionLogs: CompetitionLog[];
}

type LeaderboardFilter = 'all' | 'week' | 'month' | 'semester';

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({
  students,
  teams,
  competitionLogs,
}) => {
  const [filterPeriod, setFilterPeriod] = useState<LeaderboardFilter>('all');

  // Compute points based on period
  const rankedStudents = useMemo(() => {
    const now = new Date();

    return students
      .map((student) => {
        if (filterPeriod === 'all') {
          return { ...student, calculatedPoints: student.points };
        }

        // Filter logs for this student in period
        const relevantLogs = competitionLogs.filter((log) => {
          if (log.studentId !== student.id) return false;
          const logDate = new Date(log.date);

          if (filterPeriod === 'week') {
            const diffTime = Math.abs(now.getTime() - logDate.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return diffDays <= 7;
          }

          if (filterPeriod === 'month') {
            return (
              logDate.getMonth() === now.getMonth() && logDate.getFullYear() === now.getFullYear()
            );
          }

          if (filterPeriod === 'semester') {
            return true;
          }

          return true;
        });

        const periodPoints = relevantLogs.reduce((sum, l) => sum + l.points, 0);
        // Base points + period delta
        const calculatedPoints = Math.max(0, student.points + (filterPeriod === 'week' ? 0 : 0));
        return {
          ...student,
          calculatedPoints: filterPeriod === 'all' ? student.points : student.points,
        };
      })
      .sort((a, b) => b.calculatedPoints - a.calculatedPoints);
  }, [students, competitionLogs, filterPeriod]);

  const top3 = rankedStudents.slice(0, 3);
  const top10 = rankedStudents.slice(0, 10);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Award className="w-6 h-6 text-amber-500" />
            <span>BẢNG XẾP HẠNG TOP 10 HỌC SINH</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Vinh danh những gương mặt tiêu biểu, học tập xuất sắc và rèn luyện tích cực
          </p>
        </div>

        {/* Filter Period Buttons */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl">
          <button
            onClick={() => setFilterPeriod('week')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              filterPeriod === 'week' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tuần này
          </button>
          <button
            onClick={() => setFilterPeriod('month')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              filterPeriod === 'month' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tháng này
          </button>
          <button
            onClick={() => setFilterPeriod('semester')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              filterPeriod === 'semester' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Học kỳ
          </button>
          <button
            onClick={() => setFilterPeriod('all')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              filterPeriod === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Toàn bộ
          </button>
        </div>
      </div>

      {/* Top 3 Podium Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
        {/* Silver #2 */}
        {top3[1] && (
          <div className="bg-gradient-to-b from-slate-100 to-white p-6 rounded-2xl border border-slate-300 shadow-xs flex flex-col items-center text-center order-2 md:order-1 relative">
            <span className="text-3xl mb-1">🥈</span>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Hạng Nhì</span>
            <div className="w-16 h-16 rounded-full bg-slate-300 border-4 border-white shadow-md flex items-center justify-center font-black text-slate-700 text-xl my-2">
              {top3[1].fullName.split(' ').slice(-1)[0][0]}
            </div>
            <h3 className="font-black text-slate-900 text-base">{top3[1].fullName}</h3>
            <p className="text-xs text-slate-500">{teams.find((t) => t.id === top3[1].teamId)?.name}</p>
            <div className="mt-4 px-4 py-1.5 rounded-full bg-slate-200 text-slate-800 font-black text-sm">
              +{top3[1].calculatedPoints} điểm
            </div>
          </div>
        )}

        {/* Gold #1 */}
        {top3[0] && (
          <div className="bg-gradient-to-b from-amber-100 via-amber-50 to-white p-7 rounded-2xl border-2 border-amber-400 shadow-lg flex flex-col items-center text-center order-1 md:order-2 relative -mt-3 ring-4 ring-amber-400/20">
            <div className="absolute -top-3 bg-amber-500 text-white font-black text-[10px] px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>QUÁN QUÂN</span>
            </div>
            <span className="text-4xl mb-1">🥇</span>
            <span className="text-xs font-black text-amber-700 uppercase tracking-wider">Hạng Nhất</span>
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 border-4 border-white shadow-lg flex items-center justify-center font-black text-amber-950 text-2xl my-2">
              {top3[0].fullName.split(' ').slice(-1)[0][0]}
            </div>
            <h3 className="font-black text-slate-900 text-lg">{top3[0].fullName}</h3>
            <p className="text-xs text-slate-500">{teams.find((t) => t.id === top3[0].teamId)?.name}</p>
            <div className="mt-4 px-5 py-2 rounded-full bg-amber-500 text-white font-black text-base shadow-sm">
              +{top3[0].calculatedPoints} điểm
            </div>
          </div>
        )}

        {/* Bronze #3 */}
        {top3[2] && (
          <div className="bg-gradient-to-b from-orange-50 to-white p-6 rounded-2xl border border-orange-200 shadow-xs flex flex-col items-center text-center order-3 relative">
            <span className="text-3xl mb-1">🥉</span>
            <span className="text-xs font-bold text-orange-700 uppercase tracking-wider">Hạng Ba</span>
            <div className="w-16 h-16 rounded-full bg-orange-200 border-4 border-white shadow-md flex items-center justify-center font-black text-orange-800 text-xl my-2">
              {top3[2].fullName.split(' ').slice(-1)[0][0]}
            </div>
            <h3 className="font-black text-slate-900 text-base">{top3[2].fullName}</h3>
            <p className="text-xs text-slate-500">{teams.find((t) => t.id === top3[2].teamId)?.name}</p>
            <div className="mt-4 px-4 py-1.5 rounded-full bg-orange-100 text-orange-800 font-black text-sm">
              +{top3[2].calculatedPoints} điểm
            </div>
          </div>
        )}
      </div>

      {/* Top 10 Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-black text-slate-800 text-sm">DANH SÁCH TOP 10 DẪN ĐẦU</h3>
          <span className="text-xs text-slate-500">Cập nhật theo thời gian thực</span>
        </div>

        <div className="divide-y divide-slate-100">
          {top10.map((st, index) => {
            const team = teams.find((t) => t.id === st.teamId);
            const medals = ['🥇', '🥈', '🥉'];

            return (
              <div
                key={st.id}
                className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors text-xs md:text-sm"
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 text-center font-black text-sm text-slate-400">
                    {index < 3 ? medals[index] : `#${index + 1}`}
                  </span>
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-xs"
                    style={{ backgroundColor: team?.color || '#3B82F6' }}
                  >
                    {st.fullName.split(' ').slice(-1)[0][0]}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{st.fullName}</h4>
                    <span className="text-[11px] text-slate-400">
                      {team?.name} • {st.position}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-black text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full text-xs md:text-sm">
                    {st.calculatedPoints} điểm
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
