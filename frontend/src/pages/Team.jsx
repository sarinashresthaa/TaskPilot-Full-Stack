import React, { useEffect, useState } from "react";
import Button from "../components/Button";
import { MdAddCircleOutline } from "react-icons/md";
import AddTeamMember from "../components/Modal/AddTeamMember";
import { useUsers } from "../hooks/useUsers";
import { useAuth } from "../lib/auth/authQueries";

const Team = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [editId, setEditId] = useState(0);

  const { data: authData } = useAuth();
  const {
    data: usersData,
    isLoading,
    error,
  } = useUsers({ search: debouncedSearch, role: roleFilter });

  const userRole = authData?.user?.role;
  const canAddMembers = userRole === "admin";
  const isAdmin = userRole === "admin";

  const getRoleColor = (role) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-700";
      case "project_manager":
        return "bg-blue-100 text-blue-700";
      case "team_member":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  if (isLoading) {
    return <div className="p-4 text-center">Loading team members...</div>;
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-600">Error: {error.message}</div>
    );
  }

  const users = usersData?.users || [];

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Team Members</h1>
        {canAddMembers && (
          <Button
            icon={<MdAddCircleOutline />}
            label="Add Team Member"
            onClick={() => setIsModalOpen(true)}
          />
        )}
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name, email, or username..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
          className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500"
        />
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500"
        >
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="project_manager">Project Manager</option>
          <option value="team_member">Team Member</option>
        </select>
      </div>

      {/* Team Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.length > 0 ? (
          users.map((user) => (
            <div
              key={user._id}
              className="bg-white rounded-lg shadow-md p-6 border"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-[#BA75FF] to-[#943BEC] rounded-full flex items-center justify-center text-white font-semibold">
                  {user.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{user.name}</h3>
                  <p className="text-sm text-gray-600">@{user.username}</p>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Email:</span>
                  <span className="text-sm text-gray-800">{user.email}</span>
                </div>
                {user.phone && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Phone:</span>
                    <span className="text-sm text-gray-800">{user.phone}</span>
                  </div>
                )}
                {user.department && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Department:</span>
                    <span className="text-sm text-gray-800">
                      {user.department}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Role:</span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs capitalize ${getRoleColor(
                      user.role
                    )}`}
                  >
                    {user.role?.replace("_", " ")}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Status:</span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      user.isActive
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {user.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Joined:</span>
                  <span className="text-sm text-gray-800">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {isAdmin && (
                <div className="mt-4 pt-4 border-t">
                  <button
                    className="w-full px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                    onClick={() => {
                      setIsModalOpen(true);
                      setEditId(user._id);
                      console.log(user);
                    }}
                  >
                    Manage User
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-gray-500">
            <p className="text-lg">No team members found</p>
            {canAddMembers && (
              <p className="text-sm mt-2">
                Click "Add Team Member" to invite new members
              </p>
            )}
          </div>
        )}
      </div>

      {/* Pagination */}
      {usersData?.totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <div className="flex space-x-2">
            {Array.from({ length: usersData.totalPages }, (_, i) => i + 1).map(
              (page) => (
                <button
                  key={page}
                  className={`px-3 py-1 rounded ${
                    page === usersData.currentPage
                      ? "bg-[#7D3BEC] text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {page}
                </button>
              )
            )}
          </div>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <AddTeamMember
          setIsModalOpen={(e) => {
            setIsModalOpen(e);
            setEditId(0);
          }}
          editId={editId}
        />
      )}
    </div>
  );
};

export default Team;
