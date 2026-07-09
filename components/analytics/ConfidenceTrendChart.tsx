'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { ConfidenceTrendPoint } from '@/types/analytics.types';

export interface ConfidenceTrendChartProps {
  data: ConfidenceTrendPoint[];
  height?: number;
}

export function ConfidenceTrendChart({ data, height = 300 }: ConfidenceTrendChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex h-72 items-center justify-center rounded-md border border-dashed border-gray-700 text-sm text-gray-500">
        No trend data yet.
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#9ca3af' }} />
          <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
          <Tooltip
            contentStyle={{ background: '#111827', border: '1px solid #374151', borderRadius: 6 }}
            labelStyle={{ color: '#f9fafb' }}
          />
          <Legend wrapperStyle={{ fontSize: 12, color: '#9ca3af' }} />
          <Bar dataKey="low" stackId="a" fill="#ef4444" name="Low" radius={[0, 0, 0, 0]} />
          <Bar dataKey="medium" stackId="a" fill="#eab308" name="Medium" radius={[0, 0, 0, 0]} />
          <Bar dataKey="high" stackId="a" fill="#22c55e" name="High" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
