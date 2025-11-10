import React, { useEffect, useState } from "react";
import { useCreateUser, useUpdateUser, useUser } from "../../hooks/useUsers";

const AddTeamMember = (props) => {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "password123", 
    phone: "",
    department: "",
    role: "team_member",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const createUser = useCreateUser();
  const updateUser = useUpdateUser();

  const { data: userDetail } = useUser(props.editId);

  useEffect(() => {
    if (userDetail) {
      setFormData({
        name: userDetail?.name,
        username: userDetail?.username,
        email: userDetail?.email,
        password: "password123",
        phone: userDetail?.phone,
        department: userDetail.department,
        role: userDetail.role,
      });
    }
  }, [userDetail]);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!formData.name || !formData.username || !formData.email) {
        throw new Error("Please fill in all required fields");
      }

      // Generate username from name if not provided
      if (!formData.username) {
        formData.username = formData.name.toLowerCase().replace(/\s+/g, "");
      }
      if (!props.editId) {
        await createUser.mutateAsync(formData);
      } else {
        await updateUser.mutateAsync({
          userId: props.editId,
          userData: formData,
        });
      }
      props.setIsModalOpen(false);
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Failed to create user"
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/30 z-50">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-3xl p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {props.editId ? "Update" : "Add"} Team Member
          </h2>
          <button
            onClick={() => props.setIsModalOpen(false)}
            className="text-red-500 font-bold text-xl hover:text-red-600  cursor-pointer"
          >
            ✕
          </button>
        </div>
        <hr className="my-4 border-gray-300" />

        {/* Form */}
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          {error && (
            <div className="col-span-2 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-purple-500 border-gray-300"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Username <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-purple-500 border-gray-300"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full border rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500 border-gray-300 p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Phone Number
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-purple-500 border-gray-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Department <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleInputChange}
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-purple-500 border-gray-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Role <span className="text-red-500">*</span>
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-purple-500 border-gray-300"
              required
            >
              <option value="team_member">Team Member</option>
              <option value="project_manager">Project Manager</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="col-span-2 flex justify-end gap-3 mt-4 font-semibold">
            <button
              type="button"
              onClick={() => props.setIsModalOpen(false)}
              className="px-4 py-2 rounded-md border text-[#7D3BEC] hover:bg-gray-200 cursor-pointer"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-[#7D3BEC] text-white hover:bg-purple-700 cursor-pointer disabled:opacity-50"
              disabled={loading}
            >
              {loading
                ? props.editId
                  ? "Updating...."
                  : "Creating..."
                : props.editId
                ? "Update User"
                : "Create User"}{" "}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTeamMember;
