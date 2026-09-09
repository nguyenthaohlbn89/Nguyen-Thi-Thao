import React, { useState, useRef, useEffect } from 'react';
import { Disc, RotateCcw, Volume2, Sparkles, Check, Users, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Student } from '../../types';
import { soundManager } from '../../utils/sound';

interface LuckyWheelViewProps {
  students: Student[];
}

export const LuckyWheelView: React.FC<LuckyWheelViewProps> = ({ students }) => {
  const [excludeSelected, setExcludeSelected] = useState(false);
  const [calledStudentIds, setCalledStudentIds] = useState<string[]>([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedWinner, setSelectedWinner] = useState<Student | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rotationAngleRef = useRef(0);
  const spinSpeedRef = useRef(0);
  const animationFrameRef = useRef<number | null>(null);

  // Active pool of students on the wheel
  const activePool = students.filter((s) => !excludeSelected || !calledStudentIds.includes(s.id));

  // Distinct pleasant segment colors
  const segmentColors = [
    '#3B82F6', // Blue
    '#10B981', // Emerald
    '#F59E0B', // Amber
    '#EC4899', // Pink
    '#8B5CF6', // Purple
    '#06B6D4', // Cyan
    '#F97316', // Orange
    '#14B8A6', // Teal
    '#6366F1', // Indigo
    '#EF4444', // Red
  ];

  // Draw wheel on canvas
  const drawWheel = (angle: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = width / 2 - 16;

    ctx.clearRect(0, 0, width, height);

    if (activePool.length === 0) {
      ctx.save();
      ctx.fillStyle = '#64748B';
      ctx.font = 'bold 16px "Be Vietnam Pro", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Đã gọi hết tất cả học sinh!', centerX, centerY);
      ctx.restore();
      return;
    }

    const sliceAngle = (2 * Math.PI) / activePool.length;

    // Draw slices
    for (let i = 0; i < activePool.length; i++) {
      const sliceStart = angle + i * sliceAngle;
      const sliceEnd = sliceStart + sliceAngle;
      const color = segmentColors[i % segmentColors.length];

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, sliceStart, sliceEnd);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#FFFFFF';
      ctx.stroke();

      // Text drawing
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(sliceStart + sliceAngle / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 13px "Be Vietnam Pro", sans-serif';
      ctx.shadowColor = 'rgba(0,0,0,0.4)';
      ctx.shadowBlur = 4;

      // Extract short name or full name
      const name = activePool[i].fullName;
      const displayName = name.length > 15 ? name.split(' ').slice(-2).join(' ') : name;
      ctx.fillText(displayName, radius - 20, 5);
      ctx.restore();
    }

    // Outer ring border
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#FFFFFF';
    ctx.stroke();

    // Center hub
    ctx.beginPath();
    ctx.arc(centerX, centerY, 34, 0, 2 * Math.PI);
    ctx.fillStyle = '#1E293B';
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#F8FAFC';
    ctx.stroke();

    // Inner hub dot
    ctx.beginPath();
    ctx.arc(centerX, centerY, 14, 0, 2 * Math.PI);
    ctx.fillStyle = '#38BDF8';
    ctx.fill();
  };

  useEffect(() => {
    drawWheel(rotationAngleRef.current);
  }, [activePool.length, excludeSelected, calledStudentIds]);

  // Spin execution
  const handleSpin = () => {
    if (isSpinning || activePool.length === 0) return;

    setSelectedWinner(null);
    setIsSpinning(true);
    soundManager.playClick();

    // Pick random winner from active pool
    const winnerIndex = Math.floor(Math.random() * activePool.length);
    const targetWinner = activePool[winnerIndex];

    // Calculate angle to land on winnerIndex
    // In canvas: 0 rad points to right (3 o'clock), but our pointer is at top (12 o'clock, 3*PI/2) or right (0).
    // Let's place pointer at Right (0 rad / 3 o'clock).
    const sliceAngle = (2 * Math.PI) / activePool.length;
    // We want slice `winnerIndex` to be at pointer angle (0 rad).
    // slice center is angle + (winnerIndex + 0.5) * sliceAngle = 2 * PI * N
    // => angle = 2*PI*N - (winnerIndex + 0.5)*sliceAngle
    const fullRotations = 6 + Math.floor(Math.random() * 4); // 6 to 9 full spins
    const targetAngle =
      rotationAngleRef.current +
      fullRotations * 2 * Math.PI +
      (2 * Math.PI - (winnerIndex + 0.5) * sliceAngle - (rotationAngleRef.current % (2 * Math.PI)));

    const startTime = performance.now();
    const duration = 4800; // 4.8 seconds deceleration curve
    const initialAngle = rotationAngleRef.current;
    let lastTickAngle = initialAngle;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease Out Cubic: 1 - pow(1 - progress, 3)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentAngle = initialAngle + (targetAngle - initialAngle) * easeOut;
      rotationAngleRef.current = currentAngle;

      // Tick sound when passing slice boundaries
      if (Math.abs(currentAngle - lastTickAngle) >= sliceAngle) {
        soundManager.playWheelTick(1 + progress * 0.5);
        lastTickAngle = currentAngle;
      }

      drawWheel(currentAngle);

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        // Spin finished!
        setIsSpinning(false);
        setSelectedWinner(targetWinner);
        soundManager.playWinnerFanfare();

        // Confetti explosion
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });

        // If excludeSelected is active, add to called list
        if (excludeSelected) {
          setCalledStudentIds((prev) => [...prev, targetWinner.id]);
        }
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);
  };

  const handleResetCalledList = () => {
    setCalledStudentIds([]);
    setSelectedWinner(null);
    soundManager.playClick();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Disc className="w-6 h-6 text-purple-600" />
            <span>Vòng quay may mắn gọi tên học sinh</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Tạo không khí sôi nổi trong giờ học, kiểm tra bài cũ hoặc phân công phát biểu ngẫu nhiên
          </p>
        </div>

        {/* Options */}
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl cursor-pointer">
            <input
              type="checkbox"
              checked={excludeSelected}
              onChange={(e) => setExcludeSelected(e.target.checked)}
              className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
            />
            <span>Không gọi lại học sinh đã chọn</span>
          </label>

          <button
            onClick={handleResetCalledList}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>🔄 ĐẶT LẠI DANH SÁCH</span>
          </button>
        </div>
      </div>

      {/* Main Wheel Arena */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Wheel Canvas Container */}
        <div className="lg:col-span-2 bg-gradient-to-b from-purple-950 via-slate-900 to-indigo-950 p-6 md:p-8 rounded-3xl shadow-xl flex flex-col items-center justify-center relative overflow-hidden">
          <div className="relative flex items-center justify-center">
            {/* The Canvas */}
            <canvas
              ref={canvasRef}
              width={420}
              height={420}
              className="max-w-full h-auto drop-shadow-2xl"
            />

            {/* The Pointer arrow (Pointing to the right hub edge) */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 z-20 pointer-events-none">
              <div className="w-0 h-0 border-t-[14px] border-t-transparent border-b-[14px] border-b-transparent border-r-[26px] border-r-amber-400 drop-shadow-md" />
            </div>
          </div>

          {/* Big Spin Button */}
          <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
            <button
              onClick={handleSpin}
              disabled={isSpinning || activePool.length === 0}
              className={`px-10 py-4 text-base font-black tracking-wider uppercase rounded-2xl shadow-xl transition-all transform active:scale-95 flex items-center gap-3 ${
                isSpinning || activePool.length === 0
                  ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 text-slate-950 hover:brightness-110 shadow-orange-500/30'
              }`}
            >
              <Disc className={`w-6 h-6 ${isSpinning ? 'animate-spin' : ''}`} />
              <span>{isSpinning ? 'ĐANG QUAY...' : '🎡 QUAY NGAY'}</span>
            </button>
          </div>

          <p className="text-xs text-slate-400 mt-3 font-medium">
            Số học sinh trong vòng quay: <strong className="text-amber-400">{activePool.length}</strong> / {students.length} em
          </p>
        </div>

        {/* Right side: Winner & Called List */}
        <div className="space-y-4">
          {/* Winner Banner */}
          {selectedWinner ? (
            <div className="bg-gradient-to-br from-amber-50 via-white to-purple-50 p-6 rounded-2xl border-2 border-amber-300 shadow-md animate-in zoom-in-95 text-center">
              <span className="text-xs font-black uppercase text-amber-700 bg-amber-100 px-3 py-1 rounded-full inline-block mb-2">
                🎉 HỌC SINH ĐƯỢC CHỌN
              </span>
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-purple-600 to-blue-600 text-white font-black text-2xl mx-auto flex items-center justify-center my-3 shadow-lg ring-4 ring-amber-300">
                {selectedWinner.fullName.split(' ').slice(-1)[0][0]}
              </div>
              <h3 className="text-xl font-black text-slate-900">{selectedWinner.fullName}</h3>
              <p className="text-xs text-slate-500 mt-1">
                STT: {selectedWinner.stt} • {selectedWinner.position}
              </p>

              <button
                onClick={handleSpin}
                disabled={isSpinning || activePool.length === 0}
                className="mt-5 w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
              >
                QUAY TIẾP
              </button>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center text-slate-400 text-xs py-10">
              <Disc className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              <p className="font-semibold">Bấm &quot;QUAY NGAY&quot; để chọn học sinh ngẫu nhiên</p>
            </div>
          )}

          {/* Called List */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider">
                Đã gọi ({calledStudentIds.length} em)
              </h4>
              {calledStudentIds.length > 0 && (
                <button
                  onClick={handleResetCalledList}
                  className="text-[11px] font-bold text-blue-600 hover:underline"
                >
                  Xóa lịch sử
                </button>
              )}
            </div>

            <div className="max-h-48 overflow-y-auto divide-y divide-slate-100">
              {calledStudentIds.length > 0 ? (
                calledStudentIds.map((id) => {
                  const st = students.find((s) => s.id === id);
                  if (!st) return null;
                  return (
                    <div key={id} className="py-2 flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800">{st.fullName}</span>
                      <span className="text-[11px] text-slate-400">STT: {st.stt}</span>
                    </div>
                  );
                })
              ) : (
                <p className="text-center py-4 text-xs text-slate-400">Chưa có ai được gọi</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
