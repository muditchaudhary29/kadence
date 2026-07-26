import React from 'react';
import { Target, Award } from 'lucide-react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

export default function StarBreakdown({ starAnalysis }) {
  const { overallScore, components } = starAnalysis;

  const chartData = components.map(c => ({
    subject: c.name, score: c.score, fullMark: 100
  }));

  const scoreBadge = (score) =>
    score >= 85 ? { bg: 'rgba(16,185,129,0.12)', color: '#34D399', border: 'rgba(16,185,129,0.3)' }
    : score >= 70 ? { bg: 'rgba(124,58,237,0.12)', color: '#A78BFA', border: 'rgba(124,58,237,0.3)' }
    : { bg: 'rgba(245,158,11,0.12)', color: '#FCD34D', border: 'rgba(245,158,11,0.3)' };

  return (
    <div className="glass-card rounded-2xl p-5 flex flex-col justify-between h-full"
         style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl" style={{ background: 'rgba(168,85,247,0.12)', border: '1px solid rgba(168,85,247,0.25)' }}>
            <Target className="w-5 h-5" style={{ color: '#C084FC' }} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-zinc-200">STAR Method</h4>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Situation · Task · Action · Result</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full"
             style={{ background: 'rgba(168,85,247,0.12)', border: '1px solid rgba(168,85,247,0.3)' }}>
          <Award className="w-4 h-4" style={{ color: '#C084FC' }} />
          <span className="text-xs font-bold" style={{ color: '#E9D5FF' }}>{overallScore}%</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-4 my-2">
        {/* Radar chart */}
        <div className="h-44 w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
              <PolarGrid stroke="rgba(255,255,255,0.06)" />
              <PolarAngleAxis dataKey="subject" stroke="#71717a" tick={{ fill: '#a1a1aa', fontSize: 11 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="rgba(255,255,255,0.04)" tick={false} />
              <Radar name="Score" dataKey="score" stroke="#A78BFA" fill="#7C3AED" fillOpacity={0.35} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Score items */}
        <div className="space-y-2.5">
          {components.map((item, idx) => {
            const s = scoreBadge(item.score);
            return (
              <div key={idx}
                   className="p-2.5 rounded-xl flex items-center justify-between text-xs"
                   style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div>
                  <div className="flex items-center gap-1.5 font-semibold text-zinc-200">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#A78BFA' }} />
                    {item.name}
                  </div>
                  <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{item.desc}</p>
                </div>
                <span className="px-2 py-0.5 rounded-md font-mono font-bold text-xs"
                      style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>
                  {item.score}%
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="pt-3 flex items-center justify-between text-xs"
           style={{ borderTop: '1px solid rgba(255,255,255,0.06)', color: 'var(--text-muted)' }}>
        <span>Behavioral Interview Standard</span>
        <span style={{ color: '#C084FC' }} className="font-medium">Optimal alignment</span>
      </div>
    </div>
  );
}
