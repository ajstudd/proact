import React, { useState, useEffect, useRef, useCallback, memo } from "react";
import { motion } from "framer-motion";
import { FiSend, FiThumbsUp, FiThumbsDown, FiTrash, FiMessageSquare } from "react-icons/fi";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { useCommentsState, Comment } from "../hooks/useCommentsState";
import { useDispatch } from "react-redux";
import { useAddCommentMutation } from "../services/projectApi";

interface CommentsProps {
    projectId: string;
    comments: Comment[];
    onAddComment: (text: string, parentId?: string) => void;
    onLikeComment: (commentId: string) => void;
    onDislikeComment: (commentId: string) => void;
    onDeleteComment?: (commentId: string) => void;
    currentUserId?: string;
    isAuthenticated?: boolean;
}

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
    const dispatch = useDispatch();

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

    const isAlreadyAReply = Boolean(comment.parentComment);

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
                    src={comment.user?.photo || "https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI="}
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

                        {!isAlreadyAReply && (
                            <button
                                onClick={handleReplyClick}
                                className="flex items-center text-sm text-gray-600 hover:text-blue-600"
                            >
                                <FiMessageSquare className="mr-1" /> Reply
                            </button>
                        )}

                        {isCommentAuthor && onDelete && (
                            <button
                                onClick={() => onDelete(comment._id)}
                                className="flex items-center text-sm text-gray-600 hover:text-red-600 ml-auto"
                            >
                                <FiTrash className="mr-1" /> Delete
                            </button>
                        )}
                    </div>

                    {showReplyInput && (
                        <ReplyInput
                            onSubmit={handleSubmitReply}
                            userName={comment.user.name}
                        />
                    )}

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

export const Comments: React.FC<CommentsProps> = memo(({
    projectId,
    comments,
    onAddComment,
    onLikeComment,
    onDislikeComment,
    onDeleteComment,
    currentUserId
}) => {
    const { isAuthenticated = false, userId } = useCurrentUser();

    const commentsState = useCommentsState(projectId);

    const [addCommentMutation] = useAddCommentMutation();

    const [commentVersion, setCommentVersion] = useState(0);

    const effectiveUserId = currentUserId || userId;

    useEffect(() => {
        if (comments && comments.length > 0) {
            commentsState.initializeComments(comments);
            setCommentVersion(prev => prev + 1);
        }
    }, [comments.length, comments.map(c => c._id).join(',')]);

    const handleNewComment = useCallback((text: string) => {
        if (isAuthenticated) {
            onAddComment(text);
        } else {
            alert("You must be logged in to comment");
        }
    }, [isAuthenticated, onAddComment]);

    const handleReply = useCallback((parentId: string, text: string) => {
        if (isAuthenticated) {
            addCommentMutation({
                projectId,
                comment: text,
                parentCommentId: parentId
            })
                .unwrap()
                .then(response => {
                    if (response && response.comment) {
                        commentsState.addReply(parentId, response.comment);
                    }

                    onAddComment(text, parentId);
                })
                .catch(error => {
                    console.error("Failed to add reply:", error);
                });
        }
    }, [isAuthenticated, projectId, addCommentMutation, commentsState, onAddComment]);

    const handleLike = useCallback((commentId: string) => {
        if (!isAuthenticated || !effectiveUserId) {
            alert("Please log in to like comments");
            return;
        }

        commentsState.likeComment(commentId, effectiveUserId);

        onLikeComment(commentId);
    }, [isAuthenticated, effectiveUserId, onLikeComment, commentsState]);

    const handleDislike = useCallback((commentId: string) => {
        if (!isAuthenticated || !effectiveUserId) {
            alert("Please log in to dislike comments");
            return;
        }

        commentsState.dislikeComment(commentId, effectiveUserId);

        onDislikeComment(commentId);
    }, [isAuthenticated, effectiveUserId, onDislikeComment, commentsState]);

    const handleDelete = useCallback((commentId: string) => {
        if (onDeleteComment) {
            commentsState.deleteComment(commentId);

            onDeleteComment(commentId);
        }
    }, [onDeleteComment, commentsState]);

    return (
        <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-xl font-semibold mb-4">Comments</h3>

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

Comments.displayName = 'Comments';

export default Comments;
