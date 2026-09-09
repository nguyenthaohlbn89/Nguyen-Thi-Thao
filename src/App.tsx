import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { ToastContainer, ToastItem } from './components/Toast';
import { DashboardView } from './components/views/DashboardView';
import { StudentsView } from './components/views/StudentsView';
import { TeamsView } from './components/views/TeamsView';
import { DailyAttendanceView } from './components/views/DailyAttendanceView';
import { AttendanceStatsView } from './components/views/AttendanceStatsView';
import { CompetitionView } from './components/views/CompetitionView';
import { LeaderboardView } from './components/views/LeaderboardView';
import { BadgesView } from './components/views/BadgesView';
import { LuckyWheelView } from './components/views/LuckyWheelView';
import { GroupingView } from './components/views/GroupingView';
import { ActivitiesView } from './components/views/ActivitiesView';
import { ReportsView } from './components/views/ReportsView';
import { SettingsView } from './components/views/SettingsView';
import { AIAssistantView } from './components/views/AIAssistantView';

import {
  Student,
  Team,
  AttendanceRecord,
  AttendanceStatus,
  CompetitionCriterion,
  CompetitionLog,
  ClassActivity,
  Badge,
  BadgeAward,
  ClassInfo,
} from './types';
import {
  loadAppState,
  saveAppState,
  resetAppState,
  exportBackupJSON,
  importBackupJSON,
  defaultClassInfo,
} from './utils/storage';
import { soundManager } from './utils/sound';

