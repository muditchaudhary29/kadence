import React from 'react';
import { Activity } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, ReferenceLine } from 'recharts';

export default function PacingInconsistencyWidget({ pacingAnalysis, overallWpm }) {
  const { volatilityScore, status, color, segments, desc } = pacingAnalysis;

  const chartData = segments.map((seg, i) => ({
    name: seg.label,
    wpm: seg.wpm
  }));

  return (
    <div className="brutal-card rounded-2xl p-5 flex flex-col justify-between h-full space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-cyan-500 text-slate-950 border-2 border-slate-900 flex items-center justify-center shadow-[2px_2px_0px_#0F172A] shrink-0">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-base font-black font-heading leading-tight">Speech Pace Inconsistency</h4>
            <p className="text-xs font-semibold opacity-80 mt-0.5">Fluctuations & velocity variations</p>
          </div>
        </div>
        <span className="brutal-badge bg-amber-400 text-slate-950 text-[10px] font-black border border-slate-900">
          {status}
        </span>
      </div>

      {/* Line Chart of Segment WPM Velocity */}
      <div className="h-32 w-full my-2">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <XAxis dataKey="name" stroke="#475569" tick={{ fill: '#475569', fontSize: 10, fontWeight: 'bold' }} />
              <YAxis domain={[60, 200]} stroke="#475569" tick={{ fill: '#475569', fontSize: 10, fontWeight: 'bold' }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', fontSize: '11px', color: '#FFFFFF' }}
                itemStyle={{ color: '#38BDF8' }}
              />
              <ReferenceLine y={140} stroke="#10B981" strokeDasharray="3 3" label={{ value: '140 WPM Target', fill: '#059669', fontSize: 10, fontWeight: 'bold' }} />
              <Line
                type="monotone"
                dataKey="wpm"
                stroke="#0284C7"
                strokeWidth={3.5}
                dot={{ r: 4, fill: '#0284C7' }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs font-bold opacity-75">
            Record speech to plot pacing timeline
          </div>
        )}
      </div>

      <div className="pt-3 border-t-2 border-slate-700 flex items-center justify-between text-xs font-bold">
        <span className="truncate pr-2 opacity-80">{desc}</span>
        <span className="font-mono text-cyan-600 dark:text-cyan-400 font-extrabold shrink-0">±{volatilityScore}% Volatility</span>
      </div>
    </div>
  );
}
