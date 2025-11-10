import React, { useEffect, useState } from "react";
import {
  useCreateProject,
  useProject,
  useUpdateProject,
} from "../../hooks/useProjects";

const AddProject = (props) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "development",
    startDate: "",
    endDate: "",
    teamMembers: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const createProject = useCreateProject();
  const updateProject = useUpdateProject();

  const { data: projectDetail } = useProject(props.editId);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (projectDetail) {
      setFormData({
        title: projectDetail.title,
        description: projectDetail?.description,
        category: projectDetail?.category,
        startDate: projectDetail?.startDate?.split("T")?.[0],
        endDate: projectDetail?.endDate?.split("T")?.[0],
        teamMembers: [],
      });
    }
  }, [projectDetail]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!formData.title || !formData.description) {
        throw new Error("Please fill in all required fields");
      }
      if (props.editId) {
        await updateProject.mutateAsync({
          id: props.editId,
          projectData: formData,
        });
      } else {
        await createProject.mutateAsync(formData);
      }
      props.setIsOpen(false);
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Failed to create project"
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/30 z-50">
      {/* Modal Box */}
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6 relative">
        {/* Modal Title */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold ">
            {props.editId ? "Update" : "Add"} Project{" "}
          </h2>
          {/* Close button */}
          <button
            onClick={() => props.setIsOpen(false)}
            className="text-red-500 font-bold text-xl hover:text-red-600  cursor-pointer"
          >
            ✕
          </button>
        </div>
        <hr className="my-4 border-gray-300" />

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium">
              Project Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500 border-gray-300"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="3"
              className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500 border-gray-300 resize-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500 border-gray-300"
            >
              <option value="development">Development</option>
              <option value="design">Design</option>
              <option value="marketing">Marketing</option>
              <option value="research">Research</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">
                Start Date<span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500 border-gray-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">
                End Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500 border-gray-300"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4 font-semibold">
            <button
              type="button"
              onClick={() => props.setIsOpen(false)}
              className="px-4 py-2 rounded-lg border text-[#7D3BEC] hover:bg-gray-200 cursor-pointer"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-[#7D3BEC] text-white hover:bg-purple-700 cursor-pointer disabled:opacity-50"
              disabled={loading}
            >
              {loading
                ? props.editId
                  ? "Updating...."
                  : "Creating..."
                : props.editId
                ? "Update Project"
                : "Create Project"}{" "}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProject;