export default function App() {
  // App single source of truth database state
  const [appState, setAppState] = useState(() => loadAppState());
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  // Automatically persist to localStorage whenever appState changes
  useEffect(() => {
    saveAppState(appState);
  }, [appState]);

  // Toast Helper
  const showToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    const id = Date.now().toString() + Math.random().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // --- Student Handlers ---
  const handleAddStudent = (studentData: Omit<Student, 'id' | 'stt'>) => {
    const newStt = appState.students.length > 0 ? Math.max(...appState.students.map((s) => s.stt)) + 1 : 1;
    const newStudent: Student = {
      ...studentData,
      id: `student-${Date.now()}`,
      stt: newStt,
      points: studentData.points ?? appState.classInfo.initialPoints,
      absentDays: studentData.absentDays ?? 0,
      excusedDays: studentData.excusedDays ?? 0,
      unexcusedDays: studentData.unexcusedDays ?? 0,
      lateDays: studentData.lateDays ?? 0,
      badges: studentData.badges ?? [],
    };

    setAppState((prev) => ({
      ...prev,
      students: [...prev.students, newStudent],
    }));

    soundManager.playSuccess();
    showToast(`Đã thêm học sinh ${newStudent.fullName} thành công!`, 'success');
  };

  const handleUpdateStudent = (updatedStudent: Student) => {
    setAppState((prev) => ({
      ...prev,
      students: prev.students.map((s) => (s.id === updatedStudent.id ? updatedStudent : s)),
    }));
    soundManager.playSuccess();
    showToast(`Đã cập nhật thông tin em ${updatedStudent.fullName}!`, 'success');
  };

  const handleDeleteStudent = (studentId: string) => {
    const st = appState.students.find((s) => s.id === studentId);
    setAppState((prev) => ({
      ...prev,
      students: prev.students.filter((s) => s.id !== studentId),
    }));
    soundManager.playClick();
    showToast(`Đã xóa học sinh ${st?.fullName || ''} khỏi danh sách.`, 'info');
  };

  // --- Team Handlers ---
  const handleAddTeam = (teamData: Omit<Team, 'id'>) => {
    const newTeam: Team = {
      ...teamData,
      id: `team-${Date.now()}`,
    };
    setAppState((prev) => ({
      ...prev,
      teams: [...prev.teams, newTeam],
    }));
    soundManager.playSuccess();
    showToast(`Đã tạo ${newTeam.name} thành công!`, 'success');
  };

  const handleUpdateTeam = (updatedTeam: Team) => {
    setAppState((prev) => ({
      ...prev,
      teams: prev.teams.map((t) => (t.id === updatedTeam.id ? updatedTeam : t)),
    }));
    soundManager.playSuccess();
    showToast(`Đã cập nhật ${updatedTeam.name}!`, 'success');
  };

  const handleDeleteTeam = (teamId: string) => {
    setAppState((prev) => ({
      ...prev,
      teams: prev.teams.filter((t) => t.id !== teamId),
    }));
    soundManager.playClick();
    showToast('Đã xóa tổ.', 'info');
  };

  const handleMoveStudentTeam = (studentId: string, newTeamId: string) => {
    const student = appState.students.find((s) => s.id === studentId);
    const team = appState.teams.find((t) => t.id === newTeamId);
    if (!student || !team) return;

    setAppState((prev) => ({
      ...prev,
      students: prev.students.map((s) => (s.id === studentId ? { ...s, teamId: newTeamId } : s)),
    }));
    soundManager.playSuccess();
    showToast(`Đã chuyển em ${student.fullName} sang ${team.name}!`, 'success');
  };

  const handleAdjustTeamPoints = (teamId: string, points: number, reason: string) => {
    const team = appState.teams.find((t) => t.id === teamId);
    if (!team) return;

    const newLog: CompetitionLog = {
      id: `log-${Date.now()}`,
      teamId,
      points,
      criterionName: reason,
      date: new Date().toISOString().split('T')[0],
      notes: `Điểm trực tiếp cho ${team.name}`,
    };

    setAppState((prev) => ({
      ...prev,
      teams: prev.teams.map((t) =>
        t.id === teamId ? { ...t, directPoints: t.directPoints + points } : t
      ),
      competitionLogs: [newLog, ...prev.competitionLogs],
    }));

    if (points > 0) {
      soundManager.playAward();
      showToast(`Đã cộng ${points} điểm cho ${team.name}!`, 'success');
    } else {
      soundManager.playDeduct();
      showToast(`Đã trừ ${Math.abs(points)} điểm của ${team.name}!`, 'warning');
    }
  };

  // --- Attendance Handlers ---
  const handleSaveAttendance = (
    date: string,
    records: { studentId: string; status: AttendanceStatus; note?: string }[]
  ) => {
    // Remove existing records for this date
    const filteredOld = appState.attendances.filter((a) => a.date !== date);
    const newRecords: AttendanceRecord[] = records.map((r, idx) => ({
      id: `att-${Date.now()}-${idx}`,
      date,
      studentId: r.studentId,
      status: r.status,
      note: r.note,
    }));

    // Recalculate student absent/late counters
    const updatedAttendances = [...filteredOld, ...newRecords];
    const updatedStudents = appState.students.map((st) => {
      const stRecords = updatedAttendances.filter((a) => a.studentId === st.id);
      const absentCount = stRecords.filter((a) => a.status === 'absent' || a.status === 'excused').length;
      const excusedCount = stRecords.filter((a) => a.status === 'excused').length;
      const unexcusedCount = stRecords.filter((a) => a.status === 'absent').length;
      const lateCount = stRecords.filter((a) => a.status === 'late').length;

      return {
        ...st,
        absentDays: absentCount,
        excusedDays: excusedCount,
        unexcusedDays: unexcusedCount,
        lateDays: lateCount,
      };
    });

    setAppState((prev) => ({
      ...prev,
      attendances: updatedAttendances,
      students: updatedStudents,
    }));

    soundManager.playSuccess();
    showToast('Đã lưu điểm danh thành công.', 'success');
  };

  // --- Competition / Award Handlers ---
  const handleAwardPoints = (
    studentId: string,
    points: number,
    criterionName: string,
    notes?: string,
    date?: string
  ) => {
    const student = appState.students.find((s) => s.id === studentId);
    if (!student) return;

    const logDate = date || new Date().toISOString().split('T')[0];
    const newLog: CompetitionLog = {
      id: `log-${Date.now()}`,
      studentId,
      points,
      criterionName,
      date: logDate,
      notes,
    };

    setAppState((prev) => ({
      ...prev,
      students: prev.students.map((s) =>
        s.id === studentId ? { ...s, points: Math.max(0, s.points + points) } : s
      ),
      competitionLogs: [newLog, ...prev.competitionLogs],
    }));

    if (points >= 0) {
      soundManager.playAward();
      showToast(`Đã cộng +${points} điểm cho ${student.fullName}!`, 'success');
    } else {
      soundManager.playDeduct();
      showToast(`Đã trừ ${points} điểm của ${student.fullName}!`, 'warning');
    }
  };

  const handleAddCriterion = (critData: Omit<CompetitionCriterion, 'id'>) => {
    const newCrit: CompetitionCriterion = {
      ...critData,
      id: `crit-${Date.now()}`,
    };
    setAppState((prev) => ({
      ...prev,
      criteria: [...prev.criteria, newCrit],
    }));
    soundManager.playSuccess();
    showToast(`Đã thêm tiêu chí: "${newCrit.name}"`, 'success');
  };

  const handleUpdateCriterion = (updatedCrit: CompetitionCriterion) => {
    setAppState((prev) => ({
      ...prev,
      criteria: prev.criteria.map((c) => (c.id === updatedCrit.id ? updatedCrit : c)),
    }));
    soundManager.playSuccess();
    showToast(`Đã cập nhật tiêu chí!`, 'success');
  };

  const handleDeleteCriterion = (critId: string) => {
    setAppState((prev) => ({
      ...prev,
      criteria: prev.criteria.filter((c) => c.id !== critId),
    }));
    soundManager.playClick();
    showToast(`Đã xóa tiêu chí.`, 'info');
  };

  // --- Badges Handlers ---
  const handleAwardBadge = (studentId: string, badgeId: string, reason: string) => {
    const student = appState.students.find((s) => s.id === studentId);
    const badge = appState.badges.find((b) => b.id === badgeId);
    if (!student || !badge) return;

    const newAward: BadgeAward = {
      id: `award-${Date.now()}`,
      studentId,
      badgeId,
      date: new Date().toISOString().split('T')[0],
      reason,
    };

    const currentBadges = student.badges || [];
    const updatedBadges = currentBadges.includes(badgeId)
      ? currentBadges
      : [...currentBadges, badgeId];

    setAppState((prev) => ({
      ...prev,
      students: prev.students.map((s) =>
        s.id === studentId ? { ...s, badges: updatedBadges } : s
      ),
      badgeAwards: [newAward, ...prev.badgeAwards],
    }));

    soundManager.playAward();
    showToast(`Đã trao huy hiệu "${badge.name}" cho em ${student.fullName}!`, 'success');
  };

  // --- Activities Handlers ---
  const handleAddActivity = (actData: Omit<ClassActivity, 'id'>) => {
    const newAct: ClassActivity = {
      ...actData,
      id: `act-${Date.now()}`,
    };
    setAppState((prev) => ({
      ...prev,
      activities: [...prev.activities, newAct],
    }));
    soundManager.playSuccess();
    showToast(`Đã tạo hoạt động: ${newAct.title}!`, 'success');
  };

  const handleUpdateActivity = (updatedAct: ClassActivity) => {
    setAppState((prev) => ({
      ...prev,
      activities: prev.activities.map((a) => (a.id === updatedAct.id ? updatedAct : a)),
    }));
    soundManager.playSuccess();
    showToast(`Đã cập nhật hoạt động!`, 'success');
  };

  const handleDeleteActivity = (actId: string) => {
    setAppState((prev) => ({
      ...prev,
      activities: prev.activities.filter((a) => a.id !== actId),
    }));
    soundManager.playClick();
    showToast(`Đã xóa hoạt động.`, 'info');
  };

  // --- Settings & Backup Handlers ---
  const handleUpdateClassInfo = (info: ClassInfo) => {
    setAppState((prev) => ({
      ...prev,
      classInfo: info,
    }));
    soundManager.playSuccess();
    showToast('Đã lưu thông tin cài đặt lớp học.', 'success');
  };

  const handleResetToDefault = () => {
    const defaultData = resetAppState();
    setAppState(defaultData);
    soundManager.playSuccess();
    showToast('Đã khôi phục dữ liệu mẫu ban đầu của lớp 6A7.', 'info');
  };

  const handleExportBackup = () => {
    exportBackupJSON(appState);
    soundManager.playSuccess();
    showToast('Đã tải file sao lưu JSON về máy.', 'success');
  };

  const handleImportBackup = (jsonString: string) => {
    const success = importBackupJSON(jsonString);
    if (success) {
      setAppState(loadAppState());
      soundManager.playSuccess();
      showToast('Đã phục hồi dữ liệu từ file sao lưu thành công!', 'success');
    } else {
      soundManager.playDeduct();
      showToast('File sao lưu không hợp lệ. Vui lòng kiểm tra lại!', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col antialiased text-slate-800 font-sans">
      {/* Toast Notification Stack */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {/* Main App Layout */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Left Navigation Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          classInfo={appState.classInfo || defaultClassInfo}
          settings={appState.settings}
        />

        {/* Right Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Contextual Header */}
          <Header
            currentTab={currentTab}
            classInfo={appState.classInfo || defaultClassInfo}
            settings={appState.settings}
            onSelectTab={setCurrentTab}
          />

          {/* View Body */}
          <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            {currentTab === 'dashboard' && (
              <DashboardView
                classInfo={appState.classInfo || defaultClassInfo}
                settings={appState.settings}
                students={appState.students || []}
                teams={appState.teams || []}
                attendances={appState.attendances || []}
                activities={appState.activities || []}
                onSelectTab={setCurrentTab}
                onUpdateClassInfo={handleUpdateClassInfo}
              />
            )}

            {currentTab === 'students' && (
              <StudentsView
                students={appState.students}
                teams={appState.teams}
                badges={appState.badges}
                onAddStudent={handleAddStudent}
                onUpdateStudent={handleUpdateStudent}
                onDeleteStudent={handleDeleteStudent}
              />
            )}

            {currentTab === 'teams' && (
              <TeamsView
                teams={appState.teams}
                students={appState.students}
                onAddTeam={handleAddTeam}
                onUpdateTeam={handleUpdateTeam}
                onDeleteTeam={handleDeleteTeam}
                onMoveStudentTeam={handleMoveStudentTeam}
                onAdjustTeamPoints={handleAdjustTeamPoints}
              />
            )}

            {currentTab === 'attendance' && (
              <DailyAttendanceView
                students={appState.students}
                teams={appState.teams}
                attendances={appState.attendances}
                onSaveAttendance={handleSaveAttendance}
              />
            )}

            {currentTab === 'attendance-stats' && (
              <AttendanceStatsView
                students={appState.students}
                teams={appState.teams}
                attendances={appState.attendances}
              />
            )}

            {currentTab === 'competition' && (
              <CompetitionView
                students={appState.students}
                teams={appState.teams}
                criteria={appState.criteria}
                competitionLogs={appState.competitionLogs}
                onAwardPoints={handleAwardPoints}
                onAddCriterion={handleAddCriterion}
                onUpdateCriterion={handleUpdateCriterion}
                onDeleteCriterion={handleDeleteCriterion}
              />
            )}

            {currentTab === 'leaderboard' && (
              <LeaderboardView
                students={appState.students}
                teams={appState.teams}
                competitionLogs={appState.competitionLogs}
              />
            )}

            {currentTab === 'badges' && (
              <BadgesView
                badges={appState.badges}
                students={appState.students}
                badgeAwards={appState.badgeAwards}
                onAwardBadge={handleAwardBadge}
              />
            )}

            {currentTab === 'lucky-wheel' && (
              <LuckyWheelView students={appState.students} />
            )}

            {currentTab === 'grouping' && (
              <GroupingView students={appState.students} />
            )}

            {currentTab === 'activities' && (
              <ActivitiesView
                activities={appState.activities}
                onAddActivity={handleAddActivity}
                onUpdateActivity={handleUpdateActivity}
                onDeleteActivity={handleDeleteActivity}
              />
            )}

            {currentTab === 'reports' && (
              <ReportsView
                students={appState.students}
                teams={appState.teams}
                attendances={appState.attendances}
                competitionLogs={appState.competitionLogs}
              />
            )}

            {currentTab === 'settings' && (
              <SettingsView
                classInfo={appState.classInfo || defaultClassInfo}
                onUpdateClassInfo={handleUpdateClassInfo}
                onResetToDefault={handleResetToDefault}
                onExportBackup={handleExportBackup}
                onImportBackup={handleImportBackup}
              />
            )}

            {currentTab === 'ai-assistant' && (
              <AIAssistantView
                students={appState.students || []}
                teacherName={appState.classInfo?.teacherName || 'Nguyễn Văn Thuận'}
                className={appState.classInfo?.className || '6A7'}
              />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
