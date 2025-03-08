import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiSend, FiThumbsUp, FiThumbsDown, FiTrash } from "react-icons/fi";

interface Comment {
    _id: string;
    text: string;
    author: {
        _id: string;
        name: string;
        avatar: string;
    };
    createdAt: string;
    likes: string[];
    dislikes: string[];
}

interface CommentsProps {
    projectId: string;
    comments: Comment[];
    onAddComment: (text: string) => void;
    onLikeComment: (commentId: string) => void;
    onDislikeComment: (commentId: string) => void;
    onDeleteComment?: (commentId: string) => void;
    currentUserId?: string;
}

export const Comments: React.FC<CommentsProps> = ({
    projectId,
    comments,
    onAddComment,
    onLikeComment,
    onDislikeComment,
    onDeleteComment,
    currentUserId
}) => {
    const [newComment, setNewComment] = useState("");
    const [sortedComments, setSortedComments] = useState<Comment[]>([]);

    useEffect(() => {
        // Sort comments by creation date (newest first)
        const sorted = [...comments].sort((a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setSortedComments(sorted);
    }, [comments]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newComment.trim()) {
            onAddComment(newComment);
            setNewComment("");
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-xl font-semibold mb-4">Comments</h3>

            {/* Add comment form */}
            <form onSubmit={handleSubmit} className="mb-6">
                <div className="flex">
                    <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment..."
                        className="flex-grow p-2 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 rounded-r hover:bg-blue-700 transition flex items-center"
                        disabled={!newComment.trim()}
                    >
                        <FiSend className="mr-2" /> Post
                    </button>
                </div>
            </form>

            {/* Comments list */}
            <div className="space-y-4">
                {sortedComments.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No comments yet. Be the first to comment!</p>
                ) : (
                    sortedComments.map((comment) => (
                        <motion.div
                            key={comment._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="border-b border-gray-200 pb-4"
                        >
                            <div className="flex items-start">
                                <img
                                    src={comment.author.avatar || "https://via.placeholder.com/40"}
                                    alt={comment.author.name}
                                    className="w-10 h-10 rounded-full mr-3"
                                />
                                <div className="flex-grow">
                                    <div className="flex justify-between items-center">
                                        <h4 className="font-medium">{comment.author.name}</h4>
                                        <span className="text-xs text-gray-500">{formatDate(comment.createdAt)}</span>
                                    </div>
                                    <p className="mt-1 text-gray-700">{comment.text}</p>
                                    <div className="flex items-center mt-2 space-x-4">
                                        <button
                                            onClick={() => onLikeComment(comment._id)}
                                            className="flex items-center text-sm text-gray-600 hover:text-blue-600"
                                        >
                                            <FiThumbsUp className="mr-1" /> {comment.likes.length}
                                        </button>
                                        <button
                                            onClick={() => onDislikeComment(comment._id)}
                                            className="flex items-center text-sm text-gray-600 hover:text-red-600"
                                        >
                                            <FiThumbsDown className="mr-1" /> {comment.dislikes.length}
                                        </button>

                                        {/* Show delete button if user is the author */}
                                        {currentUserId && comment.author._id === currentUserId && onDeleteComment && (
                                            <button
                                                onClick={() => onDeleteComment(comment._id)}
                                                className="flex items-center text-sm text-gray-600 hover:text-red-600 ml-auto"
                                            >
                                                <FiTrash className="mr-1" /> Delete
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Comments;
