import React, { useState } from 'react';
import {
  Bot,
  Sparkles,
  Send,
  Copy,
  Check,
  MessageSquare,
  BookOpen,
  UserCheck,
  Gamepad2,
  HeartHandshake,
  Users,
} from 'lucide-react';
import { Student } from '../../types';
import { soundManager } from '../../utils/sound';

interface AIAssistantViewProps {
  students: Student[];
  teacherName: string;
  className: string;
}

export const AIAssistantView: React.FC<AIAssistantViewProps> = ({
  students,
  teacherName,
  className,
}) => {
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || '');
  const [promptCategory, setPromptCategory] = useState<string>('zalo_parent');
  const [generatedResult, setGeneratedResult] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [customRequest, setCustomRequest] = useState('');

  const selectedStudent = students.find((s) => s.id === selectedStudentId);

  // Suggested prompt templates
  const promptTemplates = [
    {
      id: 'zalo_parent',
      icon: <MessageSquare className="w-4 h-4 text-emerald-600" />,
      title: 'Soạn tin nhắn Zalo gửi phụ huynh',
      description: 'Thông báo tình hình học tập và rèn luyện lịch sự, tình cảm, mang tính sư phạm',
    },
    {
      id: 'semester_comment',
      icon: <BookOpen className="w-4 h-4 text-blue-600" />,
      title: 'Gợi ý lời phê nhận xét học bạ',
      description: 'Đúng chuẩn Thông tư Bộ GD&ĐT, khen ngợi thế mạnh và định hướng rèn luyện',
    },
    {
      id: 'special_support',
      icon: <UserCheck className="w-4 h-4 text-rose-600" />,
      title: 'Biện pháp hỗ trợ học sinh cần quan tâm',
      description: 'Gợi ý giải pháp giáo dục tích cực cho học sinh hay nghỉ học, đi muộn hoặc thiếu tập trung',
    },
    {
      id: 'class_games',
      icon: <Gamepad2 className="w-4 h-4 text-amber-600" />,
      title: 'Gợi ý trò chơi sinh hoạt lớp 15 phút',
      description: 'Trò chơi khuấy động không khí đầu giờ hoặc tiết sinh hoạt cuối tuần gắn kết',
    },
    {
      id: 'meeting_plan',
      icon: <HeartHandshake className="w-4 h-4 text-purple-600" />,
      title: 'Kế hoạch tiết sinh hoạt lớp chủ đề',
      description: 'Xây dựng kịch bản 45 phút sinh hoạt lớp sinh động, phát huy tính chủ động học sinh',
    },
  ];

  const handleGenerate = (templateId?: string) => {
    const activeTemplate = templateId || promptCategory;
    setIsGenerating(true);
    soundManager.playClick();

    setTimeout(() => {
      let output = '';
      const sName = selectedStudent?.fullName || 'học sinh';
      const pName = selectedStudent?.parentName || 'Quý phụ huynh';
      const pPhone = selectedStudent?.parentPhone || '';
      const points = selectedStudent?.points || 30;
      const absents = selectedStudent?.absentDays || 0;

      if (activeTemplate === 'zalo_parent') {
        output = `Kính gửi phụ huynh em ${sName},\n\nTôi là ${teacherName}, giáo viên chủ nhiệm lớp ${className}.\n\nTôi xin phép trao đổi nhanh với gia đình về tình hình học tập và rèn luyện của em ${sName} trong thời gian vừa qua:\n- Điểm rèn luyện thi đua: Hiện em đạt ${points} điểm.\n${
          absents > 0
            ? `- Về chuyên cần: Em có ${absents} buổi nghỉ học. Kính mong phụ huynh nhắc nhở em giữ gìn sức khỏe và theo dõi việc chép bài đầy đủ.`
            : `- Về chuyên cần: Em đi học rất đầy đủ, đúng giờ, nề nếp trang phục chỉnh tề.`
        }\n- Tinh thần học tập: Em có thái độ hòa nhã với thầy cô và bạn bè, trong lớp chú ý lắng nghe giảng bài.\n\nNhà trường và thầy cô rất mong tiếp tục nhận được sự đồng hành chặt chẽ từ gia đình để giúp em ${sName} ngày càng tiến bộ hơn nữa.\n\nKính chúc gia đình nhiều sức khỏe và niềm vui!\nTrân trọng,\nGVCN ${teacherName}.`;
      } else if (activeTemplate === 'semester_comment') {
        output = `[LỜI PHÊ HỌC BẠ ĐỀ XUẤT CHO EM ${sName.toUpperCase()}]:\n\n1. Phẩm chất: Chăm ngoan, lễ phép, có tinh thần trách nhiệm cao đối với tập thể lớp. Biết đoàn kết, tương trợ và giúp đỡ bạn bè xung quanh.\n\n2. Năng lực học tập: Tiếp thu bài nhanh, tích cực tham gia xây dựng bài trong các giờ học (${points} điểm thi đua). Chữ viết cẩn thận, hoàn thành tốt các nhiệm vụ được giao.\n\n3. Góp ý rèn luyện: Cần tiếp tục phát huy sự tự tin khi trình bày trước đám đông và rèn luyện kỹ năng tự học sâu hơn nữa.\n\n=> Đánh giá chung: Hoàn thành Tốt nhiệm vụ năm học.`;
      } else if (activeTemplate === 'special_support') {
        output = `[BIỆN PHÁP SƯ PHẠM HỖ TRỢ EM ${sName.toUpperCase()}]:\n\n1. Tâm lý tiếp cận: Tránh phê bình gay gắt trước tập thể lớp. GVCN gặp riêng trò chuyện ngắn sau giờ học để lắng nghe khó khăn thực tế (gia đình, sức khỏe, áp lực môn học).\n2. Giao việc có chủ đích: Phân công em một nhiệm vụ nhỏ cụ thể (hỗ trợ kiểm tra sỹ số bàn, phát tài liệu) để tạo cảm giác được ghi nhận và có trách nhiệm.\n3. Đôi bạn cùng tiến: Xếp em ngồi cạnh bạn có lực học và ý thức tốt trong Tổ để hỗ trợ nhau.\n4. Khen thưởng kịp thời: Chỉ cần em có 1 biểu hiện tích cực nhỏ (đi học sớm, phát biểu 1 câu), GVCN cộng ngay +2 điểm thi đua để khích lệ.\n5. Phối hợp gia đình: Gọi điện định kỳ cuối tuần thông báo tin vui về sự thay đổi của em cho phụ huynh.`;
      } else if (activeTemplate === 'class_games') {
        output = `[GỢI Ý 3 TRÒ CHƠI SINH HOẠT LỚP KHUẤY ĐỘNG - LỚP ${className}]:\n\n🎯 1. Trò chơi "Ai nhanh hơn - Truy tìm kho báu kiến thức":\n- Thời gian: 10 phút.\n- Cách chơi: Chia 4 tổ thi đấu. GV đưa ra câu đố mẹo hoặc câu hỏi kiến thức tuần qua. Tổ nào bấm chuông/giơ cờ trước trả lời đúng được cộng 5 điểm tổ.\n\n🎯 2. Trò chơi "Chiếc hộp bí mật - Nói lời cảm ơn":\n- Thời gian: 15 phút.\n- Cách chơi: Mỗi bạn viết 1 lời khen ngợi hoặc lời cảm ơn ẩn danh cho 1 bạn bất kỳ trong lớp bỏ vào hộp. GVCN bốc thăm đọc to, tạo không khí xúc động và gắn kết.\n\n🎯 3. Trò chơi "Tam sao thất bản - Đoán ý đồng đội":\n- Thời gian: 12 phút.\n- Cách chơi: Đội hình 5 bạn truyền thông điệp bằng hành động không lời. Giúp rèn luyện khả năng quan sát và mang lại tiếng cười sảng khoái.`;
      } else {
        output = `[KỊCH BẢN TIẾT SINH HOẠT LỚP 45 PHÚT - CHỦ ĐỀ: "XÂY DỰNG TÌNH BẠN ĐẸP"]:\n\n1. Khởi động (5 phút): Văn nghệ tập thể hoặc trò chơi ngắn khuấy động không khí.\n2. Sơ kết tuần (10 phút): Lớp trưởng & các Tổ trưởng báo cáo điểm thi đua và nề nếp tuần qua.\n3. GVCN nhận xét & Tuyên dương (10 phút): Trao huy hiệu cho học sinh xuất sắc, khen ngợi tổ dẫn đầu và nhắc nhở chân thành các tồn tại.\n4. Sinh hoạt theo chủ đề (15 phút): Thảo luận cách ứng xử văn minh trong lớp học, không trêu chọc bạn, chia sẻ một câu chuyện đẹp về tình bạn.\n5. Kế hoạch tuần tới (5 phút): Phổ biến lịch kiểm tra và phân công trực nhật.`;
      }

      setGeneratedResult(output);
      setIsGenerating(false);
      soundManager.playSuccess();
    }, 600);
  };

  const handleCopy = () => {
    if (!generatedResult) return;
    navigator.clipboard.writeText(generatedResult);
    setCopied(true);
    soundManager.playSuccess();
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-blue-950 p-6 rounded-3xl text-white shadow-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-xs flex items-center justify-center border border-white/20 text-amber-400">
            <Bot className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black tracking-wide">GIÁO THUẬN AI</h2>
              <span className="text-[10px] font-black bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full uppercase tracking-wider">
                PRO
              </span>
            </div>
            <p className="text-xs text-purple-200 mt-0.5">
              Ứng dụng A.I trong giảng dạy & Công tác chủ nhiệm lớp học
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10 text-xs text-purple-200">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Sẵn sàng trợ giúp GVCN</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Selection and Category Prompts */}
        <div className="space-y-4">
          {/* Target Student Picker */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <label className="block text-xs font-black text-slate-700 uppercase tracking-wider">
              Chọn học sinh cần xử lý:
            </label>
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="w-full px-3 py-2 text-xs md:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 font-bold bg-white"
            >
              {students.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.stt}. {st.fullName} ({st.points} đ - Vắng {st.absentDays})
                </option>
              ))}
            </select>

            {selectedStudent && (
              <div className="bg-purple-50/70 p-3 rounded-xl border border-purple-100 text-xs space-y-1">
                <p className="font-bold text-purple-900">{selectedStudent.fullName}</p>
                <p className="text-purple-700 text-[11px]">
                  Phụ huynh: {selectedStudent.parentName} ({selectedStudent.parentPhone})
                </p>
                <p className="text-purple-700 text-[11px]">
                  Điểm thi đua: {selectedStudent.points} đ • Vắng: {selectedStudent.absentDays} buổi
                </p>
              </div>
            )}
          </div>

          {/* Quick AI Task Cards */}
          <div className="space-y-2">
            <span className="text-xs font-black text-slate-500 uppercase tracking-wider block px-1">
              Gợi ý tác vụ 1 chạm:
            </span>

            {promptTemplates.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setPromptCategory(item.id);
                  handleGenerate(item.id);
                }}
                className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-start gap-3 ${
                  promptCategory === item.id
                    ? 'bg-purple-50 border-purple-300 ring-2 ring-purple-400/20 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-purple-200'
                }`}
              >
                <div className="p-2 bg-slate-50 rounded-xl border border-slate-100 mt-0.5">
                  {item.icon}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">{item.title}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: AI Output Editor */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between min-h-[520px]">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <h3 className="font-black text-slate-900 text-sm md:text-base">
                  KẾT QUẢ SOẠN THẢO A.I TỰ ĐỘNG
                </h3>
              </div>

              {generatedResult && (
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-100 hover:bg-purple-200 text-purple-800 text-xs font-bold rounded-xl transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Đã sao chép!' : 'Sao chép văn bản'}</span>
                </button>
              )}
            </div>

            {isGenerating ? (
              <div className="py-20 text-center space-y-3">
                <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto" />
                <p className="text-xs font-bold text-purple-700">
                  GIÁO THUẬN AI đang phân tích dữ liệu và soạn thảo...
                </p>
              </div>
            ) : generatedResult ? (
              <textarea
                value={generatedResult}
                onChange={(e) => setGeneratedResult(e.target.value)}
                rows={14}
                className="w-full p-4 text-xs md:text-sm text-slate-800 bg-slate-50 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 font-sans leading-relaxed resize-none"
              />
            ) : (
              <div className="py-20 text-center text-slate-400 space-y-2">
                <Bot className="w-12 h-12 mx-auto text-slate-300" />
                <p className="font-bold text-sm text-slate-500">Chưa có nội dung</p>
                <p className="text-xs">
                  Chọn một học sinh và bấm vào gợi ý tác vụ bên trái để A.I bắt đầu soạn thảo.
                </p>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              * GVCN có thể chỉnh sửa trực tiếp nội dung trên trước khi gửi.
            </span>
            <button
              onClick={() => handleGenerate()}
              disabled={isGenerating}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:brightness-110 text-white font-bold text-xs md:text-sm rounded-xl shadow-md shadow-purple-500/20 active:scale-95 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>{generatedResult ? 'TẠO LẠI BẢN KHÁC' : 'BẮT ĐẦU SOẠN THẢO'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
