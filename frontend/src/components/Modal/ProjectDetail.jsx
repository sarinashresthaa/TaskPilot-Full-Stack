import React from "react";
import { useProject } from "../../hooks/useProjects";

const ProjectDetail = (props) => {
  const { data: projectDetail } = useProject(props.editId);

  if (!projectDetail) {
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

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "paused":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryColor = (category) => {
    switch (category.toLowerCase()) {
      case "development":
        return "bg-purple-100 text-purple-800";
      case "design":
        return "bg-pink-100 text-pink-800";
      case "marketing":
        return "bg-orange-100 text-orange-800";
      case "research":
        return "bg-indigo-100 text-indigo-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return "bg-green-500";
    if (progress >= 60) return "bg-blue-500";
    if (progress >= 40) return "bg-yellow-500";
    if (progress >= 20) return "bg-orange-500";
    return "bg-red-500";
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/30 z-50 p-4">
      {/* Modal Box */}
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
          <div className="flex justify-between items-start">
            <div className="flex-1 pr-4">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                {projectDetail.title}
              </h2>
              <div className="flex gap-2 flex-wrap">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    projectDetail.status
                  )}`}
                >
                  {projectDetail.status.toUpperCase()}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                    projectDetail.category
                  )}`}
                >
                  {projectDetail.category.toUpperCase()}
                </span>
                {projectDetail.isOverdue && (
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    OVERDUE
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={() => props.setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
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
        <div className="px-6 py-6 space-y-6">
          {/* Description */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              Description
            </h3>
            <p className="text-gray-900 leading-relaxed">
              {projectDetail.description}
            </p>
          </div>

          {/* Progress */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-semibold text-gray-700">Progress</h3>
              <span className="text-sm font-medium text-gray-900">
                {projectDetail.progress}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all duration-300 ${getProgressColor(
                  projectDetail.progress
                )}`}
                style={{ width: `${projectDetail.progress}%` }}
              ></div>
            </div>
          </div>

          {/* Project Timeline */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                Start Date
              </h3>
              <div className="flex items-center space-x-2">
                <svg
                  className="w-4 h-4 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-gray-900">
                  {formatDate(projectDetail.startDate)}
                </span>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                End Date
              </h3>
              <div className="flex items-center space-x-2">
                <svg
                  className={`w-4 h-4 ${
                    projectDetail.isOverdue ? "text-red-600" : "text-blue-600"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span
                  className={
                    projectDetail.isOverdue
                      ? "text-red-600 font-medium"
                      : "text-gray-900"
                  }
                >
                  {formatDate(projectDetail.endDate)}
                </span>
              </div>
            </div>
          </div>

          {/* Duration and Days Remaining */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                Duration
              </h3>
              <div className="flex items-center space-x-2">
                <svg
                  className="w-4 h-4 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-gray-900">
                  {projectDetail.duration} days
                </span>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                Days Remaining
              </h3>
              <div className="flex items-center space-x-2">
                <svg
                  className={`w-4 h-4 ${
                    projectDetail.daysRemaining <= 0
                      ? "text-red-600"
                      : "text-orange-600"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v3l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span
                  className={
                    projectDetail.daysRemaining <= 0
                      ? "text-red-600 font-medium"
                      : "text-gray-900"
                  }
                >
                  {projectDetail.daysRemaining <= 0
                    ? "Overdue"
                    : `${projectDetail.daysRemaining} days`}
                </span>
              </div>
            </div>
          </div>

          {/* Project Manager */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Project Manager
            </h3>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                {projectDetail.manager.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  {projectDetail.manager.name}
                </p>
                <p className="text-sm text-gray-600">
                  @{projectDetail.manager.username}
                </p>
                <p className="text-sm text-gray-500">
                  {projectDetail.manager.email}
                </p>
              </div>
            </div>
          </div>

          {/* Team Members */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Team Members
            </h3>
            {projectDetail.teamMembers &&
            projectDetail.teamMembers.length > 0 ? (
              <div className="space-y-2">
                {projectDetail.teamMembers.map((member, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {member.name}
                      </p>
                      <p className="text-xs text-gray-500">{member.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <svg
                  className="w-12 h-12 text-gray-300 mx-auto mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <p className="text-gray-500 text-sm">
                  No team members assigned
                </p>
              </div>
            )}
          </div>

          {/* Created By */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Created By
            </h3>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                {projectDetail.createdBy.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  {projectDetail.createdBy.name}
                </p>
                <p className="text-sm text-gray-500">
                  {projectDetail.createdBy.email}
                </p>
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
                {formatDate(projectDetail.createdAt)}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                Last Updated
              </h3>
              <p className="text-sm text-gray-600">
                {formatDate(projectDetail.updatedAt)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
