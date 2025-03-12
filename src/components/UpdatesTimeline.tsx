import React, { useState } from "react";
import { FiEdit2, FiTrash2, FiCalendar, FiPlus, FiClock } from "react-icons/fi";
import { motion } from "framer-motion";
import AddUpdateModal from "./AddUpdateModal";

interface Update {
    _id: string;
    content: string;
    date: string;
    media?: string[];
    createdAt: string;
    createdBy: {
        _id: string;
        name: string;
        photo?: {
            url: string;
        };
    };
}

interface UpdatesTimelineProps {
    updates: Update[];
    projectId?: string;
    onAddUpdate: (content: string, media?: string[]) => Promise<void>;
    onEditUpdate: (updateId: string, content: string, media?: string[]) => Promise<void>;
    onDeleteUpdate?: (updateId: string) => Promise<void>;
    canManageUpdates?: boolean;
    isAuthenticated?: boolean; // Add isAuthenticated prop
}

const UpdatesTimeline: React.FC<UpdatesTimelineProps> = ({
    updates = [],
    projectId,
    onAddUpdate,
    onEditUpdate,
    onDeleteUpdate,
    canManageUpdates = false,
    isAuthenticated = false, // Default to false
}) => {
    console.log('canManageUpdates', canManageUpdates)
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingUpdate, setEditingUpdate] = useState<Update | null>(null);
    const [newUpdate, setNewUpdate] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editContent, setEditContent] = useState('');

    const handleAddUpdate = async (content: string, media?: string[]) => {
        if (onAddUpdate && isAuthenticated) { // Check authentication
            await onAddUpdate(content, media);
        }
        setIsAddModalOpen(false);
    };

    const handleEditUpdate = async (content: string, media?: string[]) => {
        if (editingUpdate && onEditUpdate && isAuthenticated) { // Check authentication
            await onEditUpdate(editingUpdate._id, content, media);
            setEditingUpdate(null);
        }
    };

    const handleDeleteUpdate = async (updateId: string) => {
        if (onDeleteUpdate && confirm("Are you sure you want to delete this update?")) {
            await onDeleteUpdate(updateId);
        }
    };

    const handleAddSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newUpdate.trim() && isAuthenticated) { // Check authentication
            onAddUpdate(newUpdate.trim());
            setNewUpdate('');
            setIsAdding(false);
        }
    };

    const handleEditSubmit = (e: React.FormEvent, updateId: string) => {
        e.preventDefault();
        if (editContent.trim() && isAuthenticated) { // Check authentication
            onEditUpdate(updateId, editContent.trim());
            setEditingId(null);
            setEditContent('');
        }
    };

    const handleStartEdit = (update: Update) => {
        setEditingId(update._id);
        setEditContent(update.content);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    if (updates.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold">Project Updates</h3>
                    {canManageUpdates && (
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                        >
                            <FiPlus className="mr-1" /> Add Update
                        </button>
                    )}
                </div>
                <p className="text-gray-500 text-center py-6">No updates available for this project yet.</p>

                {/* Add Update Modal */}
                <AddUpdateModal
                    isOpen={isAddModalOpen}
                    onClose={() => setIsAddModalOpen(false)}
                    onSubmit={handleAddUpdate}
                />
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Project Updates</h3>
                {canManageUpdates && (
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                    >
                        <FiPlus className="mr-1" /> Add Update
                    </button>
                )}
            </div>

            <div className="space-y-6">
                {updates.map((update, index) => (
                    <motion.div
                        key={update._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="relative border-l-2 border-blue-500 pl-4 ml-4"
                    >
                        <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-blue-500"></div>

                        <div className="mb-1 text-sm text-gray-500 flex items-center">
                            <FiCalendar className="mr-1" /> {formatDate(update.date)}

                            {canManageUpdates && (
                                <div className="ml-auto flex space-x-2">
                                    <button
                                        onClick={() => setEditingUpdate(update)}
                                        className="text-gray-500 hover:text-blue-600"
                                        title="Edit update"
                                    >
                                        <FiEdit2 size={14} />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteUpdate(update._id)}
                                        className="text-gray-500 hover:text-red-600"
                                        title="Delete update"
                                    >
                                        <FiTrash2 size={14} />
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="text-gray-700 whitespace-pre-wrap">{update.content}</div>

                        {/* Display media if available */}
                        {update.media && update.media.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-2">
                                {update.media.map((mediaUrl, idx) => (
                                    <img
                                        key={idx}
                                        src={mediaUrl}
                                        alt={`Update media ${idx + 1}`}
                                        className="w-32 h-24 object-cover rounded-md border border-gray-200"
                                    />
                                ))}
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>

            {/* Add Update Modal */}
            <AddUpdateModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSubmit={handleAddUpdate}
            />

            {/* Edit Update Modal */}
            <AddUpdateModal
                isOpen={!!editingUpdate}
                onClose={() => setEditingUpdate(null)}
                onSubmit={handleEditUpdate}
                initialContent={editingUpdate?.content || ""}
                initialMedia={editingUpdate?.media || []}
                isEditing={true}
            />
        </div>
    );
};

export default UpdatesTimeline;
