import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceLine,
  Tooltip,
} from 'recharts';
import type { EQGains } from '../types';
import { EQ_BANDS } from '../types';

interface EQChartProps {
  gains: EQGains;
  vibeMode?: 'energetic' | 'peaceful';
}

function formatFreq(hz: number): string {
  if (hz >= 1000) return `${hz / 1000}k`;
  return `${hz}`;
}

export function EQChart({ gains, vibeMode = 'peaceful' }: EQChartProps) {
  const data = EQ_BANDS.map(band => ({
    freq: band,
    label: formatFreq(band),
    gain: gains[band],
  }));

  const strokeColor = vibeMode === 'energetic' ? '#f97316' : '#d4832a';
  const fillColor = vibeMode === 'energetic' ? '#f9731620' : '#d4832a20';
  const gradientId = `eqGradient_${vibeMode}`;

  return (
    <div className="w-full h-48">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={strokeColor} stopOpacity={0.4} />
              <stop offset="95%" stopColor={strokeColor} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
          <XAxis
            dataKey="label"
            tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 9 }}
            axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
            tickLine={false}
          />
          <YAxis
            domain={[-6, 6]}
            ticks={[-6, -4, -2, 0, 2, 4, 6]}
            tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 9 }}
            axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
            tickLine={false}
            tickFormatter={v => `${v > 0 ? '+' : ''}${v}`}
          />
          <Tooltip
            contentStyle={{
              background: 'rgba(15,14,23,0.95)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              fontSize: '11px',
              color: 'white',
            }}
            formatter={(value: number) => [`${value > 0 ? '+' : ''}${value} dB`, 'Gain']}
            labelFormatter={(label) => `${label} Hz`}
          />
          <ReferenceLine y={0} stroke="rgba(255,255,255,0.2)" strokeDasharray="2 2" />
          <Area
            type="monotone"
            dataKey="gain"
            stroke={strokeColor}
            strokeWidth={2}
            fill={`url(#${gradientId})`}
            dot={{ fill: strokeColor, r: 2, strokeWidth: 0 }}
            activeDot={{ r: 4, fill: strokeColor, stroke: 'white', strokeWidth: 1 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
