import React, { useState, useEffect, useRef, useCallback, memo } from "react";
import { motion } from "framer-motion";
import { FiSend, FiThumbsUp, FiThumbsDown, FiTrash, FiMessageSquare } from "react-icons/fi";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { useCommentsState, Comment } from "../hooks/useCommentsState";
import { useDispatch } from "react-redux";

interface CommentsProps {
    projectId: string;
    comments: Comment[];
    onAddComment: (text: string, parentId?: string) => void;
    onLikeComment: (commentId: string) => void;
    onDislikeComment: (commentId: string) => void;
    onDeleteComment?: (commentId: string) => void;
    currentUserId?: string;
}

// Separate component for the comment input to avoid unnecessary re-renders
const CommentInput = memo(({
    onSubmit,
    placeholder,
    buttonText = "Post",
    disabled = false
}: {
    onSubmit: (text: string) => void;
    placeholder: string;
    buttonText?: string;
    disabled?: boolean;
}) => {
    const [text, setText] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (text.trim()) {
            onSubmit(text.trim());
            setText('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex">
            <input
                ref={inputRef}
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={placeholder}
                disabled={disabled}
                className="flex-grow p-2 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
                type="submit"
                disabled={disabled || !text.trim()}
                className={`bg-blue-600 text-white px-3 py-2 rounded-r ${!text.trim() || disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
                    } transition flex items-center text-sm`}
            >
                <FiSend className="mr-1" /> {buttonText}
            </button>
        </form>
    );
});

CommentInput.displayName = 'CommentInput';

// Separate component for reply input to isolate state and prevent re-renders
const ReplyInput = memo(({
    onSubmit,
    userName
}: {
    onSubmit: (text: string) => void;
    userName: string;
}) => {
    return (
        <div className="mt-3">
            <CommentInput
                onSubmit={onSubmit}
                placeholder={`Reply to ${userName}...`}
                buttonText="Reply"
            />
        </div>
    );
});

ReplyInput.displayName = 'ReplyInput';

// Individual comment component with its own state management
const CommentItem = memo(({
    comment,
    projectId,
    onReply,
    onLike,
    onDislike,
    onDelete,
    currentUserId,
    isAuthenticated
}: {
    comment: Comment;
    projectId: string;
    onReply: (parentId: string, text: string) => void;
    onLike: (commentId: string) => void;
    onDislike: (commentId: string) => void;
    onDelete?: (commentId: string) => void;
    currentUserId?: string;
    isAuthenticated: boolean;
}) => {
    const [showReplyInput, setShowReplyInput] = useState(false);

    // Format date string
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

    const userLiked = comment.likes.includes(currentUserId || '');
    const userDisliked = comment.dislikes.includes(currentUserId || '');
    const isCommentAuthor = currentUserId === comment.user._id;

    const handleReplyClick = () => {
        if (isAuthenticated) {
            setShowReplyInput(prev => !prev);
        } else {
            alert("Please log in to reply");
        }
    };

    const handleSubmitReply = (text: string) => {
        onReply(comment._id, text);
        setShowReplyInput(false);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`border-b border-gray-200 pb-4 mb-4 ${comment.parentComment ? 'ml-12 mt-3' : ''}`}
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
                            onClick={() => isAuthenticated ? onLike(comment._id) : alert("Please log in to like comments")}
                            className="flex items-center text-sm text-gray-600 hover:text-blue-600"
                            disabled={!isAuthenticated}
                        >
                            <FiThumbsUp className={`mr-1 ${userLiked ? 'text-blue-600' : ''}`} />
                            {comment.likes.length}
                        </button>
                        <button
                            onClick={() => isAuthenticated ? onDislike(comment._id) : alert("Please log in to dislike comments")}
                            className="flex items-center text-sm text-gray-600 hover:text-red-600"
                            disabled={!isAuthenticated}
                        >
                            <FiThumbsDown className={`mr-1 ${userDisliked ? 'text-red-600' : ''}`} />
                            {comment.dislikes.length}
                        </button>
                        <button
                            onClick={handleReplyClick}
                            className="flex items-center text-sm text-gray-600 hover:text-blue-600"
                        >
                            <FiMessageSquare className="mr-1" /> Reply
                        </button>

                        {/* Show delete button if user is the author */}
                        {isCommentAuthor && onDelete && (
                            <button
                                onClick={() => onDelete(comment._id)}
                                className="flex items-center text-sm text-gray-600 hover:text-red-600 ml-auto"
                            >
                                <FiTrash className="mr-1" /> Delete
                            </button>
                        )}
                    </div>

                    {/* Reply input - isolated in its own component */}
                    {showReplyInput && (
                        <ReplyInput
                            onSubmit={handleSubmitReply}
                            userName={comment.user.name}
                        />
                    )}

                    {/* Render replies */}
                    {comment.replies && comment.replies.length > 0 && (
                        <div className="mt-2">
                            {comment.replies.map((reply) => (
                                <CommentItem
                                    key={reply._id}
                                    comment={reply}
                                    projectId={projectId}
                                    onReply={onReply}
                                    onLike={onLike}
                                    onDislike={onDislike}
                                    onDelete={onDelete}
                                    currentUserId={currentUserId}
                                    isAuthenticated={isAuthenticated}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
});

CommentItem.displayName = 'CommentItem';

// Main Comments component
export const Comments: React.FC<CommentsProps> = memo(({
    projectId,
    comments,
    onAddComment,
    onLikeComment,
    onDislikeComment,
    onDeleteComment,
    currentUserId
}) => {
    // Get authentication status from our hook
    const { isAuthenticated = false, userId } = useCurrentUser();

    // Get comments state from our custom hook
    const commentsState = useCommentsState(projectId);

    // Use the userId from the hook if not provided directly
    const effectiveUserId = currentUserId || userId;

    // Initialize comments in the Redux store when they change from props
    useEffect(() => {
        if (comments && comments.length > 0) {
            commentsState.initializeComments(comments);
        }
    }, [comments.length, comments.map(c => c._id).join(',')]);

    // Handle adding a new comment
    const handleNewComment = useCallback((text: string) => {
        if (isAuthenticated) {
            onAddComment(text);
        } else {
            alert("You must be logged in to comment");
        }
    }, [isAuthenticated, onAddComment]);

    // Handle adding a reply
    const handleReply = useCallback((parentId: string, text: string) => {
        if (isAuthenticated) {
            onAddComment(text, parentId);
        }
    }, [isAuthenticated, onAddComment]);

    // Handle like action with optimistic UI update
    const handleLike = useCallback((commentId: string) => {
        if (!isAuthenticated || !effectiveUserId) {
            alert("Please log in to like comments");
            return;
        }

        // Optimistic UI update through Redux
        commentsState.likeComment(commentId, effectiveUserId);

        // Call the API function
        onLikeComment(commentId);
    }, [isAuthenticated, effectiveUserId, onLikeComment, commentsState]);

    // Handle dislike action with optimistic UI update
    const handleDislike = useCallback((commentId: string) => {
        if (!isAuthenticated || !effectiveUserId) {
            alert("Please log in to dislike comments");
            return;
        }

        // Optimistic UI update through Redux
        commentsState.dislikeComment(commentId, effectiveUserId);

        // Call the API function
        onDislikeComment(commentId);
    }, [isAuthenticated, effectiveUserId, onDislikeComment, commentsState]);

    // Handle deleting a comment
    const handleDelete = useCallback((commentId: string) => {
        if (onDeleteComment) {
            // Optimistic UI update
            commentsState.deleteComment(commentId);

            // Call API
            onDeleteComment(commentId);
        }
    }, [onDeleteComment, commentsState]);

    return (
        <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-xl font-semibold mb-4">Comments</h3>

            {/* Add comment form - isolated to prevent re-renders */}
            <div className="mb-6">
                <CommentInput
                    onSubmit={handleNewComment}
                    placeholder={isAuthenticated ? "Add a comment..." : "Please log in to comment"}
                    disabled={!isAuthenticated}
                />

                {!isAuthenticated && (
                    <p className="text-sm text-gray-500 mt-1">Please log in to join the conversation</p>
                )}
            </div>

            {/* Comments list */}
            <div>
                {commentsState.comments.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No comments yet. Be the first to comment!</p>
                ) : (
                    commentsState.comments.map((comment) => (
                        <CommentItem
                            key={comment._id}
                            comment={comment}
                            projectId={projectId}
                            onReply={handleReply}
                            onLike={handleLike}
                            onDislike={handleDislike}
                            onDelete={onDeleteComment ? handleDelete : undefined}
                            currentUserId={effectiveUserId}
                            isAuthenticated={isAuthenticated}
                        />
                    ))
                )}
            </div>
        </div>
    );
});

// Add display name
Comments.displayName = 'Comments';

export default Comments;
