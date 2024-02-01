"use client";
import React, { FC, PureComponent } from "react";
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from "recharts";

const COLORS = ["#00FF66", "#0088FE", "#00C49F", "#9933FF", "#FFD700", "#FFBB28", "#FF8042"];
const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
}: {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
  index: number;
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="black" textAnchor={x > cx ? "start" : "end"} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const GradesPieChart: FC<{ data: { name: string; value: number }[] }> = ({ data }) => {
  return (
    <div className="space-y-10">
      <div className="flex items-center justify-center gap-x-10">
        {data.map((grade, index) => {
          return (
            <div key={grade.name} className="flex items-center gap-x-5">
              <p>{grade.name}</p>
              <div className="w-10 h-5 p-1 border" style={{ background: COLORS[index] }}></div>
            </div>
          );
        })}
      </div>
      <ResponsiveContainer width="100%" height="100%" aspect={9}>
        <PieChart width={400} height={400}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            label={renderCustomizedLabel}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GradesPieChart;
