
"use client";
import { APIGETResponseOverview } from "@/app/api/overview/route";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

export function OverviewSales({data}:{data: APIGETResponseOverview['dataToChart']}) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="code"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Bar dataKey="total" fill="#eeeeee" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}