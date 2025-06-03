"use client";

import type React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  type TooltipProps,
} from "recharts";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import { BarChart2 } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface AnalyticsItem {
  pathname: string;
  visits: number;
  lastVisited: string;
}

interface VisitData {
  name: string;
  lastWeek: number;
  thisWeek: number;
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-[#121212] border border-gray-200 dark:border-gray-700 p-2 shadow rounded">
        <p className="text-sm font-semibold text-gray-900 dark:text-white">
          {label}
        </p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm text-gray-600 dark:text-gray-300">
            <span className="font-medium" style={{ color: entry.color }}>
              {entry.name === "lastWeek" ? "Last Week: " : "This Week: "}
            </span>
            {entry.value} visits
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const VisitsChart: React.FC = () => {
  const { data: session } = useSession();
  const { data: analytics, error } = useSWR<AnalyticsItem[]>(
    "/api/analytics",
    fetcher,
  );

  if (error)
    return (
      <div className="flex items-center justify-center h-100 bg-white dark:bg-[#121212] bg-opacity-50 dark:bg-opacity-100 backdrop-filter backdrop-blur-lg rounded-xl p-6 shadow border dark:border-gray-800">
        <span className="text-gray-900 dark:text-white">
          Failed to load analytics
        </span>
      </div>
    );
  if (!analytics)
    return (
      <div className="flex items-center justify-center h-100 bg-white dark:bg-[#121212] bg-opacity-50 dark:bg-opacity-100 backdrop-filter backdrop-blur-lg rounded-xl p-6 shadow border dark:border-gray-800">
        <span className="text-gray-900 dark:text-white">
          Loading your stats...
        </span>
      </div>
    );

  const formatData = (analytics: AnalyticsItem[]): VisitData[] => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const today = new Date().getDay();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    return days.map((day, index) => {
      const dayIndex = (index + 1) % 7; // Convert to 1-7 range
      const thisWeekVisits = analytics
        .filter((item) => {
          const itemDate = new Date(item.lastVisited);
          return itemDate.getDay() === dayIndex && itemDate > oneWeekAgo;
        })
        .reduce((sum, item) => sum + item.visits, 0);

      const lastWeekVisits = analytics
        .filter((item) => {
          const itemDate = new Date(item.lastVisited);
          return (
            itemDate.getDay() === dayIndex &&
            itemDate <= oneWeekAgo &&
            itemDate > new Date(oneWeekAgo.getTime() - 7 * 24 * 60 * 60 * 1000)
          );
        })
        .reduce((sum, item) => sum + item.visits, 0);

      return {
        name: day,
        lastWeek: lastWeekVisits,
        thisWeek: dayIndex <= today ? thisWeekVisits : 0,
      };
    });
  };

  const formattedData = formatData(analytics);

  const thisWeekTotal = formattedData.reduce(
    (sum, day) => sum + day.thisWeek,
    0,
  );
  const lastWeekTotal = formattedData.reduce(
    (sum, day) => sum + day.lastWeek,
    0,
  );

  const todayVisits = analytics
    .filter((item) => {
      const itemDate = new Date(item.lastVisited);
      const today = new Date();
      return (
        itemDate.getDate() === today.getDate() &&
        itemDate.getMonth() === today.getMonth() &&
        itemDate.getFullYear() === today.getFullYear()
      );
    })
    .reduce((sum, item) => sum + item.visits, 0);

  return (
    <div className="bg-white dark:bg-[#121212] bg-opacity-50 dark:bg-opacity-100 backdrop-filter backdrop-blur-lg rounded-xl p-6 shadow border dark:border-gray-800">
      <div className="flex items-center mb-4">
        <BarChart2 className="mr-2 text-red-500" size={24} />
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Statistics
        </h2>
      </div>
      <div className="flex justify-between mb-4">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-red-500 dark:bg-red-500 rounded-full mr-2"></div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              This Week
            </p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              {thisWeekTotal} visits
            </p>
          </div>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-red-200 rounded-full mr-2"></div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Last Week
            </p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              {lastWeekTotal} visits
            </p>
          </div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart
          data={formattedData}
          margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
        >
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: "currentColor" }}
          />
          <YAxis hide={true} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="lastWeek" fill="#FEE2E2" radius={[8, 8, 0, 0]} />
          <Bar dataKey="thisWeek" fill="#EF4444" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
      <div className="flex items-center mt-1">
        <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Total Visits Today:{" "}
          <span className="font-semibold text-gray-900 dark:text-white">
            {todayVisits} visits
          </span>
        </p>
      </div>
    </div>
  );
};
