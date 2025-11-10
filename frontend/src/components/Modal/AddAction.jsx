import React, { useState } from "react";
import { LuEye } from "react-icons/lu";
import { FaEdit, FaUserPlus } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
import { RiExchangeBoxLine } from "react-icons/ri";
import { useAuth } from "../../lib/auth/authQueries";
import { useUsers } from "../../hooks/useUsers";
import { useAssignTask } from "../../hooks/useTasks";

const AddAction = ({
  task,
  handleEdit,
  viewDetail,
  handleAssign,
  handleStatusChange,
}) => {
  const [addActionOpen, setAddActionOpen] = useState(false);
  const [showAssignUsers, setShowAssignUsers] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const { data: usersData } = useUsers();
  const assignTask = useAssignTask();

  const handleAssignTask = async () => {
    if (selectedUsers.length === 0 || !task) return;

    setLoading(true);
    try {
      await assignTask.mutateAsync({
        taskId: task._id,
        userIds: selectedUsers,
      });
      setShowAssignUsers(false);
      setSelectedUsers([]);
      setAddActionOpen(false);
    } catch (error) {
      console.error("Failed to assign task:", error);
      setShowAssignUsers(false);
    } finally {
      setLoading(false);
    }
  };

  const handleUserSelection = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };
  return (
    <div className="relative">
      <div
        className="p-3 cursor-pointer font-bold text-2xl "
        onClick={() => setAddActionOpen(!addActionOpen)}
      >
        ⋮
      </div>
      {addActionOpen && (
        <div className="bg-white shadow-lg rounded-2xl max-w-xs p-4 absolute top-10 right-0 z-50 w-fit min-w-48">
          {viewDetail && (
            <div
              className="flex gap-3 items-center p-2 hover:bg-gray-100 rounded-md cursor-pointer"
              onClick={viewDetail}
            >
              <LuEye />
              View Details
            </div>
          )}
          {handleEdit && (
            <div
              className="flex gap-3 items-center p-2 hover:bg-gray-100 rounded-md cursor-pointer"
              onClick={handleEdit}
            >
              <FaEdit />
              Edit
            </div>
          )}
          {handleAssign && (
            <div
              className="flex gap-3 items-center p-2 hover:bg-gray-100 rounded-md cursor-pointer"
              onClick={() => setShowAssignUsers(true)}
            >
              <FaUserPlus />
              Assign
            </div>
          )}
          {handleStatusChange && (
            <div className="flex gap-3 items-center p-2 hover:bg-gray-100 rounded-md cursor-pointer whitespace-nowrap">
              <RiExchangeBoxLine />
              Change Status
            </div>
          )}
        </div>
      )}

      {/* Task Assignment Modal */}
      {showAssignUsers && (
        <div className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4  overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Assign Task to Users</h3>

            <div className="space-y-2 mb-4">
              {usersData?.users?.map((user) => (
                <label
                  key={user._id}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user._id)}
                    onChange={() => handleUserSelection(user._id)}
                    className="form-checkbox h-4 w-4 text-purple-600"
                  />
                  <span className="flex-1">
                    {user.name} ({user.username})
                    <span className="text-sm text-gray-500 ml-2">
                      {user.role?.replace("_", " ")}
                    </span>
                  </span>
                </label>
              ))}
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowAssignUsers(false);
                  setSelectedUsers([]);
                }}
                className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-100"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleAssignTask}
                disabled={selectedUsers.length === 0 || loading}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
              >
                {loading
                  ? "Assigning..."
                  : `Assign to ${selectedUsers.length} user(s)`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddAction;
