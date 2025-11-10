import React, { useState } from "react";
import { MdAddCircleOutline } from "react-icons/md";
import Button from "../components/Button";
import AddProject from "../components/Modal/AddProject";
import ProjectDetail from "../components/Modal/ProjectDetail";
import { useProjects } from "../hooks/useProjects";
import { useAuth } from "../lib/auth/authQueries";
import AddAction from "../components/Modal/AddAction";

const Projects = () => {
  const { data: projects, isLoading, error } = useProjects();
  const { data: authData } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isView, setIsView] = useState(false);
  const [editId, setEditId] = useState(0);

  const userRole = authData?.user?.role;
  const canCreateProjects = userRole === "project_manager";

  if (isLoading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-600">Error: {error.message}</div>
    );
  }

  return (
    <div className="p-4 grid gap-4">
      {canCreateProjects && (
        <div className="flex justify-end">
          <Button
            icon={<MdAddCircleOutline />}
            label="Add Project"
            onClick={() => setIsOpen(true)}
          />
        </div>
      )}

      <div className="rounded-lg shadow-xl">
        <table className="w-full">
          <thead className="bg-indigo-200">
            <tr className="text-sm">
              <th className="p-2 text-left">S.N.</th>
              <th className="p-2 text-left">Project name</th>
              <th className="p-2 text-left">Description</th>
              <th className="p-2 text-left">Category</th>
              <th className="p-2 text-left">Start date</th>
              <th className="p-2 text-left">End date</th>
              <th className="p-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {projects && projects.length > 0 ? (
              projects.map((project, index) => (
                <tr key={project._id} className="border-b">
                  <td className="p-2">{index + 1}</td>
                  <td className="p-2">
                    <div>
                      <div className="font-medium text-[#631edb]">
                        {project.title}
                      </div>
                    </div>
                  </td>
                  <td className="p-2">
                    <div>
                      {project.description.substring(0, 50)}
                      {project.description.length > 50 && "..."}
                    </div>
                  </td>
                  <td className="p-2">
                    <div>
                      {project.category[0].toUpperCase()}
                      {project.category.slice(1)}
                    </div>
                  </td>
                  <td className="p-2">
                    <div>{project.startDate.slice(0, 10)}</div>
                  </td>
                  <td className="p-2">
                    <div>{project.endDate.slice(0, 10)}</div>
                  </td>
                  <td className="p-2">
                    <AddAction
                      viewDetail={() => {
                        setIsView(true);
                        setEditId(project._id);
                      }}
                      handleEdit={
                        canCreateProjects
                          ? () => {
                              setIsOpen(true);
                              setEditId(project._id);
                            }
                          : undefined
                      }
                      handleAssign={undefined}
                      handleStatusChange={undefined}
                    />{" "}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="p-8 text-center text-gray-500">
                  No projects assigned to you yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {isOpen && (
        <AddProject
          setIsOpen={(e) => {
            setIsOpen(e);
            setEditId(0);
          }}
          editId={editId}
        />
      )}
      {isView && <ProjectDetail setIsOpen={setIsView} editId={editId} />}
    </div>
  );
};

export default Projects;
