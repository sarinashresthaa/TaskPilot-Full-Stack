import { ReactNode } from 'react';

import { useAuth } from '../lib/auth/authQueries';



const AuthProvider = ({ children }) => {
    const { data: auth, isLoading } = useAuth()

    if (isLoading) return <div>Loading...</div>

    return (
        <>{children}</>
    )
}



