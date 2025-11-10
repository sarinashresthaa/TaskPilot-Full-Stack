import React, { useState } from "react";
import { useCreateTask, useTask, useUpdateTask } from "../../hooks/useTasks";
import { useProjects, useUpdateProject } from "../../hooks/useProjects";
import { useUsers } from "../../hooks/useUsers";
import { useEffect } from "react";

const AddTask = (props) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    projectId: "",
    priority: "medium",
    category: "development",
    subCategory: "other",
    deadline: "",
    estimatedEffort: 0,
    assignedTo: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { data: projects } = useProjects();
  const { data: usersData } = useUsers();
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();

  const { data: taskDetail } = useTask(props.editId);

  console.log(taskDetail);

  useEffect(() => {
    if (taskDetail) {
      setFormData({
        title: taskDetail.title,
        description: taskDetail?.description,
        assignedTo: taskDetail?.assignedTo?.map((item) => item._id),
        projectId: taskDetail?.project?._id,
        category:taskDetail?.category,
        deadline:taskDetail?.deadline?.split('T')?.[0],
        estimatedEffort:taskDetail?.estimatedEffort
      });
    }
  }, [taskDetail]);

  console.log(formData);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUserSelection = (userId) => {
    setFormData((prev) => ({
      ...prev,
      assignedTo: prev.assignedTo.includes(userId)
        ? prev.assignedTo.filter((id) => id !== userId)
        : [...prev.assignedTo, userId],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!formData.title || !formData.description || !formData.projectId) {
        throw new Error("Please fill in all required fields");
      }
      if (props.editId) {
        await updateTask.mutateAsync({
          id: props.editId,
          taskData: formData,
        });
      } else {
        await createTask.mutateAsync(formData);
      }
      props.setAddTask(false);
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Failed to create task"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/30 z-50">
      {/* Modal Box */}
      <div className="bg-white max-h-[600px] overflow-auto shadow-lg rounded-2xl w-full max-w-md p-6 relative">
        {/* header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Add Task</h2>
          <button
            onClick={() => props.setAddTask(false)}
            className="text-red-500 font-bold text-xl hover:text-red-600 cursor-pointer">
            ✕
          </button>
        </div>
        <hr className="my-4 border-gray-300" />

        {/* Form */}
        <form onSubmit={handleSubmit} className="grid gap-4">
          {error && (
            <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium">
              Task Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-purple-500 border-gray-300 mt-1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Project <span className="text-red-500">*</span>
            </label>
            <select
              name="projectId"
              value={formData.projectId}
              onChange={handleInputChange}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-purple-500 border-gray-300"
              required>
              <option value="">Select a project</option>
              {projects?.map((project) => (
                <option key={project._id} value={project._id}>
                  {project.title}
                </option>
              ))}
            </select>
          </div>

          {/* Assign To Users */}
          <div>
            <label className="block text-sm font-medium mb-2">Assign To <span className="text-red-500">*</span></label>
            <div className="border rounded-lg p-3 max-h-32 overflow-y-auto">
              {usersData?.users?.length > 0 ? (
                <div className="space-y-2">
                  {usersData.users.filter((item)=> item.role!=="admin").map((user) => (
                    <label
                      key={user._id}
                      className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                      <input
                        type="checkbox"
                        checked={formData.assignedTo.includes(user._id)}
                        onChange={() => handleUserSelection(user._id)}
                        className="form-checkbox h-4 w-4 text-purple-600 rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-medium text-gray-900">
                          {user.name}
                        </span>
                        <span className="text-xs text-gray-500 ml-2">
                          ({user.username})
                        </span>
                        <div className="text-xs text-gray-400">
                          {user.role?.replace("_", " ")}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No users available</p>
              )}
            </div>
            {formData.assignedTo.length > 0 && (
              <p className="text-xs text-gray-600 mt-1">
                {formData.assignedTo.length} user(s) selected
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              rows="3"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-purple-500 border-gray-300 resize-none"
              required
            />
          </div>

          {/* Category & Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-purple-500 border-gray-300">
                <option value="development">Development</option>
                <option value="design">Design</option>
                <option value="testing">Testing</option>
                <option value="documentation">Documentation</option>
                <option value="meeting">Meeting</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Priority</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-purple-500 border-gray-300">
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          {/* Deadline & Estimated Effort */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Deadline <span className="text-red-500">*</span></label>
              <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleInputChange}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-purple-500 border-gray-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Estimated Hours
              </label>
              <input
                type="number"
                name="estimatedEffort"
                value={formData.estimatedEffort}
                onChange={handleInputChange}
                min="0"
                step="0.5"
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-purple-500 border-gray-300"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4 font-semibold">
            <button
              type="button"
              onClick={() => props.setAddTask(false)}
              className="px-4 py-2 border text-[#7D3BEC] rounded-lg hover:bg-gray-200 cursor-pointer"
              disabled={loading}>
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-[#7D3BEC] rounded-lg text-white hover:bg-purple-700 cursor-pointer disabled:opacity-50"
              disabled={loading}>
              {loading
                ? props.editId
                  ? "Updating...."
                  : "Creating..."
                : props.editId
                ? "Update Task"
                : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTask;
