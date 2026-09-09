import React, { useState, useEffect } from 'react';
import {
  CheckSquare,
  Save,
  CheckCircle2,
  XCircle,
  Clock,
  HelpCircle,
  Calendar,
  History,
  Users,
  Search,
  Check,
} from 'lucide-react';
import { Student, AttendanceRecord, AttendanceStatus, Team } from '../../types';

interface DailyAttendanceViewProps {
  students: Student[];
  teams: Team[];
  attendances: AttendanceRecord[];
  onSaveAttendance: (date: string, records: { studentId: string; status: AttendanceStatus; note?: string }[]) => void;
}

export const DailyAttendanceView: React.FC<DailyAttendanceViewProps> = ({
  students,
  teams,
  attendances,
  onSaveAttendance,
}) => {
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [currentRecords, setCurrentRecords] = useState<Record<string, { status: AttendanceStatus; note: string }>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [historyViewMode, setHistoryViewMode] = useState<'daily' | 'history'>('daily');

  // Populate records when selectedDate changes or when initial data is loaded
  useEffect(() => {
    const existingForDate = attendances.filter((a) => a.date === selectedDate);
    const map: Record<string, { status: AttendanceStatus; note: string }> = {};

    students.forEach((s) => {
      const match = existingForDate.find((a) => a.studentId === s.id);
      if (match) {
        map[s.id] = { status: match.status, note: match.note || '' };
      } else {
        // Default to present as per requirements
        map[s.id] = { status: 'present', note: '' };
      }
    });

    setCurrentRecords(map);
  }, [selectedDate, attendances, students]);

  // Handle status toggle for a student
  const handleSetStatus = (studentId: string, status: AttendanceStatus) => {
    setCurrentRecords((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status,
      },
    }));
  };

  const handleSetNote = (studentId: string, note: string) => {
    setCurrentRecords((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        note,
      },
    }));
  };

  // Set all present button
  const handleSetAllPresent = () => {
    const updated: Record<string, { status: AttendanceStatus; note: string }> = {};
    students.forEach((s) => {
      updated[s.id] = { status: 'present', note: '' };
    });
    setCurrentRecords(updated);
  };

  // Save attendance
  const handleSave = () => {
    const recordsList: { studentId: string; status: AttendanceStatus; note?: string }[] = (
      Object.entries(currentRecords) as [string, { status: AttendanceStatus; note: string }][]
    ).map(([studentId, data]) => ({
      studentId,
      status: data.status,
      note: data.note,
    }));
    onSaveAttendance(selectedDate, recordsList);
  };

  // Summary counts for current day
  const statuses: { status: AttendanceStatus; note: string }[] = Object.values(currentRecords);
  const countPresent = statuses.filter((s) => s.status === 'present').length;
  const countAbsent = statuses.filter((s) => s.status === 'absent').length;
  const countLate = statuses.filter((s) => s.status === 'late').length;
  const countExcused = statuses.filter((s) => s.status === 'excused').length;

  // Filter students for display
  const filteredStudents = students.filter(
    (s) =>
      s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.stt.toString().includes(searchTerm)
  );

  // History dates unique
  const historyDates = Array.from(new Set(attendances.map((a) => a.date)))
    .map((d) => String(d))
    .sort((a, b) => b.localeCompare(a));

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <CheckSquare className="w-6 h-6 text-emerald-600" />
            <span>Điểm danh học sinh hằng ngày</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Điểm danh trực quan, 1 chạm nhanh chóng • Mặc định tất cả học sinh có mặt
          </p>
        </div>

        {/* Date Selector & Mode Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setHistoryViewMode('daily')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                historyViewMode === 'daily'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Điểm danh hôm nay
            </button>
            <button
              onClick={() => setHistoryViewMode('history')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                historyViewMode === 'history'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Lịch sử điểm danh
            </button>
          </div>

          <div className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-xs">
            <Calendar className="w-4 h-4 text-slate-500" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="text-xs font-bold text-slate-800 bg-transparent focus:outline-none cursor-pointer"
            />
          </div>
        </div>
      </div>

      {historyViewMode === 'daily' ? (
        <>
          {/* Quick Counter Summary & Action bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-emerald-800">✅ Có mặt</span>
                <p className="text-2xl font-black text-emerald-700 mt-0.5">{countPresent}</p>
              </div>
              <CheckCircle2 className="w-6 h-6 text-emerald-500" />
            </div>

            <div className="bg-rose-50 border border-rose-200 p-3.5 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-rose-800">❌ Vắng</span>
                <p className="text-2xl font-black text-rose-700 mt-0.5">{countAbsent}</p>
              </div>
              <XCircle className="w-6 h-6 text-rose-500" />
            </div>

            <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-amber-800">⏰ Đi muộn</span>
                <p className="text-2xl font-black text-amber-700 mt-0.5">{countLate}</p>
              </div>
              <Clock className="w-6 h-6 text-amber-500" />
            </div>

            <div className="bg-sky-50 border border-sky-200 p-3.5 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-sky-800">🔵 Có phép</span>
                <p className="text-2xl font-black text-sky-700 mt-0.5">{countExcused}</p>
              </div>
              <HelpCircle className="w-6 h-6 text-sky-500" />
            </div>
          </div>

          {/* Sticky action bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Tìm tên học sinh cần điểm danh..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs md:text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSetAllPresent}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-xs md:text-sm font-bold rounded-xl transition-colors active:scale-95"
              >
                <Check className="w-4 h-4" />
                <span>✅ TẤT CẢ CÓ MẶT</span>
              </button>

              <button
                type="button"
                onClick={handleSave}
                className="flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs md:text-sm font-bold rounded-xl shadow-md shadow-blue-500/20 transition-all active:scale-95"
              >
                <Save className="w-4 h-4" />
                <span>💾 LƯU ĐIỂM DANH</span>
              </button>
            </div>
          </div>

          {/* Students Attendance List */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs md:text-sm">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold text-[11px] tracking-wider">
                  <tr>
                    <th className="p-3.5 text-center w-12">STT</th>
                    <th className="p-3.5">Học sinh</th>
                    <th className="p-3.5">Tổ</th>
                    <th className="p-3.5 text-center">Trạng thái điểm danh</th>
                    <th className="p-3.5">Ghi chú lý do (nếu có)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStudents.map((st) => {
                    const rec = currentRecords[st.id] || { status: 'present', note: '' };
                    const team = teams.find((t) => t.id === st.teamId);

                    return (
                      <tr
                        key={st.id}
                        className={`hover:bg-slate-50/80 transition-colors ${
                          rec.status === 'absent'
                            ? 'bg-rose-50/40'
                            : rec.status === 'late'
                            ? 'bg-amber-50/40'
                            : rec.status === 'excused'
                            ? 'bg-sky-50/40'
                            : ''
                        }`}
                      >
                        <td className="p-3.5 text-center font-bold text-slate-400">{st.stt}</td>
                        <td className="p-3.5 font-bold text-slate-900">
                          <span>{st.fullName}</span>
                          <span className="text-[11px] text-slate-400 font-normal block">
                            {st.position}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <span
                            className="inline-block text-[11px] font-semibold text-white px-2 py-0.5 rounded-md"
                            style={{ backgroundColor: team?.color || '#64748B' }}
                          >
                            {team?.name || 'Tổ'}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <div className="flex items-center justify-center gap-1 sm:gap-2">
                            {/* Có mặt */}
                            <button
                              type="button"
                              onClick={() => handleSetStatus(st.id, 'present')}
                              className={`px-2.5 sm:px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
                                rec.status === 'present'
                                  ? 'bg-emerald-600 text-white shadow-xs scale-102'
                                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                              }`}
                            >
                              ✅ Có mặt
                            </button>

                            {/* Vắng */}
                            <button
                              type="button"
                              onClick={() => handleSetStatus(st.id, 'absent')}
                              className={`px-2.5 sm:px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
                                rec.status === 'absent'
                                  ? 'bg-rose-600 text-white shadow-xs scale-102'
                                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                              }`}
                            >
                              ❌ Vắng
                            </button>

                            {/* Đi muộn */}
                            <button
                              type="button"
                              onClick={() => handleSetStatus(st.id, 'late')}
                              className={`px-2.5 sm:px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
                                rec.status === 'late'
                                  ? 'bg-amber-600 text-white shadow-xs scale-102'
                                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                              }`}
                            >
                              ⏰ Đi muộn
                            </button>

                            {/* Có phép */}
                            <button
                              type="button"
                              onClick={() => handleSetStatus(st.id, 'excused')}
                              className={`px-2.5 sm:px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
                                rec.status === 'excused'
                                  ? 'bg-sky-600 text-white shadow-xs scale-102'
                                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                              }`}
                            >
                              🔵 Có phép
                            </button>
                          </div>
                        </td>
                        <td className="p-3.5">
                          <input
                            type="text"
                            placeholder="Lý do (khám bệnh, hỏng xe...)"
                            value={rec.note}
                            onChange={(e) => handleSetNote(st.id, e.target.value)}
                            className="w-full px-2.5 py-1 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-none"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        /* History View Tab */
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-slate-800 font-black text-base mb-2">
            <History className="w-5 h-5 text-blue-600" />
            <span>Lịch sử các ngày đã điểm danh</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {historyDates.length > 0 ? (
              historyDates.map((dateStr: string) => {
                const dayRecords = attendances.filter((a) => a.date === dateStr);
                const pCount = dayRecords.filter((a) => a.status === 'present').length;
                const aCount = dayRecords.filter((a) => a.status === 'absent').length;
                const lCount = dayRecords.filter((a) => a.status === 'late').length;
                const eCount = dayRecords.filter((a) => a.status === 'excused').length;

                return (
                  <div
                    key={dateStr}
                    onClick={() => {
                      setSelectedDate(dateStr);
                      setHistoryViewMode('daily');
                    }}
                    className="p-4 rounded-xl border border-slate-200 hover:border-blue-500 hover:shadow-md cursor-pointer transition-all bg-slate-50/50"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-slate-900 text-sm">
                        {dateStr.split('-').reverse().join('/')}
                      </span>
                      <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                        Xem lại
                      </span>
                    </div>

                    <div className="grid grid-cols-4 gap-1 text-[11px] text-center mt-2">
                      <span className="bg-emerald-100 text-emerald-800 p-1 rounded font-bold">
                        {pCount} có mặt
                      </span>
                      <span className="bg-rose-100 text-rose-800 p-1 rounded font-bold">
                        {aCount} vắng
                      </span>
                      <span className="bg-amber-100 text-amber-800 p-1 rounded font-bold">
                        {lCount} muộn
                      </span>
                      <span className="bg-sky-100 text-sky-800 p-1 rounded font-bold">
                        {eCount} phép
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-slate-400 py-6">Chưa có lịch sử điểm danh nào.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
