import React from 'react';
import { Activity, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, ReferenceLine } from 'recharts';

export default function PacingInconsistencyWidget({ pacingAnalysis, overallWpm }) {
  const { volatilityScore, status, color, segments, desc } = pacingAnalysis;

  const chartData = segments.map((seg, i) => ({
    name: seg.label,
    wpm: seg.wpm
  }));

  return (
    <div className="glass-card rounded-2xl p-5 border border-zinc-800 flex flex-col justify-between h-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-cyan-500/10 text-cyan-400 rounded-lg">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-zinc-200">Speech Pace Inconsistency</h4>
            <p className="text-xs text-zinc-400">Fluctuations & velocity variations</p>
          </div>
        </div>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
          volatilityScore < 18 
            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" 
            : volatilityScore < 32 
            ? "bg-amber-500/10 text-amber-400 border-amber-500/30" 
            : "bg-rose-500/10 text-rose-400 border-rose-500/30"
        }`}>
          {status}
        </span>
      </div>

      {/* Line Chart of Segment WPM Velocity */}
      <div className="h-32 w-full my-3">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <XAxis dataKey="name" stroke="#71717a" tick={{ fill: '#a1a1aa', fontSize: 10 }} />
              <YAxis domain={[60, 200]} stroke="#71717a" tick={{ fill: '#71717a', fontSize: 10 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '8px', fontSize: '11px' }}
                itemStyle={{ color: '#06b6d4' }}
              />
              <ReferenceLine y={140} stroke="#10b981" strokeDasharray="3 3" label={{ value: '140 WPM Target', fill: '#10b981', fontSize: 10 }} />
              <Line
                type="monotone"
                dataKey="wpm"
                stroke="#06b6d4"
                strokeWidth={3}
                dot={{ r: 4, fill: '#06b6d4' }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs text-zinc-500">
            Record speech to plot pacing timeline
          </div>
        )}
      </div>

      <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
        <span className="truncate pr-2">{desc}</span>
        <span className="font-mono text-cyan-400 font-medium shrink-0">±{volatilityScore}% Volatility</span>
      </div>
    </div>
  );
}
