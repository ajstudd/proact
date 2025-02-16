import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FiArrowLeft, FiMapPin, FiThumbsUp, FiThumbsDown } from "react-icons/fi";
import { motion } from "framer-motion";

const ProjectPage = () => {
    const router = useRouter();
    const { id } = router.query; // ✅ Get project ID from URL
    const [project, setProject] = useState<any>(null);

    useEffect(() => {
        if (!id) return;

        // Simulated API call (Replace with real API)
        const fetchProject = async () => {
            // Example API call: `/api/projects/${id}`
            const projectData = {
                id,
                title: "New Highway Construction",
                description:
                    "This project aims to improve connectivity and reduce travel time for rural communities by building a modern highway.",
                image: "https://images.unsplash.com/photo-1579547945413-0226cba2f0eb",
                location: "Delhi, India",
                likes: 120,
                dislikes: 5,
            };
            setProject(projectData);
        };

        fetchProject();
    }, [id]);

    if (!project) return <p className="text-center text-gray-500 mt-20">Loading...</p>;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-gray-100 p-6"
        >
            <button
                onClick={() => router.back()}
                className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
            >
                <FiArrowLeft /> <span>Back to Projects</span>
            </button>

            <div className="bg-white p-6 rounded-lg shadow-lg mt-4">
                <img src={project.image} alt={project.title} className="w-full h-64 object-cover rounded-lg" />
                <h1 className="text-2xl font-bold text-gray-900 mt-4">{project.title}</h1>
                <p className="text-gray-700 mt-2">{project.description}</p>
                <div className="flex items-center justify-between mt-4 text-gray-700">
                    <div className="flex items-center">
                        <FiMapPin className="mr-1 text-red-500" />
                        {project.location}
                    </div>
                    <div className="flex items-center space-x-3">
                        <span className="flex items-center">
                            <FiThumbsUp className="mr-1 text-green-500" /> {project.likes}
                        </span>
                        <span className="flex items-center">
                            <FiThumbsDown className="mr-1 text-red-500" /> {project.dislikes}
                        </span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ProjectPage;
