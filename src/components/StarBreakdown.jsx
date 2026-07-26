import React from 'react';
import { Target, Award } from 'lucide-react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

export default function StarBreakdown({ starAnalysis }) {
  const { overallScore, components } = starAnalysis;

  const chartData = components.map(c => ({
    subject: c.name, score: c.score, fullMark: 100
  }));

  return (
    <div className="brutal-card p-6 flex flex-col justify-between h-full space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500 text-white border-2 border-slate-900 flex items-center justify-center shadow-[2px_2px_0px_#000]">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-base font-bold font-heading">STAR Method Score</h4>
            <p className="text-xs text-zinc-400">Situation · Task · Action · Result</p>
          </div>
        </div>
        <div className="brutal-badge bg-purple-500/20 text-purple-300 border-purple-500/40 px-3 py-1 text-xs">
          <Award className="w-4 h-4 text-purple-400" />
          <span className="font-bold">{overallScore}% Score</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-4 my-2">
        {/* Radar chart */}
        <div className="h-44 w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
              <PolarGrid stroke="var(--border-brutal)" />
              <PolarAngleAxis dataKey="subject" stroke="var(--text-main)" tick={{ fill: 'var(--text-main)', fontSize: 11, fontWeight: 700 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="var(--border-brutal)" tick={false} />
              <Radar name="Score" dataKey="score" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.4} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Score items */}
        <div className="space-y-2.5">
          {components.map((item, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl border-2 border-slate-900 neu-inset flex items-center justify-between text-xs"
            >
              <div>
                <div className="flex items-center gap-2 font-bold font-heading text-sm">
                  <span className="w-2 h-2 rounded-full bg-purple-500" />
                  {item.name}
                </div>
                <p className="text-xs text-zinc-400 mt-0.5">{item.desc}</p>
              </div>
              <span className="px-2.5 py-1 rounded-lg font-mono font-extrabold text-xs border-2 border-slate-900 bg-purple-500 text-white shadow-[2px_2px_0px_#000]">
                {item.score}%
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-3 border-t-2 border-slate-700 flex items-center justify-between text-xs font-medium">
        <span>Behavioral Interview Standard</span>
        <span className="font-bold text-purple-400">Optimal alignment</span>
      </div>
    </div>
  );
}
