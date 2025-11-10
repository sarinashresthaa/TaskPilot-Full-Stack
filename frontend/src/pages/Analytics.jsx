import React from "react";
import SimpleBarChart from "../components/Charts/Barchart";
import SimplePieChart from "../components/Charts/PieChart";
import { useMyTasks } from "../hooks/useTasks";

const Analytics = () => {
  const { data: tasks } = useMyTasks();

  const data = tasks?.reduce((acc, task) => {
    const projectName = task.project.title;
    const existing = acc.find((item) => item.name === projectName);

    if (existing) {
      existing.Tasks += 1;
    } else {
      acc.push({ name: projectName, Tasks: 1 });
    }

    return acc;
  }, []);

  return (
    <div className="grid gap-4 p-6">
      <div className="p-4 rounded-lg border-2 border-gray-300">
        <h2 className="text-xl font-semibold text-center mb-4">
          Users by Department
        </h2>

        <SimplePieChart />
      </div>
      <div className="p-4 rounded-lg border-2 border-gray-300">
        <h1 className="text-xl font-semibold text-center mb-4">Tasks by Project</h1>
        <SimpleBarChart data={data} />
      </div>
    </div>
  );
};

export default Analytics;
