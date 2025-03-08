import React from "react";
import { motion } from "framer-motion";

interface Update {
    content: string;
    media: string[];
    date: string;
}

interface UpdatesTimelineProps {
    updates: Update[];
}

const UpdatesTimeline: React.FC<UpdatesTimelineProps> = ({ updates }) => {
    if (!updates || updates.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-xl font-semibold mb-4">Project Updates</h3>
                <p className="text-gray-500 text-center py-4">No updates available for this project yet.</p>
            </div>
        );
    }

    // Sort updates by date (newest first)
    const sortedUpdates = [...updates].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-xl font-semibold mb-4">Project Updates</h3>

            <div className="relative pl-8">
                {/* Vertical timeline line */}
                <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-blue-200"></div>

                <div className="space-y-6">
                    {sortedUpdates.map((update, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="relative"
                        >
                            {/* Timeline dot */}
                            <div className="absolute -left-8 mt-1.5 w-4 h-4 rounded-full bg-blue-500 border-4 border-blue-100"></div>

                            <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-medium">{formatDate(update.date)}</h4>
                                </div>
                                <p className="text-gray-700 mb-3">{update.content}</p>

                                {/* Display media if available */}
                                {update.media && update.media.length > 0 && (
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                                        {update.media.map((mediaUrl, idx) => (
                                            <a key={idx} href={mediaUrl} target="_blank" rel="noopener noreferrer">
                                                <img
                                                    src={mediaUrl}
                                                    alt={`Update media ${idx + 1}`}
                                                    className="w-full h-32 object-cover rounded-md hover:opacity-90 transition"
                                                />
                                            </a>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default UpdatesTimeline;
