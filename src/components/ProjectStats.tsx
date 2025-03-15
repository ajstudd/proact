import React from "react";
import { FaRupeeSign } from "react-icons/fa";
import { FiThumbsUp, FiThumbsDown, FiDollarSign, FiCalendar, FiUsers } from "react-icons/fi";

interface ProjectStatsProps {
    budget: number;
    expenditure: number;
    likesCount: number;
    dislikesCount: number;
    createdAt: string;
    onLike: () => void;
    onDislike: () => void;
    userHasLiked?: boolean;
    userHasDisliked?: boolean;
    isAuthenticated?: boolean; // Add isAuthenticated prop
}

const ProjectStats: React.FC<ProjectStatsProps> = ({
    budget,
    expenditure,
    likesCount,
    dislikesCount,
    createdAt,
    onLike,
    onDislike,
    userHasLiked = false,
    userHasDisliked = false,
    isAuthenticated = false, // Default to false
}) => {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const progressPercentage = Math.min(Math.round((expenditure / budget) * 100), 100);

    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-xl font-semibold mb-4">Project Statistics</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Budget vs Expenditure */}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <span className="flex items-center text-gray-700">
                            <FaRupeeSign className="mr-2 text-green-600" /> Budget vs Expenditure
                        </span>
                    </div>
                    <div className="mb-1 flex justify-between">
                        <span className="text-sm">Budget: {formatCurrency(budget)}</span>
                        <span className="text-sm">Spent: {formatCurrency(expenditure)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                            className={`h-2.5 rounded-full ${progressPercentage > 90 ? 'bg-red-600' :
                                progressPercentage > 75 ? 'bg-amber-500' : 'bg-green-600'
                                }`}
                            style={{ width: `${progressPercentage}%` }}
                        ></div>
                    </div>
                    <div className="mt-1 text-sm text-gray-600 text-right">
                        {progressPercentage}% spent
                    </div>
                </div>

                {/* Created At */}
                <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-full">
                        <FiCalendar className="text-blue-600" />
                    </div>
                    <div className="ml-3">
                        <div className="text-sm text-gray-600">Project Started</div>
                        <div className="font-medium">{formatDate(createdAt)}</div>
                    </div>
                </div>
            </div>

            {/* Engagement */}
            <div className="mt-6">
                <div className="flex items-center mb-2">
                    <FiUsers className="mr-2 text-blue-600" />
                    <span className="text-gray-700">Public Engagement</span>
                </div>

                <div className="flex space-x-4">
                    <button
                        onClick={onLike}
                        disabled={!isAuthenticated}
                        className={`px-4 py-2 rounded-md flex items-center transition ${userHasLiked
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            } ${!isAuthenticated ? 'opacity-50 cursor-not-allowed' : ''}`}
                        title={isAuthenticated ? 'Support this project' : 'Please log in to support this project'}
                    >
                        <FiThumbsUp className={`mr-2 ${userHasLiked ? 'text-green-600' : ''}`} />
                        {likesCount} Support
                    </button>

                    <button
                        onClick={onDislike}
                        disabled={!isAuthenticated}
                        className={`px-4 py-2 rounded-md flex items-center transition ${userHasDisliked
                            ? 'bg-red-100 text-red-700'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            } ${!isAuthenticated ? 'opacity-50 cursor-not-allowed' : ''}`}
                        title={isAuthenticated ? 'Oppose this project' : 'Please log in to oppose this project'}
                    >
                        <FiThumbsDown className={`mr-2 ${userHasDisliked ? 'text-red-600' : ''}`} />
                        {dislikesCount} Oppose
                    </button>
                </div>
            </div>

            {!isAuthenticated && (
                <div className="mt-2 text-center text-sm text-gray-500">
                    Please log in to support or oppose this project
                </div>
            )}
        </div>
    );
};

export default ProjectStats;
