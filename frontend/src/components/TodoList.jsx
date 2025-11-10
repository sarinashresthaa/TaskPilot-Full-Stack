import React, { useState } from "react";
import { useUpdateTaskStatus } from "../hooks/useTasks";
import TaskDetail from "./Modal/TaskDetails";

const TodoList = ({ tasks }) => {
  const [filter, setFilter] = useState("all");
  const updateTaskStatus = useUpdateTaskStatus();

  const [isView, setIsView] = useState(false);
  const [editId, setEditId] = useState(0);

  const [editingTaskId, setEditingTaskId] = useState(null);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await updateTaskStatus.mutateAsync({ taskId, status: newStatus });
      setEditingTaskId(null);
    } catch (error) {
      console.error("Failed to update task status:", error);
    }
  };

  const isCompleted = (task) => {
    return task.allocationStatus === "completed" || task.status === "completed";
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "border-l-red-500";
      case "medium":
        return "border-l-yellow-500";
      case "low":
        return "border-l-blue-500";
      case "urgent":
        return "border-l-purple-500";
      default:
        return "border-l-gray-500";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No deadline";
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`;
    if (diffDays === 0) return "Due today";
    if (diffDays === 1) return "Due tomorrow";
    return `${diffDays} days left`;
  };

  const filteredTasks =
    tasks?.filter((task) => {
      if (filter === "completed") return isCompleted(task);
      if (filter === "active") return !isCompleted(task);
      return true; // 'all'
    }) || [];

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "todo":
        return "bg-blue-100 text-blue-600";
      case "in-progress":
        return "bg-yellow-100 text-yellow-600";
      case "done":
        return "bg-green-100 text-green-600";
      case "cancelled":
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const completedCount = tasks?.filter(isCompleted).length || 0;
  const totalCount = tasks?.length || 0;
  const progressPercentage =
    totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Header with Progress */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">My Tasks</h2>
          <div className="text-sm text-gray-600">
            {completedCount} of {totalCount} completed
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div
            className="bg-green-500 h-2 rounded-full transition-all duration-300 ease-in-out"
            style={{ width: `${progressPercentage}%` }}></div>
        </div>

        {/* Filter Buttons */}
        <div className="flex space-x-2">
          {["all", "active", "completed"].map((filterType) => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === filterType
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}>
              {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
              {filterType === "completed" && ` (${completedCount})`}
              {filterType === "active" && ` (${totalCount - completedCount})`}
            </button>
          ))}
        </div>
      </div>

      {/* Todo Items */}
      <div className="space-y-3">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <div
              key={task._id}
              className={`group flex items-start p-4 border-l-4 bg-gray-50 rounded-r-lg transition-all duration-300 hover:shadow-md hover:transform hover:-translate-y-1 ${getPriorityColor(
                task.priority
              )} ${
                isCompleted(task)
                  ? "opacity-60 bg-gray-100 transform scale-95"
                  : "hover:bg-white"
              }`}
              onClick={() => {
                setIsView(true);
                setEditId(task._id);
              }}>
              {/* Task Content */}
              <div className="flex-grow min-w-0">
                <div className="flex justify-between items-start mb-2">
                  <h3
                    className={`text-lg font-medium text-gray-900 transition-all duration-200 ${
                      isCompleted(task) ? "line-through text-gray-500" : ""
                    }`}>
                    {task.title}
                  </h3>

                  {/* Priority Badge */}
                  <div className="flex gap-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ml-2 flex-shrink-0 ${
                        task.priority === "urgent"
                          ? "bg-purple-100 text-purple-800"
                          : task.priority === "high"
                          ? "bg-red-100 text-red-800"
                          : task.priority === "medium"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-blue-100 text-blue-800"
                      }`}>
                      {task.priority}
                    </span>

                    {editingTaskId === task._id ? (
                      <select
                        onClick={(e) => e.stopPropagation()}
                        value={task.status}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleStatusChange(task._id, e.target.value);
                        }}
                        className="px-2 py-1 rounded border text-xs"
                        autoFocus>
                        <option value="todo">Todo</option>
                        <option value="in-progress">In Progress</option>
                        <option value="done">Done</option>
                       
                      </select>
                    ) : (
                      <span
                        className={`px-2 py-1 rounded-full text-xs cursor-pointer ${getStatusColor(
                          task.status
                        )}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingTaskId(task._id);
                        }}>
                        {task.status === "todo"
                          ? "Todo"
                          : task.status === "in-progress"
                          ? "In Progress"
                          : task.status === "done"
                          ? "Completed"
                          : task.status === "cancelled"
                          ? "Rejected"
                          : task.status}
                      </span>
                    )}
                  </div>
                </div>

                {/* Description */}
                {task.description && (
                  <p
                    className={`text-sm text-gray-600 mb-2 ${
                      isCompleted(task) ? "line-through" : ""
                    }`}>
                    {task.description.length > 100
                      ? `${task.description.substring(0, 100)}...`
                      : task.description}
                  </p>
                )}

                {/* Task Details */}
                <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                  <span className="flex items-center">
                    <span className="font-medium">Project:</span>
                    <span className="ml-1">{task.project?.title || "N/A"}</span>
                  </span>

                  <span className="flex items-center">
                    <span className="font-medium">Assigned by:</span>
                    <span className="ml-1">
                      {task.assignedBy?.name || "N/A"}
                    </span>
                  </span>

                  <span
                    className={`flex items-center ${
                      task.deadline &&
                      new Date(task.deadline) < new Date() &&
                      !isCompleted(task)
                        ? "text-red-600 font-semibold"
                        : ""
                    }`}>
                    <span className="font-medium">Deadline:</span>
                    <span className="ml-1">{formatDate(task.deadline)}</span>
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            {filter === "completed"
              ? "No completed tasks yet."
              : filter === "active"
              ? "No active tasks."
              : "No tasks assigned to you yet."}
          </div>
        )}
      </div>

      {/* Summary Footer */}
      {totalCount > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200 text-center">
          <div className="text-sm text-gray-600">
            {progressPercentage === 100 ? (
              <span className="text-green-600 font-semibold">
                🎉 All tasks completed! Great job!
              </span>
            ) : (
              <span>
                Keep going! You're {Math.round(progressPercentage)}% done.
              </span>
            )}
          </div>
        </div>
      )}
      {isView && <TaskDetail setIsOpen={setIsView} taskId={editId} />}
    </div>
  );
};

export default TodoList;
