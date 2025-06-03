"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Target } from "lucide-react";

interface ProjectProgressProps {
  goal: number;
  progress: number;
}

export default function ProjectProgress({
  goal,
  progress,
}: ProjectProgressProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const progressPercentage = Math.min(progress, 100);
  const currentAmount = (goal * progressPercentage) / 100;

  return (
    <Card className="mb-8 bg-white dark:bg-[#121212] bg-opacity-50 dark:bg-opacity-100 backdrop-blur-sm border dark:border-black shadow rounded-xl">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-2">
          <span className="font-semibold tracking-tight flex items-center text-xl dark:text-white">
            Project Goal <Target className="ml-2 h-5 w-5 text-red-500" />
          </span>
          <span className="tracking-tight text-lg dark:text-white">
            {progressPercentage}%
          </span>
        </div>
        <div className="h-3 bg-red-100 dark:bg-[#1a1a1a] rounded-full mb-4 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-red-500 to-red-600 flex items-center rounded-full justify-end pr-2 shadow-sm"
            initial={{ width: 0 }}
            animate={{ width: isVisible ? `${progressPercentage}%` : 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </div>
        <div className="flex justify-between items-center text-sm">
          <div>
            <p className="text-gray-600 dark:text-gray-400">
              Raised:{" "}
              <span className="font-semibold text-green-600 dark:text-green-400">
                ${currentAmount.toLocaleString()}
              </span>
            </p>
          </div>
          <div>
            <p className="text-gray-600 dark:text-gray-400">
              Goal:{" "}
              <span className="font-semibold dark:text-white">
                ${goal.toLocaleString()}
              </span>
            </p>
          </div>
        </div>
        {progressPercentage >= 100 && (
          <div className="mt-3 p-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <p className="text-green-800 dark:text-green-300 text-sm font-medium text-center">
              🎉 Goal Achieved! Thank you for your support!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
