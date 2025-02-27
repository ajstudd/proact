"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ProjectCard from "components/ProjectCard"; // Import the card component
import CreateProjectForm from "components/CreateProject";

// Dummy data for testing (Replace with API call)
const projects = [
    {
        id: "1",
        title: "New Highway Construction",
        description: "A project to improve road infrastructure in rural areas.",
        image: "https://images.unsplash.com/photo-1579547945413-0226cba2f0eb",
        location: "Delhi, India",
        likes: 120,
        dislikes: 5,
    },
    {
        id: "2",
        title: "Solar Power Plant",
        description: "Building a new solar plant to generate clean energy.",
        image: "https://images.unsplash.com/photo-1509395176047-4a66953fd231",
        location: "Rajasthan, India",
        likes: 98,
        dislikes: 3,
    },
    {
        id: "3",
        title: "Smart City Initiative",
        description: "Transforming urban areas with smart technology solutions.",
        image: "https://images.unsplash.com/photo-1529245019870-59e9dc6be721",
        location: "Mumbai, India",
        likes: 150,
        dislikes: 10,
    },
];


const HomePage = () => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 p-6 max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 text-center mb-6">Government Projects</h1>
            <CreateProjectForm />
            {/* Animated List */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: mounted ? 1 : 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
            >
                {projects.map((project) => (
                    <ProjectCard key={project.id} {...project} />
                ))}
            </motion.div>
        </div>
    );
};

export default HomePage;
