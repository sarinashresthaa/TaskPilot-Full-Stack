import React from "react";
import { useAddTaskComment, useTask } from "../../hooks/useTasks";
import { useState } from "react";
import { LuSend } from "react-icons/lu";

const TaskDetail = (props) => {
  const { data: taskDetail } = useTask(props.taskId);

  const comment = useAddTaskComment();

  const [commentText, setCommentText] = useState("");

  if (!taskDetail) {
    return (
      <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/30 z-50">
        <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6 relative">
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "todo":
        return "bg-gray-100 text-gray-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "done":
      case "completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/30 z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
          <div className="flex justify-between items-start">
            <div className="flex-1 pr-4">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                {taskDetail.title}
              </h2>
              <div className="flex gap-2 flex-wrap">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    taskDetail.status
                  )}`}>
                  {taskDetail.status.toUpperCase()}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                    taskDetail.priority
                  )}`}>
                  PRIORITY: {taskDetail.priority.toUpperCase()}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {taskDetail.category.toUpperCase()}
                </span>
              </div>
            </div>

            <button
              onClick={() => props.setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex">
          <div className="flex-4 px-6 py-6 space-y-6">
            {/* Description */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                Description
              </h3>
              <p className="text-gray-900 leading-relaxed">
                {taskDetail.description}
              </p>
            </div>

            {/* Project Info */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                Project
              </h3>
              <div className="flex items-center space-x-2">
                <svg
                  className="w-4 h-4 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 7h18M3 12h18m-9 5h9"
                  />
                </svg>
                <span className="text-gray-900 font-medium">
                  {taskDetail.project?.title}
                </span>
              </div>
            </div>

            {/* Assigned Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Assigned By */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                  Assigned By
                </h3>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {taskDetail.assignedBy?.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {taskDetail.assignedBy?.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      @{taskDetail.assignedBy?.username}
                    </p>
                    <p className="text-sm text-gray-500">
                      {taskDetail.assignedBy?.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Assigned To */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                  Assigned To
                </h3>
                {taskDetail.assignedTo && taskDetail.assignedTo.length > 0 ? (
                  <div className="space-y-2">
                    {taskDetail.assignedTo.map((memberId, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                          {index + 1}
                        </div>
                        <p className="text-sm text-gray-700">{memberId.name}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No assignees</p>
                )}
              </div>
            </div>

            {/* Deadline and Effort */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  Deadline
                </h3>
                <div className="flex items-center space-x-2">
                  <svg
                    className="w-4 h-4 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="text-gray-900">
                    {formatDate(taskDetail.deadline)}
                  </span>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  Estimated Effort
                </h3>
                <div className="flex items-center space-x-2">
                  <svg
                    className="w-4 h-4 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-gray-900">
                    {taskDetail.estimatedEffort} hrs
                  </span>
                </div>
              </div>
            </div>

            {/* Timestamps */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  Created
                </h3>
                <p className="text-sm text-gray-600">
                  {formatDate(taskDetail.createdAt)}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  Last Updated
                </h3>
                <p className="text-sm text-gray-600">
                  {formatDate(taskDetail.updatedAt)}
                </p>
              </div>
            </div>
          </div>
          <div className="relative flex-2 border-l m-2 p-2 border-gray-200">
            <div className="grid gap-4 max-h-[360px] overflow-y-auto">
              {taskDetail?.comments?.map((comment) => (
                <div key={comment._id} className="relative flex gap-1">
                  <div className="bg-indigo-400 grid place-content-center font-bold w-10 h-10 p-3 rounded-full aspect-square text-center">
                    {comment.user.username.charAt(0)?.toUpperCase()}
                  </div>
                  <div className="text-sm absolute -top-1 left-11">
                    {comment.user.name}
                  </div>
                  <div className="bg-gray-200 w-full rounded-md p-1 mt-5">
                    {comment.text}
                  </div>
                </div>
              ))}
            </div>
            <form
              className="absolute bottom-0 gap-2 flex"
              onSubmit={(e) => {
                e.preventDefault();
                if (commentText !== "") {
                  comment.mutateAsync(
                    {
                      taskId: props.taskId,
                      text: commentText,
                    },
                    {
                      onSuccess: () => {
                        setCommentText("");
                      },
                    }
                  );
                }
              }}>
              <textarea
                rows={3}
                className="border p-2 w-xs rounded-md border-gray-400"
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write your comments..."
                value={commentText}
              />
              <button className="flex bg-indigo-700 items-end p-3 text-white rounded-lg h-fit">
                <LuSend />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetail;
