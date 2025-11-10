import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/auth/authQueries";

// Get user's projects
export const useProjects = () => {
  return useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const res = await api.get("/projects");
      return res.data.projects;
    },
  });
};

// Get single project by ID
export const useProject = (projectId) => {
  return useQuery({
    queryKey: ["projects", projectId],
    queryFn: async () => {
      const res = await api.get(`/projects/${projectId}`);
      return res.data.project;
    },
    enabled: !!projectId,
  });
};

// Create new project (project manager/admin only)
export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (projectData) => {
      const res = await api.post("/projects", projectData);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};

//Update project
export const useUpdateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, projectData }) => {
      const res = await api.put(`/projects/${id}`, projectData);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};

// Add member to project (project manager only)
export const useAddProjectMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ projectId, userId, role = "member" }) => {
      const res = await api.post(`/projects/${projectId}/members`, {
        userId,
        role,
      });
      return res.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["projects", variables.projectId],
      });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};
