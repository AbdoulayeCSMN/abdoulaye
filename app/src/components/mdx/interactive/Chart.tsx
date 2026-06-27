'use client';

import React from 'react';

interface DataPoint {
  label: string;
  value: number;
  color?: string;
}

interface ChartProps {
  type?: 'bar' | 'line' | 'pie';
  title?: string;
  data: DataPoint[];
  color?: string;
  height?: number;
}

export function Chart({ type = 'bar', title, data, color = '#6366f1', height = 220 }: ChartProps) {
  const [recharts, setRecharts] = React.useState<any>(null);

  React.useEffect(() => {
    import('recharts').then((mod) => setRecharts(mod));
  }, []);

  if (!recharts) {
    return (
      <div
        style={{ height }}
        className="my-6 flex items-center justify-center rounded-xl border bg-muted/30 animate-pulse"
      >
        <span className="text-sm text-muted-foreground">Chargement du graphique…</span>
      </div>
    );
  }

  const {
    BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  } = recharts;

  const COLORS = [color, '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="my-6 p-4 rounded-xl border bg-card shadow-sm">
      {title && <p className="text-sm font-semibold text-center mb-4 text-muted-foreground">{title}</p>}
      <ResponsiveContainer width="100%" height={height}>
        {type === 'pie' ? (
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="label" cx="50%" cy="50%" outerRadius={80} label>
              {data.map((_: any, i: number) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        ) : type === 'line' ? (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.1} />
            <XAxis dataKey="label" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={{ r: 4 }} />
          </LineChart>
        ) : (
          <BarChart data={data} barSize={36}>
            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.1} />
            <XAxis dataKey="label" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {data && data.map((_: any, i: number) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}