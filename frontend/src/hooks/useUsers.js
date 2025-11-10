import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../lib/auth/authQueries'

// Get all users (admin only)
export const useUsers = (params = {}) => {
    return useQuery({
        queryKey: ['users', params],
        queryFn: async () => {
            const res = await api.get('/admin/users', { params })
            return res.data
        }
    })
}

// Get single user by ID
export const useUser = (userId) => {
    return useQuery({
        queryKey: ['users', userId],
        queryFn: async () => {
            const res = await api.get(`/admin/users/${userId}`)
            return res.data.user
        },
        enabled: !!userId
    })
}

// Create new user (admin only)
export const useCreateUser = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (userData) => {
            const res = await api.post('/admin/users', userData)
            return res.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] })
        }
    })
}

// Update user (admin only)
export const useUpdateUser = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ userId, userData }) => {
            const res = await api.put(`/admin/users/${userId}`, userData)
            return res.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] })
        }
    })
}

// Delete user (admin only)
export const useDeleteUser = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (userId) => {
            const res = await api.delete(`/admin/users/${userId}`)
            return res.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] })
        }
    })
}

// Assign role to user (admin only)
export const useAssignRole = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ userId, role }) => {
            const res = await api.patch(`/admin/users/${userId}/role`, { role })
            return res.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] })
        }
    })
}

// Get system stats (admin only)
export const useSystemStats = () => {
    return useQuery({
        queryKey: ['admin', 'stats'],
        queryFn: async () => {
            const res = await api.get('/admin/system-stats')
            return res.data
        }
    })
}

// Get activity logs (admin only)
export const useActivityLogs = (params = {}) => {
    return useQuery({
        queryKey: ['admin', 'activity-logs', params],
        queryFn: async () => {
            const res = await api.get('/admin/activity-logs', { params })
            return res.data
        }
    })
}