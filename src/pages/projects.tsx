"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ProjectCard from "components/ProjectCard";
import { useGetTrimmedProjectsQuery } from "@services";
import { FiLoader, FiPlus } from "react-icons/fi";
import { useCurrentUser } from "hooks/useCurrentUser";
import { TrimmedProject } from "types/project";
import { useRouter } from "next/navigation";

const ProjectsPage = () => {
    const [mounted, setMounted] = useState(false);
    const { user } = useCurrentUser();

    // Get user's projects using the userId parameter
    const {
        data: projects,
        isLoading,
        isError,
        refetch
    } = useGetTrimmedProjectsQuery({ userId: user?.id });

    const router = useRouter();

    useEffect(() => {
        setMounted(true);
        refetch();
    }, [refetch]);

    // Hide client-side only UI until after hydration
    if (!mounted) {
        return null;
    }

    const handleCreateProject = () => {
        router.push("/create-project");
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4 md:p-6 max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 text-center mb-6">My Projects</h1>

            {/* Create Project Button */}
            {user && (user.isAuthenticated || user.role === "GOVERNMENT") && (
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCreateProject}
                    className="mb-6 mx-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                    <FiPlus /> Create New Project
                </motion.button>
            )}

            {/* Loading state */}
            {isLoading && (
                <div className="flex flex-col items-center justify-center py-10">
                    <FiLoader className="animate-spin text-4xl text-blue-600 mb-4" />
                    <p className="text-gray-600">Loading your projects...</p>
                </div>
            )}

            {/* Error state */}
            {isError && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6">
                    <p>Failed to load projects. Please try again later.</p>
                    <button
                        onClick={() => refetch()}
                        className="mt-2 text-red-700 underline"
                    >
                        Retry
                    </button>
                </div>
            )}

            {/* Projects grid */}
            {projects && projects.length > 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {projects.map((project: TrimmedProject) => (
                        <ProjectCard key={project._id} {...project} />
                    ))}
                </motion.div>
            )}

            {/* Empty state */}
            {projects && projects.length === 0 && !isLoading && (
                <div className="flex flex-col items-center justify-center py-10 bg-white rounded-lg shadow-md">
                    <p className="text-gray-600 text-xl mb-4">You haven&apos;t created any projects yet</p>

                    {user && (user.isAuthenticated || user.role === "GOVERNMENT") && (
                        <button
                            onClick={handleCreateProject}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                        >
                            Create Your First Project
                        </button>
                    )}

                    {!(user && (user.isAuthenticated || user.role === "GOVERNMENT")) && (
                        <p className="text-sm text-gray-500">
                            Only administrators and government officials can create projects.
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};

export default ProjectsPage;
