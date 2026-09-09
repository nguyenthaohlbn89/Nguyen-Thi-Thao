import { Student, Team, AttendanceRecord, CompetitionLog, ParentCommunication, ClassSettings } from '../types';

// Helper to trigger browser download with UTF-8 BOM
export const downloadFile = (content: string, fileName: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// Format CSV field to escape commas, quotes, newlines
const escapeCSV = (field: string | number | undefined | null): string => {
  if (field === undefined || field === null) return '""';
  const str = String(field);
  return `"${str.replace(/"/g, '""')}"`;
};

// Export Students list
export const exportStudentsToExcel = (students: Student[], teams: Team[], settings?: { className?: string }) => {
  const className = settings?.className || '6A7';
  const teamMap = new Map(teams.map((t) => [t.id, t.name]));
  const headers = [
    'STT',
    'Họ và tên',
    'Ngày sinh',
    'Giới tính',
    'Tổ',
    'Chức vụ',
    'Điểm thi đua',
    'Số ngày nghỉ',
    'Đi muộn',
    'Họ tên PH',
    'Quan hệ',
    'SĐT Phụ huynh',
    'Email PH',
    'Địa chỉ',
    'Ghi chú',
  ];

  const rows = students.map((s) => [
    escapeCSV(s.stt),
    escapeCSV(s.fullName),
    escapeCSV(s.birthDate),
    escapeCSV(s.gender),
    escapeCSV(teamMap.get(s.teamId) || s.teamId),
    escapeCSV(s.position),
    escapeCSV(s.points),
    escapeCSV(s.absentDays),
    escapeCSV(s.lateDays),
    escapeCSV(s.parentName),
    escapeCSV(s.parentRelationship),
    escapeCSV(s.parentPhone),
    escapeCSV(s.parentEmail || ''),
    escapeCSV(s.address || ''),
    escapeCSV(s.notes || ''),
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
  const now = new Date().toISOString().split('T')[0];
  const filename = `DanhSachHocSinh_${className}_${now}.csv`;
  downloadFile(csvContent, filename, 'text/csv;charset=utf-8;');
};

export const exportStudentsToCSV = exportStudentsToExcel;

// Export Attendance & Attendance stats
export const exportAttendanceToExcel = (
  attendances: AttendanceRecord[],
  students: Student[],
  settings?: { className?: string },
  targetDate?: string
) => {
  const className = settings?.className || '6A7';
  const headers = [
    'STT',
    'Họ và tên',
    'Ngày điểm danh',
    'Trạng thái',
    'Ghi chú lý do',
  ];

  const statusLabel = {
    present: 'Có mặt',
    absent: 'Vắng',
    late: 'Đi muộn',
    excused: 'Nghỉ có phép',
  };

  const recordsToExport = targetDate
    ? attendances.filter((a) => a.date === targetDate)
    : attendances;

  const studentMap = new Map(students.map((s) => [s.id, s]));

  const rows = recordsToExport.map((att) => {
    const st = studentMap.get(att.studentId);
    return [
      escapeCSV(st?.stt || ''),
      escapeCSV(st?.fullName || 'Không xác định'),
      escapeCSV(att.date),
      escapeCSV(statusLabel[att.status] || att.status),
      escapeCSV(att.note || ''),
    ];
  });

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
  const dateStr = targetDate || new Date().toISOString().split('T')[0];
  const filename = `DiemDanh_Lop${className}_${dateStr}.csv`;
  downloadFile(csvContent, filename, 'text/csv;charset=utf-8;');
};

export const exportAttendanceToCSV = exportAttendanceToExcel;

// Export Competition log
export const exportCompetitionToExcel = (
  students: Student[],
  teams: Team[],
  logs: CompetitionLog[],
  settings?: { className?: string }
) => {
  const className = settings?.className || '6A7';
  const studentMap = new Map(students.map((s) => [s.id, s.fullName]));
  const teamMap = new Map(teams.map((t) => [t.id, t.name]));

  const headers = ['Ngày', 'Đối tượng', 'Loại', 'Tiêu chí / Nội dung', 'Điểm', 'Ghi chú'];

  const rows = logs.map((log) => {
    const targetName = log.studentId
      ? studentMap.get(log.studentId) || 'Học sinh'
      : log.teamId
      ? teamMap.get(log.teamId) || 'Tổ'
      : 'Chung';
    const typeStr = log.studentId ? 'Học sinh' : 'Cả tổ';
    return [
      escapeCSV(log.date),
      escapeCSV(targetName),
      escapeCSV(typeStr),
      escapeCSV(log.criterionName),
      escapeCSV(log.points > 0 ? `+${log.points}` : log.points),
      escapeCSV(log.notes || ''),
    ];
  });

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
  const now = new Date().toISOString().split('T')[0];
  const filename = `ThiDua_Lop${className}_${now}.csv`;
  downloadFile(csvContent, filename, 'text/csv;charset=utf-8;');
};

export const exportCompetitionToCSV = exportCompetitionToExcel;

// Export Parents list
export const exportParentsToExcel = (students: Student[], settings: ClassSettings) => {
  const headers = ['STT', 'Họ tên học sinh', 'Họ tên phụ huynh', 'Mối quan hệ', 'SĐT', 'Email', 'Địa chỉ'];

  const rows = students.map((s) => [
    escapeCSV(s.stt),
    escapeCSV(s.fullName),
    escapeCSV(s.parentName),
    escapeCSV(s.parentRelationship),
    escapeCSV(s.parentPhone),
    escapeCSV(s.parentEmail || ''),
    escapeCSV(s.address || ''),
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
  const now = new Date().toISOString().split('T')[0];
  const className = settings?.className || '6A7';
  const filename = `DanhSachPhuHuynh_${className}_${now}.csv`;
  downloadFile(csvContent, filename, 'text/csv;charset=utf-8;');
};

// Backup Full JSON
export const exportDatabaseJSON = (data: unknown, settings?: Partial<ClassSettings>) => {
  const jsonStr = JSON.stringify(data, null, 2);
  const now = new Date().toISOString().split('T')[0];
  const className = settings?.className || '6A7';
  const filename = `SaoLuu_GVCN360_${className}_${now}.json`;
  downloadFile(jsonStr, filename, 'application/json');
};
