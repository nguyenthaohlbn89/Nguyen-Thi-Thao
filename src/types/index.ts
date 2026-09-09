export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export interface Student {
  id: string;
  stt: number;
  fullName: string;
  birthDate: string; // YYYY-MM-DD
  gender: 'Nam' | 'Nữ';
  teamId: string; // 'team-1', 'team-2', etc.
  position: string; // Lớp trưởng, Lớp phó, Tổ trưởng, Thành viên, etc.
  parentName: string;
  parentRelationship: string; // Bố, Mẹ, Người giám hộ
  parentPhone: string;
  parentEmail?: string;
  address?: string;
  notes?: string;
  points: number; // Điểm thi đua
  absentDays: number;
  excusedDays: number;
  unexcusedDays: number;
  lateDays: number;
  badges: string[]; // Badge IDs
  avatarUrl?: string;
}

export interface Team {
  id: string;
  name: string;
  color: string; // hex or tailwind class
  directPoints: number; // Điểm cộng/trừ riêng cho tổ
  description?: string;
}

export interface AttendanceRecord {
  id: string;
  date: string; // YYYY-MM-DD
  studentId: string;
  status: AttendanceStatus;
  note?: string;
}

export interface CompetitionCriterion {
  id: string;
  name: string;
  points: number; // positive or negative
  type: 'positive' | 'negative';
  icon?: string;
}

export interface CompetitionLog {
  id: string;
  date: string; // YYYY-MM-DD
  studentId?: string;
  teamId?: string;
  criterionName: string;
  points: number;
  notes?: string;
  createdAt?: string;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
}

export interface BadgeAward {
  id: string;
  studentId: string;
  badgeId: string;
  date: string;
  reason: string;
}

export interface ClassActivity {
  id: string;
  title: string;
  category: 'Sinh hoạt lớp' | 'Hoạt động trải nghiệm' | 'Văn nghệ' | 'Thể thao' | 'Lao động' | 'Đoàn/Đội' | 'Thiện nguyện' | 'Tham quan' | 'Sự kiện trường' | 'Hoạt động khác';
  type?: string;
  date: string; // YYYY-MM-DD
  time?: string;
  location?: string;
  content?: string;
  leadPerson?: string; // Người phụ trách
  participants?: string; // Học sinh tham gia hoặc "Toàn lớp"
  status: 'upcoming' | 'ongoing' | 'completed';
  result?: string;
  notes?: string;
}

export interface ClassTask {
  id: string;
  title: string;
  content: string;
  assigneeStudentId?: string;
  assigneeTeamId?: string;
  assigneeName?: string;
  assignedDate: string;
  dueDate: string;
  status: 'pending' | 'in_progress' | 'completed'; // 🔴 Chưa thực hiện, 🟡 Đang thực hiện, 🟢 Hoàn thành
}

export interface DutyDay {
  id: string;
  dayOfWeek: 'Thứ Hai' | 'Thứ Ba' | 'Thứ Tư' | 'Thứ Năm' | 'Thứ Sáu' | 'Thứ Bảy';
  teamId?: string;
  studentIds?: string[];
  tasks: string; // 'Quét lớp, lau bảng, giặt khăn, kê bàn ghế'
  stars?: number; // 1-5 sao
  evaluationNote?: string;
  awardedPoints?: number;
}

export interface TeacherJournalEntry {
  id: string;
  date: string;
  studentIds?: string[];
  title: string;
  content: string;
  handlingDirection: string; // Hướng xử lý
  result: string; // Kết quả
  notes?: string;
  tags?: string[];
  createdAt: string;
}

export interface ParentCommunication {
  id: string;
  studentId: string;
  date: string;
  form: 'Điện thoại' | 'Gặp trực tiếp' | 'Zalo/Tin nhắn' | 'Họp phụ huynh' | 'Khác';
  content: string;
  result: string;
  notes?: string;
}

export interface ClassSettings {
  schoolName: string;
  className: string;
  academicYear: string;
  homeroomTeacher: string;
  teacherName?: string;
  teamCount: number;
  soundEnabled: boolean;
  repeatWheel: boolean;
  initialPoints?: number;
  maxPointsPerAction?: number;
}

export interface ClassInfo {
  schoolName: string;
  className: string;
  academicYear: string;
  teacherName: string;
  initialPoints: number;
  maxPointsPerAction: number;
}

export type NavigationTab =
  | 'dashboard'
  | 'students'
  | 'attendance'
  | 'attendance_stats'
  | 'competition'
  | 'teams'
  | 'leaderboard'
  | 'badges'
  | 'wheel'
  | 'grouping'
  | 'activities'
  | 'tasks'
  | 'duty'
  | 'birthdays'
  | 'rewards_violations'
  | 'journal'
  | 'parents'
  | 'attention'
  | 'weekly_summary'
  | 'reports'
  | 'export'
  | 'ai_assistant'
  | 'settings';
