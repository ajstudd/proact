import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiSend, FiThumbsUp, FiThumbsDown, FiTrash, FiMessageSquare } from "react-icons/fi";
import { useCurrentUser } from "../hooks/useCurrentUser";

interface Comment {
    _id: string;
    content: string;
    user: {
        _id: string;
        name: string;
        photo?: {
            url: string;
        };
    };
    createdAt: string;
    updatedAt: string;
    likes: string[];
    dislikes: string[];
    replies?: Comment[];
    parentComment?: string;
}

interface CommentsProps {
    projectId: string;
    comments: Comment[];
    onAddComment: (text: string, parentId?: string) => void;
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
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [replyContent, setReplyContent] = useState("");

    // Get authentication status from our hook
    const { isAuthenticated, userId } = useCurrentUser();

    // Use the userId from the hook if not provided directly
    const effectiveUserId = currentUserId || userId;

    useEffect(() => {
        // Filter root comments (those without parentComment)
        const rootComments = comments.filter(comment => !comment.parentComment);

        // Sort comments by creation date (newest first)
        const sorted = [...rootComments].sort((a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setSortedComments(sorted);
    }, [comments]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isAuthenticated) {
            alert("You must be logged in to comment");
            return;
        }

        if (newComment.trim()) {
            onAddComment(newComment);
            setNewComment("");
        }
    };

    const handleReplySubmit = (parentId: string) => {
        if (replyContent.trim()) {
            onAddComment(replyContent, parentId);
            setReplyContent("");
            setReplyingTo(null);
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

    // Find replies for a given comment
    const getReplies = (commentId: string) => {
        return comments.filter(comment => comment.parentComment === commentId)
            .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    };

    const CommentItem = ({ comment, index, isReply = false }: { comment: Comment, index: number, isReply?: boolean }) => {
        const replies = getReplies(comment._id);
        const userLiked = comment.likes.includes(effectiveUserId || '');
        const userDisliked = comment.dislikes.includes(effectiveUserId || '');
        const isCommentAuthor = effectiveUserId === comment.user._id;

        return (
            <motion.div
                key={comment._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`border-b border-gray-200 pb-4 ${isReply ? 'ml-12 mt-3' : ''}`}
            >
                <div className="flex items-start">
                    <img
                        src={comment.user?.photo?.url || "https://via.placeholder.com/40"}
                        alt={comment.user.name}
                        className="w-10 h-10 rounded-full mr-3"
                    />
                    <div className="flex-grow">
                        <div className="flex justify-between items-center">
                            <h4 className="font-medium">{comment.user.name}</h4>
                            <span className="text-xs text-gray-500">{formatDate(comment.createdAt)}</span>
                        </div>
                        <p className="mt-1 text-gray-700">{comment.content}</p>
                        <div className="flex items-center mt-2 space-x-4">
                            <button
                                onClick={() => isAuthenticated ? onLikeComment(comment._id) : alert("Please log in to like comments")}
                                className="flex items-center text-sm text-gray-600 hover:text-blue-600"
                                disabled={!isAuthenticated}
                            >
                                <FiThumbsUp className={`mr-1 ${userLiked ? 'text-blue-600' : ''}`} />
                                {comment.likes.length}
                            </button>
                            <button
                                onClick={() => isAuthenticated ? onDislikeComment(comment._id) : alert("Please log in to dislike comments")}
                                className="flex items-center text-sm text-gray-600 hover:text-red-600"
                                disabled={!isAuthenticated}
                            >
                                <FiThumbsDown className={`mr-1 ${userDisliked ? 'text-red-600' : ''}`} />
                                {comment.dislikes.length}
                            </button>
                            <button
                                onClick={() => isAuthenticated ? setReplyingTo(replyingTo === comment._id ? null : comment._id) : alert("Please log in to reply")}
                                className="flex items-center text-sm text-gray-600 hover:text-blue-600"
                                disabled={!isAuthenticated}
                            >
                                <FiMessageSquare className="mr-1" /> Reply
                            </button>

                            {/* Show delete button if user is the author */}
                            {isCommentAuthor && onDeleteComment && (
                                <button
                                    onClick={() => onDeleteComment(comment._id)}
                                    className="flex items-center text-sm text-gray-600 hover:text-red-600 ml-auto"
                                >
                                    <FiTrash className="mr-1" /> Delete
                                </button>
                            )}
                        </div>

                        {/* Reply form */}
                        {replyingTo === comment._id && (
                            <div className="mt-3">
                                <div className="flex">
                                    <input
                                        type="text"
                                        value={replyContent}
                                        onChange={(e) => setReplyContent(e.target.value)}
                                        placeholder={`Reply to ${comment.user.name}...`}
                                        className="flex-grow p-2 border border-gray-300 rounded-l text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <button
                                        onClick={() => handleReplySubmit(comment._id)}
                                        className="bg-blue-600 text-white px-3 rounded-r hover:bg-blue-700 transition flex items-center text-sm"
                                        disabled={!replyContent.trim()}
                                    >
                                        <FiSend className="mr-1" /> Reply
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Render replies */}
                        {replies.length > 0 && (
                            <div className="mt-2">
                                {replies.map((reply, replyIndex) => (
                                    <CommentItem
                                        key={reply._id}
                                        comment={reply}
                                        index={replyIndex}
                                        isReply={true}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        );
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
                        placeholder={isAuthenticated ? "Add a comment..." : "Please log in to comment"}
                        className="flex-grow p-2 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={!isAuthenticated}
                    />
                    <button
                        type="submit"
                        className={`bg-blue-600 text-white px-4 rounded-r ${!isAuthenticated || !newComment.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'} transition flex items-center`}
                        disabled={!isAuthenticated || !newComment.trim()}
                    >
                        <FiSend className="mr-2" /> Post
                    </button>
                </div>
                {!isAuthenticated && (
                    <p className="text-sm text-gray-500 mt-1">Please log in to join the conversation</p>
                )}
            </form>

            {/* Comments list */}
            <div className="space-y-4">
                {sortedComments.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No comments yet. Be the first to comment!</p>
                ) : (
                    sortedComments.map((comment, index) => (
                        <CommentItem
                            key={comment._id}
                            comment={comment}
                            index={index}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default Comments;
