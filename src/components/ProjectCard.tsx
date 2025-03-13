"use client";

import { motion } from "framer-motion";
import { FiMapPin, FiThumbsUp, FiThumbsDown, FiDollarSign, FiCalendar, FiUsers } from "react-icons/fi";
import { MdAccountBalance } from "react-icons/md";
import { useRouter } from "next/navigation";
import Image from "next/image";

export interface ProjectCardProps {
    _id: string;
    title: string;
    description: string;
    bannerUrl: string;
    location?: {
        lat: number;
        lng: number;
        place: string;
    };
    budget: number;
    expenditure?: number;
    likes?: number[];
    dislikes?: number[];
    createdAt?: string;
    contractor?: {
        _id: string;
        name: string;
        id: string;
    };
    government?: {
        _id: string;
        name: string;
        id: string;
    };
}

interface componentProps {
    project: ProjectCardProps;
}
const ProjectCard = ({ project }: componentProps) => {
    const { _id, title, description, bannerUrl, location, budget, likes = [], dislikes = [], createdAt, contractor, government } = project;
    const router = useRouter();
    const formattedDate = createdAt ? new Date(createdAt).toLocaleDateString() : 'Unknown date';
    const formattedBudget = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(budget);

    const handleClick = () => {
        router.push(`/project/${_id}`);
    };

    const placeholderImage = "https://via.placeholder.com/400x200?text=No+Image";

    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-all"
            onClick={handleClick}
        >
            <div className="relative">
                <div className="h-48 overflow-hidden">
                    <img
                        src={bannerUrl || placeholderImage}
                        alt={title}
                        className="w-full h-full object-cover transition-transform hover:scale-105"
                    />
                </div>
                <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    <FiDollarSign className="inline mr-1" /> {formattedBudget}
                </div>
            </div>

            <div className="p-5">
                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">{title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{description}</p>

                <div className="flex flex-wrap justify-between items-center text-sm text-gray-700">
                    {location?.place && (
                        <div className="flex items-center mb-2">
                            <FiMapPin className="mr-1 text-red-500" />
                            <span className="line-clamp-1">{location.place}</span>
                        </div>
                    )}

                    <div className="flex items-center mb-2">
                        <FiCalendar className="mr-1 text-blue-500" />
                        {formattedDate}
                    </div>
                </div>

                {/* Stakeholder information */}
                {(contractor || government) && (
                    <div className="flex flex-wrap gap-2 mt-2 mb-3 text-xs text-gray-600">
                        {contractor && (
                            <div className="flex items-center bg-amber-50 px-2 py-1 rounded">
                                <FiUsers className="mr-1 text-amber-600" />
                                <span className="line-clamp-1">{contractor.name}</span>
                            </div>
                        )}
                        {government && (
                            <div className="flex items-center bg-blue-50 px-2 py-1 rounded">
                                <MdAccountBalance className="mr-1 text-blue-600" />
                                <span className="line-clamp-1">{government.name}</span>
                            </div>
                        )}
                    </div>
                )}

                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center space-x-4">
                        <span className="flex items-center">
                            <FiThumbsUp className="mr-1 text-green-500" />
                            {likes.length}
                        </span>
                        <span className="flex items-center">
                            <FiThumbsDown className="mr-1 text-red-500" />
                            {dislikes.length}
                        </span>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                    >
                        View Details
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
};

export default ProjectCard;
