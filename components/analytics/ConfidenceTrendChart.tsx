'use client';

// TODO: backend currently returns ConfidenceTrendPoint as
//   { bucket, averageConfidence, sampleSize }
// which is a single averaged confidence per time bucket. The product spec
// wants a three-series stacked area chart (low/medium/high counts per day),
// which requires the backend to return per-bucket counts instead.
// To keep the visual honest, we render a single-series area of
// `averageConfidence` until the endpoint shape changes. See BACKEND_TODO.md
// ("ConfidenceTrendPoint shape mismatch").

import {
    Area,
    AreaChart,
    CartesianGrid,
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
            <div className="flex h-72 items-center justify-center rounded-md border border-dashed border-gray-300 text-sm text-gray-500">
                No trend data yet.
            </div>
        );
    }

    // recharts needs a numeric value on the X axis; bucket is a string label
    // (e.g. "2026-06-15") so we pass it as the category axis directly.
    return (
        <div style={{ width: '100%', height }}>
            <ResponsiveContainer>
                <AreaChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
                    <defs>
                        <linearGradient id="confidenceFill" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.4} />
                            <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="bucket" tick={{ fontSize: 12, fill: '#6b7280' }} />
                    <YAxis
                        domain={[0, 1]}
                        tickFormatter={(v: number) => v.toFixed(1)}
                        tick={{ fontSize: 12, fill: '#6b7280' }}
                    />
                    <Tooltip
                        formatter={(value: number) => [
                            Number(value).toFixed(2),
                            'Avg confidence',
                        ]}
                        labelStyle={{ color: '#111827' }}
                    />
                    <Area
                        type="monotone"
                        dataKey="averageConfidence"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        fill="url(#confidenceFill)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
