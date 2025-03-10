import React, { useState, useEffect, useRef } from "react";
import { FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

interface AddUpdateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (content: string, media?: string[]) => void;
    initialContent?: string;
    initialMedia?: string[];
    isEditing?: boolean;
}

const AddUpdateModal: React.FC<AddUpdateModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    initialContent = "",
    initialMedia = [],
    isEditing = false,
}) => {
    const [content, setContent] = useState(initialContent);
    const [media, setMedia] = useState<string[]>(initialMedia);
    const [isLoading, setIsLoading] = useState(false);

    // Track previous props values to avoid unnecessary updates
    const prevPropsRef = useRef({
        isOpen,
        initialContent,
        initialMedia: [...initialMedia]
    });

    // Fix the infinite loop by properly comparing arrays and avoiding unnecessary updates
    useEffect(() => {
        // Only update state if the modal is opening or if the initial values changed significantly
        const prevProps = prevPropsRef.current;

        // Check if initialMedia arrays are different by comparing content
        const mediaChanged =
            initialMedia.length !== prevProps.initialMedia.length ||
            initialMedia.some((url, i) => prevProps.initialMedia[i] !== url);

        if (
            (isOpen && !prevProps.isOpen) ||
            (isOpen && (
                initialContent !== prevProps.initialContent ||
                mediaChanged
            ))
        ) {
            setContent(initialContent);
            setMedia([...initialMedia]); // Use spread to ensure new array reference
        }

        // Update ref with current props, creating new array reference for initialMedia
        prevPropsRef.current = {
            isOpen,
            initialContent,
            initialMedia: [...initialMedia]
        };
    }, [isOpen, initialContent]); // Remove initialMedia from dependencies to avoid triggering on reference changes

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;

        setIsLoading(true);
        try {
            await onSubmit(content, media);
            setContent("");
            setMedia([]);
            onClose();
        } catch (error) {
            console.error("Error submitting update:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Future enhancement: Add media upload functionality
    const handleAddImage = () => {
        // This would be replaced with actual image upload functionality
        const imageUrl = prompt("Enter image URL");
        if (imageUrl) {
            setMedia([...media, imageUrl]);
        }
    };

    const handleRemoveImage = (index: number) => {
        const newMedia = [...media];
        newMedia.splice(index, 1);
        setMedia(newMedia);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="bg-white rounded-lg shadow-xl max-w-lg w-full"
                    >
                        <div className="flex justify-between items-center p-4 border-b">
                            <h3 className="text-lg font-medium">
                                {isEditing ? "Edit Project Update" : "Add New Project Update"}
                            </h3>
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <FiX size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-4">
                            <div className="mb-4">
                                <label
                                    htmlFor="content"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Update Content
                                </label>
                                <textarea
                                    id="content"
                                    rows={5}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter project update details..."
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    required
                                />
                            </div>

                            {/* Media Preview */}
                            {media.length > 0 && (
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Media
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {media.map((item, index) => (
                                            <div
                                                key={index}
                                                className="relative group w-20 h-20 border rounded overflow-hidden"
                                            >
                                                <img
                                                    src={item}
                                                    alt={`Media ${index}`}
                                                    className="w-full h-full object-cover"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveImage(index)}
                                                    className="absolute inset-0 bg-black bg-opacity-50 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center"
                                                >
                                                    <FiX />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-between">
                                <button
                                    type="button"
                                    onClick={handleAddImage}
                                    className="text-blue-600 hover:text-blue-800"
                                >
                                    + Add Image
                                </button>

                                <div className="flex space-x-2">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                                        disabled={isLoading}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400"
                                        disabled={isLoading || !content.trim()}
                                    >
                                        {isLoading
                                            ? "Submitting..."
                                            : isEditing
                                                ? "Update"
                                                : "Post Update"}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default AddUpdateModal;
