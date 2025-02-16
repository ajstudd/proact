"use client";

import { motion } from "framer-motion";
import { FiMapPin, FiThumbsUp, FiThumbsDown } from "react-icons/fi";
import { useRouter } from "next/navigation";

interface ProjectCardProps {
    id: string;
    title: string;
    description: string;
    image: string;
    location: string;
    likes: number;
    dislikes: number;
}

const ProjectCard = ({ id, title, description, image, location, likes, dislikes }: ProjectCardProps) => {
    const router = useRouter();

    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition-all flex items-center p-4 space-x-4"
            onClick={() => router.push(`/project/${id}`)}
        >
            {/* Project Image */}
            <img src={image} alt={title} className="w-32 h-32 object-cover rounded-md" />

            {/* Project Details */}
            <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
                <p className="text-gray-600 line-clamp-2">{description}</p>

                {/* Project Location & Engagement */}
                <div className="flex items-center justify-between mt-3 text-gray-700 text-sm">
                    <div className="flex items-center">
                        <FiMapPin className="mr-1 text-red-500" />
                        {location}
                    </div>
                    <div className="flex items-center space-x-3">
                        <span className="flex items-center">
                            <FiThumbsUp className="mr-1 text-green-500" /> {likes}
                        </span>
                        <span className="flex items-center">
                            <FiThumbsDown className="mr-1 text-red-500" /> {dislikes}
                        </span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ProjectCard;
