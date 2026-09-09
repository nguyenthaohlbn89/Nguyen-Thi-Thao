import React, { useState } from 'react';
import { Shuffle, Copy, Check, Users, RotateCcw, Sparkles } from 'lucide-react';
import { Student } from '../../types';
import { soundManager } from '../../utils/sound';

interface GroupingViewProps {
  students: Student[];
}

export const GroupingView: React.FC<GroupingViewProps> = ({ students }) => {
  const [splitMode, setSplitMode] = useState<'byGroups' | 'bySize'>('byGroups');
  const [groupCount, setGroupCount] = useState(4);
  const [groupSize, setGroupSize] = useState(5);
  const [generatedGroups, setGeneratedGroups] = useState<{ id: number; name: string; members: Student[] }[]>([]);
  const [copied, setCopied] = useState(false);

  // Group division algorithm
  const handleGenerateGroups = () => {
    soundManager.playClick();
    if (students.length === 0) return;

    // Shuffle array
    const shuffled = [...students].sort(() => Math.random() - 0.5);

    let numGroups = groupCount;
    if (splitMode === 'bySize') {
      numGroups = Math.max(1, Math.ceil(students.length / groupSize));
    }

    const groups: { id: number; name: string; members: Student[] }[] = [];
    for (let i = 0; i < numGroups; i++) {
      groups.push({
        id: i + 1,
        name: `Nhóm ${i + 1}`,
        members: [],
      });
    }

    // Distribute students round-robin
    shuffled.forEach((student, index) => {
      const groupIndex = index % numGroups;
      groups[groupIndex].members.push(student);
    });

    setGeneratedGroups(groups);
  };

  // Copy to clipboard formatted for Zalo / presentation
  const handleCopyGroups = () => {
    if (generatedGroups.length === 0) return;

    let text = `📋 DANH SÁCH CHIA NHÓM HOẠT ĐỘNG - LỚP 6A7 TIỀN AN\n`;
    text += `Tổng số: ${students.length} học sinh chia thành ${generatedGroups.length} nhóm\n\n`;

    generatedGroups.forEach((g) => {
      text += `🌟 ${g.name.toUpperCase()} (${g.members.length} thành viên):\n`;
      g.members.forEach((m, idx) => {
        text += `  ${idx + 1}. ${m.fullName}\n`;
      });
      text += `\n`;
    });

    navigator.clipboard.writeText(text);
    setCopied(true);
    soundManager.playSuccess();
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Shuffle className="w-6 h-6 text-indigo-600" />
            <span>Chia nhóm học tập ngẫu nhiên</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Phục vụ thảo luận nhóm, trò chơi học tập hoặc phân công hoạt động trải nghiệm
          </p>
        </div>

        {generatedGroups.length > 0 && (
          <button
            onClick={handleCopyGroups}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs md:text-sm rounded-xl shadow-xs transition-colors"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'ĐÃ COPY DANH SÁCH!' : '📋 COPY DANH SÁCH NHÓM'}</span>
          </button>
        )}
      </div>

      {/* Configuration Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setSplitMode('byGroups')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                splitMode === 'byGroups'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Chia theo số lượng nhóm
            </button>
            <button
              onClick={() => setSplitMode('bySize')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                splitMode === 'bySize'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Chia theo số học sinh / nhóm
            </button>
          </div>

          {splitMode === 'byGroups' ? (
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-slate-700">Số lượng nhóm:</label>
              <select
                value={groupCount}
                onChange={(e) => setGroupCount(parseInt(e.target.value))}
                className="px-3 py-1.5 text-xs font-bold border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white"
              >
                {[2, 3, 4, 5, 6, 7, 8].map((n) => (
                  <option key={n} value={n}>
                    {n} nhóm
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-slate-700">Số học sinh / nhóm:</label>
              <select
                value={groupSize}
                onChange={(e) => setGroupSize(parseInt(e.target.value))}
                className="px-3 py-1.5 text-xs font-bold border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white"
              >
                {[3, 4, 5, 6, 7, 8, 10].map((n) => (
                  <option key={n} value={n}>
                    {n} em / nhóm
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            onClick={handleGenerateGroups}
            className="flex items-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs md:text-sm rounded-xl shadow-md shadow-indigo-500/20 active:scale-95 transition-all ml-auto"
          >
            <Shuffle className="w-4 h-4" />
            <span>🎲 CHIA NHÓM NGẪU NHIÊN</span>
          </button>
        </div>
      </div>

      {/* Results Groups Grid */}
      {generatedGroups.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {generatedGroups.map((group, gIdx) => {
            const colors = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4'];
            const headerColor = colors[gIdx % colors.length];

            return (
              <div
                key={group.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col"
              >
                <div
                  className="p-3.5 text-white flex items-center justify-between"
                  style={{ backgroundColor: headerColor }}
                >
                  <h3 className="font-black text-sm flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    <span>{group.name}</span>
                  </h3>
                  <span className="text-[11px] font-bold bg-white/25 px-2 py-0.5 rounded-full">
                    {group.members.length} em
                  </span>
                </div>

                <div className="p-3 divide-y divide-slate-100 flex-1">
                  {group.members.map((member, mIdx) => (
                    <div key={member.id} className="py-2 flex items-center gap-2 text-xs">
                      <span className="w-5 text-slate-400 font-bold">{mIdx + 1}.</span>
                      <span className="font-bold text-slate-800">{member.fullName}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-400 space-y-2">
          <Shuffle className="w-12 h-12 mx-auto text-slate-300" />
          <p className="font-semibold text-sm">Chưa có danh sách chia nhóm</p>
          <p className="text-xs">Bấm &quot;CHIA NHÓM NGẪU NHIÊN&quot; ở trên để bắt đầu tạo nhóm mới</p>
        </div>
      )}
    </div>
  );
};
