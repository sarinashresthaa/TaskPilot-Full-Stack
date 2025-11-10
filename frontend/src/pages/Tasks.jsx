import React, { useState } from "react";
import Button from "../components/Button";
import { MdAddCircleOutline } from "react-icons/md";
import { FaTable, FaListUl, FaBorderAll } from "react-icons/fa";
import AddTask from "../components/Modal/AddTask";
import AddAction from "../components/Modal/AddAction";
import TodoList from "../components/TodoList";
import KanbanBoard from "../components/KanbanBoard";
import { useMyTasks, useUpdateTaskStatus } from "../hooks/useTasks";
import { useAuth } from "../lib/auth/authQueries";
import TaskDetail from "../components/Modal/TaskDetails";
import { RiKanbanView } from "react-icons/ri";
import { useEffect } from "react";
const Tasks = () => {
  const [addTask, setAddTask] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [viewMode, setViewMode] = useState("board");

  const [isView, setIsView] = useState(false);
  const [editId, setEditId] = useState(0);

  const { data: authData } = useAuth();
  const { data: rawTasks, isLoading, error, refetch } = useMyTasks();
  const updateTaskStatus = useUpdateTaskStatus();

  const [project, setProject] = useState("ALL");

  const [tasks, setTasks] = useState([]);

  console.log(tasks)

  useEffect(() => {
    setTasks(
      project === "ALL"
        ? rawTasks
        : rawTasks?.filter((item) => item.project.title === project)
    );
  }, [rawTasks, project]);

  const userRole = authData?.user?.role;
  const canCreateTasks = userRole === "project_manager";

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await updateTaskStatus.mutateAsync({ taskId, status: newStatus });
      setEditingTaskId(null);
    } catch (error) {
      console.error("Failed to update task status:", error);
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

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-600";
      case "medium":
        return "bg-yellow-100 text-yellow-600";
      case "low":
        return "bg-blue-100 text-blue-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "todo":
        return "bg-blue-100 text-blue-600";
      case "in-progress":
        return "bg-yellow-100 text-yellow-600";
      case "done":
        return "bg-green-100 text-green-600";
      case "rejected":
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  if (isLoading) {
    return <div className="p-4 text-center">Loading tasks...</div>;
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-600">
        Error loading tasks: {error.message}
      </div>
    );
  }
  return (
    <div className="grid gap-4 p-4">
      {/* Header with controls */}
      <div className="flex justify-between items-center">
        {/* View Toggle */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setViewMode("board")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === "board"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}>
            <RiKanbanView />
            Board
          </button>
          <button
            onClick={() => setViewMode("table")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === "table"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}>
            <FaTable />
            Table View
          </button>
          <button
            onClick={() => setViewMode("todo")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === "todo"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}>
            <FaListUl />
            Todo List
          </button>
        </div>
        <div className="flex gap-3 items-center">
          <label className="font-semibold">Projects:</label>
          <select
            className="border border-gray-400 p-1 rounded-md w-sm"
            value={project}
            onChange={(e) => setProject(e.target.value)}>
            <option value={"ALL"}>All</option>
            {[...new Set(rawTasks?.map((item) => item.project.title))]?.map(
              (option) => (
                <option value={option} key={option}>
                  {option}
                </option>
              )
            )}
          </select>
        </div>

        {/* Add Task Button */}
        {canCreateTasks && (
          <div>
            <Button
              icon={<MdAddCircleOutline />}
              label="Add Task"
              onClick={() => setAddTask(true)}
            />
          </div>
        )}
      </div>

      {/* Task Views */}
      {viewMode === "todo" ? (
        <TodoList tasks={tasks} onTaskUpdate={refetch} />
      ) : viewMode === "board" ? (
        <>
          <KanbanBoard
            tasks={tasks}
            onStatusChange={(taskId, newStatus) =>
              handleStatusChange(taskId, newStatus)
            }
          />
        </>
      ) : (
        <div className="rounded-lg shadow-xl">
          <table className="w-full">
            <thead className="bg-indigo-200">
              <tr className="text-sm">
                <th className="p-2 text-left">S.N.</th>
                <th className="p-2 text-left">Task Name</th>
                <th className="p-2 text-left">Project</th>
                <th className="p-2 text-left">Assigned By</th>
                <th className="p-2 text-left">Deadline</th>
                <th className="p-2 text-left">Priority</th>
                <th className="p-2 text-left">Status</th>
                <th className="p-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {tasks && tasks.length > 0 ? (
                tasks.map((task, index) => (
                  <tr key={task._id} className="border-b cursor-pointer">
                    <td className="p-2">{index + 1}</td>
                    <td className="p-2">
                      <div>
                        <div className="font-medium">{task.title}</div>
                        {task.description && (
                          <div className="text-sm text-gray-500 mt-1">
                            {task.description.substring(0, 50)}
                            {task.description.length > 50 && "..."}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-2 text-[#631edb]">
                      {task.project?.title || "N/A"}
                    </td>
                    <td className="p-2">{task.assignedBy?.name || "N/A"}</td>
                    <td className="p-2">
                      <span
                        className={`text-sm ${
                          task.deadline &&
                          new Date(task.deadline) < new Date() &&
                          task.status !== "done"
                            ? "text-red-600 font-semibold"
                            : "text-gray-600"
                        }`}>
                        {formatDate(task.deadline)}
                      </span>
                    </td>
                    <td className="p-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(
                          task.priority
                        )}`}>
                        {task.priority}
                      </span>
                    </td>
                    <td className="p-2">
                      {editingTaskId === task._id ? (
                        <select
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
                            : task.status === "rejected"
                            ? "Cancelled"
                            : task.status}
                        </span>
                      )}
                    </td>
                    <td className="p-2">
                      <AddAction
                        task={task}
                        handleEdit={
                          canCreateTasks
                            ? () => {
                                setAddTask(true);
                                setEditId(task._id);
                              }
                            : undefined
                        }
                        viewDetail={() => {
                          setIsView(true);
                          setEditId(task._id);
                        }}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="p-8 text-center text-gray-500">
                    No tasks assigned to you yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      {isView && <TaskDetail setIsOpen={setIsView} taskId={editId} />}
      {addTask && <AddTask setAddTask={setAddTask} editId={editId} />}
    </div>
  );
};

export default Tasks;
