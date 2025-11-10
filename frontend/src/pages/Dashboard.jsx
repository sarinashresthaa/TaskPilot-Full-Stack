import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../lib/auth/authQueries";
import { useMyTasks } from "../hooks/useTasks";
import { useProjects } from "../hooks/useProjects";
import {
  FaTasks,
  FaProjectDiagram,
  FaUsers,
  FaChartBar,
  FaCalendarAlt,
  FaClock,
  FaCheckCircle,
  FaExclamationTriangle,
  FaRocket,
  FaStar,
  FaTrophy
} from "react-icons/fa";
import { getOptimizedTask } from "../algorithm/algorithm";

const Dashboard = () => {
  const { data: authData } = useAuth();
  const { data: tasks } = useMyTasks();
  const { data: projects } = useProjects();
  const [currentTime, setCurrentTime] = useState(new Date());

  const userRole = authData?.user?.role;
  const userName = authData?.user?.name || "User";

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Calculate statistics
  const completedTasks = tasks?.filter(task =>
    task.allocationStatus === 'done' || task.status === 'done'
  ).length || 0;

  const pendingTasks = tasks?.filter(task =>
    task.allocationStatus === 'in-progress' || task.status === 'in-progress'
  ).length || 0;

  const overdueTasks = tasks?.filter(task =>
    new Date(task.deadline) < new Date() &&
    task.allocationStatus !== 'done'
  ).length || 0;

  const activeProjects = projects?.filter(project =>
    project.status === 'active'
  ).length || 0;

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const QuickStatsCard = ({ icon, title, value, color, bgColor, link }) => (
    <Link to={link} className="block">
      <div className={`${bgColor} p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105 border-l-4 ${color}`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-gray-600 text-sm font-medium">{title}</h3>
            <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
          </div>
          <div className={`text-4xl ${color.replace('border-l-', 'text-')}`}>
            {icon}
          </div>
        </div>
      </div>
    </Link>
  );

  const ActionCard = ({ icon, title, description, link, color }) => (
    <Link to={link} className="block">
      <div className={`bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105 border-l-4 ${color}`}>
        <div className="flex items-start space-x-4">
          <div className={`text-2xl ${color.replace('border-l-', 'text-')}`}>
            {icon}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
            <p className="text-gray-600 text-sm mt-1">{description}</p>
          </div>
        </div>
      </div>
    </Link>
  );
const optimizedTasks = getOptimizedTask(tasks) ?? []
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border-l-4 border-l-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                {getGreeting()}, {userName}! 👋
              </h1>
              <p className="text-gray-600 text-lg">
                Welcome to your TaskPilot Dashboard
              </p>
              <div className="flex items-center mt-4 text-sm text-gray-500">
                <FaClock className="mr-2" />
                {currentTime.toLocaleString()}
              </div>
            </div>
            <div className="text-6xl">
              <FaRocket className="text-purple-500 animate-bounce" />
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <QuickStatsCard
            icon={<FaTasks />}
            title="Total Tasks"
            value={tasks?.length || 0}
            color="border-l-blue-500"
            bgColor="bg-blue-50"
            link="/tasks"
          />
          <QuickStatsCard
            icon={<FaCheckCircle />}
            title="Completed"
            value={completedTasks}
            color="border-l-green-500"
            bgColor="bg-green-50"
            link="/tasks"
          />
          <QuickStatsCard
            icon={<FaClock />}
            title="Pending"
            value={pendingTasks}
            color="border-l-yellow-500"
            bgColor="bg-yellow-50"
            link="/tasks"
          />
          <QuickStatsCard
            icon={<FaExclamationTriangle />}
            title="Overdue"
            value={overdueTasks}
            color="border-l-red-500"
            bgColor="bg-red-50"
            link="/tasks"
          />
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <FaStar className="mr-3 text-yellow-500" />
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ActionCard
              icon={<FaTasks />}
              title="My Tasks"
              description="View and manage your assigned tasks"
              link="/tasks"
              color="border-l-blue-500"
            />
            <ActionCard
              icon={<FaProjectDiagram />}
              title="Projects"
              description="Browse active projects and collaborations"
              link="/projects"
              color="border-l-purple-500"
            />
            {(userRole === 'project_manager' || userRole === 'admin') && (
              <ActionCard
                icon={<FaUsers />}
                title="Team Management"
                description="Manage team members and assignments"
                link="/team"
                color="border-l-green-500"
              />
            )}
            {userRole === 'admin' && (
              <ActionCard
                icon={<FaChartBar />}
                title="Analytics"
                description="View system statistics and reports"
                link="/analytics"
                color="border-l-orange-500"
              />
            )}
          </div>
        </div>
<div className="p-4 bg-white shadow rounded-lg">
          <h2 className="text-xl font-semibold mb-3 text-gray-700">
            Optimized Task Order (Shortest Job Next)
          </h2>

          {optimizedTasks.length === 0 ? (
            <p className="text-gray-500">No pending tasks</p>
          ) : (
            <ul className="space-y-3">
              {optimizedTasks.map((task, index) => (
                <li
                  key={task._id}
                  className="border p-3 rounded-lg flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition">
                  <div>
                    <p className="font-medium text-gray-800">
                      {index + 1}. {task.title}
                    </p>
                    <p className="text-sm text-gray-600">
                      Project: {task.project.title}
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`px-2 py-1 text-xs rounded-md font-semibold ${
                        task.priority === "high"
                          ? "bg-red-100 text-red-600"
                          : task.priority === "medium"
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-green-100 text-green-600"
                      }`}>
                      {task.priority.toUpperCase()}
                    </span>
                    <div className="flex gap-4">

                    <p className="text-sm text-gray-600 mt-1">
                      Effort: {task.estimatedEffort} hrs
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Deadline: {new Date(task.deadline)?.toISOString().split('T')?.[0]}
                    </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        {/* Recent Activity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
          {/* Recent Tasks */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FaTasks className="mr-3 text-blue-500" />
              Recent Tasks
            </h3>
            <div className="space-y-3">
              {tasks?.slice(0, 5).map((task) => (
                <div key={task._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      task.allocationStatus === 'completed' ? 'bg-green-500' :
                      task.allocationStatus === 'in-progress' ? 'bg-yellow-500' :
                      'bg-blue-500'
                    }`}></div>
                    <div>
                      <p className="font-medium text-gray-800 text-sm">{task.title}</p>
                      <p className="text-xs text-gray-500">{task.project?.title}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    task.priority === 'urgent' ? 'bg-purple-100 text-purple-800' :
                    task.priority === 'high' ? 'bg-red-100 text-red-800' :
                    task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {task.priority}
                  </span>
                </div>
              )) || (
                <p className="text-gray-500 text-center py-8">No tasks assigned yet</p>
              )}
            </div>
          </div>

          {/* Project Overview */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FaProjectDiagram className="mr-3 text-purple-500" />
              Active Projects({activeProjects})
            </h3>
            <div className="space-y-3">
              {projects?.slice(0, 5).map((project) => (
                <div key={project._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                    <div>
                      <p className="font-medium text-gray-800 text-sm">{project.title}</p>
                      <p className="text-xs text-gray-500">
                        {project.teamMembers?.length || 0} members
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-800">{project.progress}%</p>
                    <div className="w-16 bg-gray-200 rounded-full h-2 mt-1">
                      <div
                        className="bg-purple-500 h-2 rounded-full"
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              )) || (
                <p className="text-gray-500 text-center py-8">No projects available</p>
              )}
            </div>
          </div>
        </div>

        {/* Motivational Footer */}
        <div className="mt-8 bg-gradient-to-r from-purple-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold mb-2">Keep Up the Great Work! 🌟</h3>
              <p className="text-purple-100">
                You're doing amazing! {completedTasks > 0 && `You've completed ${completedTasks} task${completedTasks !== 1 ? 's' : ''} so far.`}
              </p>
            </div>
            <FaTrophy className="text-5xl text-yellow-300" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
