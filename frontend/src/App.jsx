import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Team from "./pages/Team";
import Tasks from "./pages/Tasks";
import Login from "./pages/Login";
import Layout from "./components/Layout";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import Home from "./pages/website/Home";
import WebsiteLayout from "./components/Website/WebsiteLayout";
import Features from "./pages/website/Features";
import About from "./pages/website/About";
import Contact from "./pages/website/Contact";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuth } from "./lib/auth/authQueries";

const queryClient = new QueryClient()

// Root redirect component
const RootRedirect = () => {
  const { data: authData, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  // If authenticated, go to dashboard; otherwise go to website home
  return authData ? <Navigate to="/dashboard" replace /> : <Navigate to="/home" replace />;
};

const App = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <Routes>
                    {/* Root redirect */}
                    <Route path="/" element={<RootRedirect />} />

                    {/* Public website routes */}
                    <Route element={<WebsiteLayout />}>
                        <Route path="/home" element={<PublicRoute><Home /></PublicRoute>} />
                        <Route path="/features" element={<PublicRoute><Features /></PublicRoute>} />
                        <Route path="/about" element={<PublicRoute><About /></PublicRoute>} />
                        <Route path="/contact" element={<PublicRoute><Contact /></PublicRoute>} />
                    </Route>

                    {/* Auth routes - redirect to dashboard if already logged in */}
                    <Route
                        path="/login"
                        element={
                            <PublicRoute restrictWhenAuthenticated={true}>
                                <Login />
                            </PublicRoute>
                        }
                    />

                    {/* Protected app routes */}
                    <Route
                        element={
                            <ProtectedRoute>
                                <Layout />
                            </ProtectedRoute>
                        }
                    >
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/projects" element={<Projects />} />
                        <Route path="/tasks" element={<Tasks />} />
                        <Route path="/team" element={<Team />} />
                        <Route path="/analytics" element={<Analytics />} />
                        <Route path="/settings" element={<Settings />} />
                    </Route>

                    {/* Catch all route - redirect to root */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </BrowserRouter>
        </QueryClientProvider>
    );
};

export default App;
