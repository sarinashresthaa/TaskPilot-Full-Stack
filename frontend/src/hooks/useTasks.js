import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/auth/authQueries";

// Get user's assigned tasks
export const useMyTasks = () => {
  return useQuery({
    queryKey: ["tasks", "my-tasks"],
    queryFn: async () => {
      const res = await api.get("/tasks/my-tasks");
      return res.data.tasks;
    },
  });
};

// Get tasks for a specific project
export const useProjectTasks = (projectId) => {
  return useQuery({
    queryKey: ["tasks", "project", projectId],
    queryFn: async () => {
      const res = await api.get(`/tasks/project/${projectId}`);
      return res.data.tasks;
    },
    enabled: !!projectId,
  });
};

// Get single task by ID
export const useTask = (taskId) => {
  return useQuery({
    queryKey: ["tasks", taskId],
    queryFn: async () => {
      const res = await api.get(`/tasks/${taskId}`);
      return res.data.task;
    },
    enabled: !!taskId,
  });
};

// Create new task
export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (taskData) => {
      const res = await api.post("/tasks", taskData);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};

//Update tasks
export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, taskData }) => {
      const res = await api.put(`/tasks/${id}`, taskData);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", "my-tasks"] });
    },
  });
};

// Assign task to users
export const useAssignTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ taskId, userIds }) => {
      const res = await api.post(`/tasks/${taskId}/assign`, { userIds });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};

// Update task status
export const useUpdateTaskStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ taskId, status }) => {
      const res = await api.patch(`/tasks/${taskId}/status`, { status });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};

// Add comment to task
export const useAddTaskComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ taskId, text }) => {
      const res = await api.post(`/tasks/${taskId}/comments`, { text });
      return res.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["tasks", variables.taskId] });
    },
  });
};
