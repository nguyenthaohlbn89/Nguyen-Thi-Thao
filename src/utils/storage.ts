import {
  Student,
  Team,
  CompetitionCriterion,
  CompetitionLog,
  Badge,
  BadgeAward,
  ClassActivity,
  ClassTask,
  DutyDay,
  TeacherJournalEntry,
  ParentCommunication,
  ClassSettings,
  ClassInfo,
  AttendanceRecord,
} from '../types';
import {
  initialSettings,
  initialTeams,
  initialBadges,
  initialCriteria,
  initialStudents,
  initialCompetitionLogs,
  initialActivities,
  initialTasks,
  initialDutySchedule,
  initialJournal,
  initialCommunications,
  initialAttendanceRecords,
  initialBadgeAwards,
} from '../data/initialData';

export interface AppDatabaseState {
  classInfo: ClassInfo;
  settings?: ClassSettings;
  students: Student[];
  teams: Team[];
  criteria: CompetitionCriterion[];
  competitionLogs: CompetitionLog[];
  badges: Badge[];
  badgeAwards: BadgeAward[];
  activities: ClassActivity[];
  tasks: ClassTask[];
  dutySchedule: DutyDay[];
  journal: TeacherJournalEntry[];
  communications: ParentCommunication[];
  attendances: AttendanceRecord[];
}

const STORAGE_KEY = 'GVCN_360_PRO_APP_STATE_V1';

export const defaultClassInfo: ClassInfo = {
  schoolName: 'THCS Tiền An',
  className: '6A7',
  academicYear: '2026 - 2027',
  teacherName: 'Nguyễn Văn Thuận',
  initialPoints: 30,
  maxPointsPerAction: 10,
};

export const getInitialAppState = (): AppDatabaseState => {
  return {
    classInfo: defaultClassInfo,
    settings: initialSettings,
    students: initialStudents,
    teams: initialTeams,
    criteria: initialCriteria,
    competitionLogs: initialCompetitionLogs,
    badges: initialBadges,
    badgeAwards: initialBadgeAwards,
    activities: initialActivities,
    tasks: initialTasks,
    dutySchedule: initialDutySchedule,
    journal: initialJournal,
    communications: initialCommunications,
    attendances: initialAttendanceRecords,
  };
};

export const loadAppState = (): AppDatabaseState => {
  if (typeof window === 'undefined') {
    return getInitialAppState();
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = getInitialAppState();
      saveAppState(initial);
      return initial;
    }
    const parsed = JSON.parse(raw) as Partial<AppDatabaseState> || {};
    const rawClassInfo = parsed.classInfo || ({} as Partial<ClassInfo>);
    const rawSettings = parsed.settings || ({} as Partial<ClassSettings>);

    const resolvedClassInfo: ClassInfo = {
      schoolName: rawClassInfo.schoolName || rawSettings.schoolName || defaultClassInfo.schoolName,
      className: rawClassInfo.className || rawSettings.className || defaultClassInfo.className,
      academicYear: rawClassInfo.academicYear || rawSettings.academicYear || defaultClassInfo.academicYear,
      teacherName: rawClassInfo.teacherName || rawSettings.homeroomTeacher || defaultClassInfo.teacherName,
      initialPoints: rawClassInfo.initialPoints ?? defaultClassInfo.initialPoints,
      maxPointsPerAction: rawClassInfo.maxPointsPerAction ?? defaultClassInfo.maxPointsPerAction,
    };

    const resolvedSettings: ClassSettings = {
      schoolName: resolvedClassInfo.schoolName,
      className: resolvedClassInfo.className,
      academicYear: resolvedClassInfo.academicYear,
      homeroomTeacher: resolvedClassInfo.teacherName,
      teacherName: resolvedClassInfo.teacherName,
      teamCount: rawSettings.teamCount ?? 4,
      soundEnabled: rawSettings.soundEnabled ?? true,
      repeatWheel: rawSettings.repeatWheel ?? false,
      initialPoints: resolvedClassInfo.initialPoints,
      maxPointsPerAction: resolvedClassInfo.maxPointsPerAction,
    };

    return {
      classInfo: resolvedClassInfo,
      settings: resolvedSettings,
      students: parsed.students || initialStudents,
      teams: parsed.teams || initialTeams,
      criteria: parsed.criteria || initialCriteria,
      competitionLogs: parsed.competitionLogs || initialCompetitionLogs,
      badges: parsed.badges || initialBadges,
      badgeAwards: parsed.badgeAwards || initialBadgeAwards,
      activities: parsed.activities || initialActivities,
      tasks: parsed.tasks || initialTasks,
      dutySchedule: parsed.dutySchedule || initialDutySchedule,
      journal: parsed.journal || initialJournal,
      communications: parsed.communications || initialCommunications,
      attendances: parsed.attendances || initialAttendanceRecords,
    };
  } catch (e) {
    console.error('Error loading app state from localStorage:', e);
    return getInitialAppState();
  }
};

export const saveAppState = (state: AppDatabaseState): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch (e) {
    console.error('Error saving app state to localStorage:', e);
    return false;
  }
};

export const clearAndResetDemoData = (): AppDatabaseState => {
  const fresh = getInitialAppState();
  saveAppState(fresh);
  return fresh;
};

export const resetAppState = clearAndResetDemoData;

export const exportBackupJSON = (state: AppDatabaseState) => {
  const jsonStr = JSON.stringify(state, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const clsName = state.classInfo?.className || state.settings?.className || '6A7';
  a.download = `SaoLuu_GVCN360_${clsName}_${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const importBackupJSON = (jsonString: string): boolean => {
  try {
    const data = JSON.parse(jsonString);
    if (data && Array.isArray(data.students) && Array.isArray(data.teams)) {
      saveAppState(data);
      return true;
    }
    return false;
  } catch {
    return false;
  }
};
