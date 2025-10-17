import { useRouter } from "next/router";
import { useState, useEffect, useCallback } from "react";
import { FiArrowLeft, FiMapPin, FiThumbsUp, FiThumbsDown, FiAlertCircle, FiBookmark } from "react-icons/fi";
import { motion } from "framer-motion";
import ProjectStats from "components/ProjectStats";
import Comments from "components/Comments";
import UpdatesTimeline from "components/UpdatesTimeline";
import PdfToSlides from "components/PdfToSlides";
import MapModal from "components/MapModal";
import ProjectStakeholders from "components/ProjectStakeholders";
import ReportModal from "components/ReportModal";
import {
    useGetProjectByIdQuery,
    useLikeProjectMutation,
    useDislikeProjectMutation,
    useAddCommentMutation,
    useRemoveCommentMutation,
    useLikeCommentMutation,
    useDislikeCommentMutation,
    useAddProjectUpdateMutation,
    useEditProjectUpdateMutation,
    useRemoveProjectUpdateMutation
} from "@services";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { useAuth } from "../../contexts/AuthContext";
import { useRBAC } from "../../hooks/useRBAC";
import { useBookmarks } from "../../hooks/useBookmarks";
import { toast } from "react-toastify";
import { useForm, useFieldArray } from "react-hook-form";
interface InventoryItem {
    name: string;
    quantity: number;
    price: number;
    totalSpent?: number;
}

interface AddUpdateFormData {
    content: string;
    items: {
        name: string;
        quantity: number;
        price: number;
        type: "purchased" | "used";
    }[];
}

type AddCommentHandler = (comment: string, parentCommentId?: string) => Promise<void>;
type DeleteCommentHandler = (commentId: string) => Promise<void>;
type LikeDislikeCommentHandler = (commentId: string) => Promise<void>;

const ProjectPage = () => {
    const router = useRouter();
    const { id } = router.query;
    const [projectId, setProjectId] = useState<string | null>(null);

    const { user, isAuthenticated, userId } = useCurrentUser();
    const auth = useAuth();
    const { isGovernment, isContractor } = useRBAC();

    const {
        isProjectBookmarked,
        toggleBookmark,
        isBookmarking
    } = useBookmarks();

    const [isMapOpen, setIsMapOpen] = useState(false);
    const [isPdfOpen, setIsPdfOpen] = useState(false);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);

    const [showAddUpdate, setShowAddUpdate] = useState(false);

    useEffect(() => {
        if (id) {
            setProjectId(id as string);
        }
    }, [id]);

    const { data: project, error, isLoading } = useGetProjectByIdQuery(projectId!, {
        skip: !projectId,
    });

    const [likeProject] = useLikeProjectMutation();
    const [dislikeProject] = useDislikeProjectMutation();
    const [addComment] = useAddCommentMutation();
    const [removeComment] = useRemoveCommentMutation();
    const [likeComment] = useLikeCommentMutation();
    const [dislikeComment] = useDislikeCommentMutation();

    const [addProjectUpdate] = useAddProjectUpdateMutation();
    const [editProjectUpdate] = useEditProjectUpdateMutation();
    const [removeProjectUpdate] = useRemoveProjectUpdateMutation();

    const [localComments, setLocalComments] = useState<any[]>([]);

    useEffect(() => {
        if (project?.comments) {
            setLocalComments(project.comments);
        }
    }, [project?.comments]);

    const handleBookmarkToggle = async () => {
        if (!projectId) return;

        if (!isAuthenticated) {
            toast.error("Please log in to bookmark this project");
            return;
        }

        try {
            const result = await toggleBookmark(projectId);
            if (result.success) {
                const message = isProjectBookmarked(projectId)
                    ? "Project removed from bookmarks"
                    : "Project added to bookmarks";
                toast.success(message);
            } else if (result.message) {
                toast.error(result.message);
            }
        } catch (error) {
            console.error("Failed to toggle bookmark:", error);
            toast.error("Failed to update bookmark status");
        }
    };

    const handleLike = async () => {
        if (!projectId) return;

        if (!isAuthenticated) {
            toast.error("Please log in to support this project");
            return;
        }

        try {
            await likeProject(projectId).unwrap();
            toast.success("Project supported successfully");
        } catch (error) {
            console.error("Failed to like project:", error);
            toast.error("Failed to support project");
        }
    };

    const handleDislike = async () => {
        if (!projectId) return;

        if (!isAuthenticated) {
            toast.error("Please log in to oppose this project");
            return;
        }

        try {
            await dislikeProject(projectId).unwrap();
            toast.success("Project opposed successfully");
        } catch (error) {
            console.error("Failed to dislike project:", error);
            toast.error("Failed to oppose project");
        }
    };

    const handleAddComment: AddCommentHandler = useCallback(async (comment, parentCommentId) => {
        if (!projectId) return;

        if (!isAuthenticated) {
            toast.error("Please log in to comment");
            return;
        }

        try {
            const response = await addComment({
                projectId,
                comment,
                parentCommentId
            }).unwrap();
            console.log('response in comment', response)

            if (response && response.comment) {
                setLocalComments(prevComments => {
                    if (parentCommentId) {
                        return prevComments.map(c => {
                            if (c._id === parentCommentId) {
                                const replies = Array.isArray(c.replies) ? [...c.replies] : [];
                                return {
                                    ...c,
                                    replies: [...replies, response.comment]
                                };
                            }
                            return c;
                        });
                    }
                    return [response.comment, ...prevComments];
                });
            }

            toast.success(parentCommentId ? "Reply added successfully" : "Comment added successfully");
        } catch (error) {
            console.error("Failed to add comment:", error);
            toast.error("Failed to add comment");
        }
    }, [projectId, isAuthenticated, addComment]);

    const handleDeleteComment: DeleteCommentHandler = useCallback(async (commentId) => {
        if (!projectId) return;
        try {
            await removeComment({ projectId, commentId }).unwrap();
            setLocalComments(prevComments => {
                const topLevelFiltered = prevComments.filter(c => c._id !== commentId);

                if (topLevelFiltered.length < prevComments.length) {
                    return topLevelFiltered;
                }

                return prevComments.map(c => ({
                    ...c,
                    replies: (c.replies || []).filter((r: any) => r?._id !== commentId)
                }));
            });
            toast.success("Comment deleted successfully");
        } catch (error) {
            console.error("Failed to delete comment:", error);
            toast.error("Failed to delete comment");

            if (project?.comments) {
                setLocalComments(project.comments);
            }
        }
    }, [projectId, removeComment, project?.comments]);

    const handleLikeComment: LikeDislikeCommentHandler = useCallback(async (commentId) => {
        if (!projectId || !isAuthenticated) {
            toast.error("You must be logged in to like comments");
            return;
        }

        try {
            await likeComment({ projectId, commentId }).unwrap();
        } catch (error) {
            console.error("Failed to like comment:", error);
            toast.error("Failed to like comment");
        }
    }, [projectId, isAuthenticated, likeComment]);

    const handleDislikeComment: LikeDislikeCommentHandler = useCallback(async (commentId) => {
        if (!projectId || !isAuthenticated) {
            toast.error("You must be logged in to dislike comments");
            return;
        }

        try {
            await dislikeComment({ projectId, commentId }).unwrap();
        } catch (error) {
            console.error("Failed to dislike comment:", error);
            toast.error("Failed to dislike comment");
        }
    }, [projectId, isAuthenticated, dislikeComment]);

    // Determine if the current user can manage this project
    const canManageProject = isAuthenticated &&
        ((isGovernment && project?.government?._id === userId) ||
            (isContractor && project?.contractor?._id === userId));

    const { register, control, handleSubmit, reset, watch } = useForm<AddUpdateFormData>({
        defaultValues: {
            content: "",
            items: [{ name: "", quantity: 1, price: 0, type: "purchased" as const }]
        }
    });
    const { fields, append, remove } = useFieldArray({
        control,
        name: "items"
    });
    const watchedItems = watch("items");

    if (isLoading || !project) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <span className="text-gray-500 text-lg">Loading project...</span>
            </div>
        );
    }
    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <span className="text-red-500 text-lg">Failed to load project.</span>
            </div>
        );
    }

    const totalSpentOnItems = project.inventory?.reduce((sum: number, item: InventoryItem) => sum + (item.totalSpent || 0), 0) || 0;

    const onAddUpdateFormSubmit = async (data: AddUpdateFormData) => {
        const purchasedItems = data.items.filter(i => i.type === "purchased").map(({ type, ...rest }) => rest);
        const utilisedItems = data.items.filter(i => i.type === "used").map(({ type, price, ...rest }) => rest);
        await handleAddUpdate(data.content, undefined, purchasedItems, utilisedItems);
        reset();
        setShowAddUpdate(false);
    };

    const handleAddUpdate = async (
        content: string,
        mediaFiles?: File[],
        purchasedItems?: any[],
        utilisedItems?: any[],
    ) => {
        if (!projectId || !isAuthenticated) {
            toast.error("You must be logged in to add updates");
            return;
        }

        try {
            await addProjectUpdate({
                projectId,
                content,
                media: mediaFiles,
                purchasedItems,
                utilisedItems
            }).unwrap();
            toast.success("Project update added successfully");
        } catch (error) {
            console.error("Failed to add update:", error);
            toast.error("Failed to add update");
        }
    };

    // Add these handler stubs before the return statement
    const handleEditUpdate = async (
        updateId: string,
        content: string,
        mediaFiles?: File[],
        keepExistingMedia?: boolean
    ) => {
        if (!projectId || !isAuthenticated) {
            toast.error("You must be logged in to edit updates");
            return;
        }
        try {
            await editProjectUpdate({
                projectId,
                updateId,
                content,
                media: mediaFiles,
                keepExistingMedia
            }).unwrap();
            toast.success("Project update edited successfully");
        } catch (error) {
            console.error("Failed to edit update:", error);
            toast.error("Failed to edit update");
        }
    };

    const handleDeleteUpdate = async (updateId: string) => {
        if (!projectId || !isAuthenticated) {
            toast.error("You must be logged in to delete updates");
            return;
        }
        try {
            await removeProjectUpdate({
                projectId,
                updateId
            }).unwrap();
            toast.success("Project update deleted successfully");
        } catch (error) {
            console.error("Failed to delete update:", error);
            toast.error("Failed to delete update");
        }
    };

    const projectIsBookmarked = projectId ? isProjectBookmarked(projectId) : false;
    const userHasLiked = isAuthenticated && project.likes?.includes(userId);
    const userHasDisliked = isAuthenticated && project.dislikes?.includes(userId);

    const canManageUpdates = isAuthenticated &&
        ((isGovernment && project.government?._id === userId) ||
            (isContractor && project.contractor?._id === userId));

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-gray-100 p-6"
        >
            <button
                onClick={() => router.back()}
                className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
            >
                <FiArrowLeft /> <span>Back to Projects</span>
            </button>

            <div className="relative bg-white p-6 rounded-lg shadow-lg mt-4">
                <div className="absolute top-4 right-4 z-10">
                    <button
                        onClick={handleBookmarkToggle}
                        disabled={isBookmarking}
                        className={`p-2 rounded-full ${projectIsBookmarked
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                            } transition-colors`}
                        aria-label={projectIsBookmarked ? "Remove bookmark" : "Add bookmark"}
                    >
                        <FiBookmark
                            className={`${projectIsBookmarked ? 'fill-current' : ''}`}
                            size={20}
                        />
                    </button>
                </div>
                <img src={project.bannerUrl} alt={project.title} className="w-full h-64 object-cover rounded-lg" />
                <h1 className="text-3xl font-bold text-gray-900 mt-4">{project.title}</h1>
                <p className="text-gray-700 mt-2">{project.description}</p>
                <div className="flex items-center justify-between mt-4 text-gray-700">
                    <div className="flex items-center">
                        <FiMapPin className="mr-1 text-red-500" />
                        {project.location.place}
                    </div>
                    <div className="flex items-center space-x-3">
                        <span className="flex items-center">
                            <FiThumbsUp className="mr-1 text-green-500" /> {project.likes.length}
                        </span>
                        <span className="flex items-center">
                            <FiThumbsDown className="mr-1 text-red-500" /> {project.dislikes.length}
                        </span>
                    </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                    <button
                        onClick={() => setIsPdfOpen(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                    >
                        View Project PDF
                    </button>
                    <button
                        onClick={() => setIsMapOpen(true)}
                        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
                    >
                        View Map Location
                    </button>
                    {/* Report corruption button always available to all users */}
                    <button
                        onClick={() => setIsReportModalOpen(true)}
                        className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition flex items-center"
                    >
                        <FiAlertCircle className="mr-2" /> Report Corruption
                    </button>
                </div>
            </div>

            <ProjectStakeholders
                contractor={project.contractor}
                government={project.government}
            />

            <ProjectStats
                budget={project.budget}
                expenditure={project.expenditure}
                likesCount={project.likes.length}
                dislikesCount={project.dislikes.length}
                createdAt={project.createdAt}
                onLike={handleLike}
                onDislike={handleDislike}
                userHasLiked={userHasLiked}
                userHasDisliked={userHasDisliked}
                isAuthenticated={isAuthenticated} // Pass authentication status
                projectId={project._id} // Pass projectId
                canManageProject={canManageProject} // Pass management permissions
            />

            {/* Redesigned Inventory & Usage Analysis */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-lg font-semibold mb-4">Inventory & Usage Analysis</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h4 className="font-medium mb-2">Inventory</h4>
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm border-separate border-spacing-y-2">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="px-2 py-1 text-left font-semibold">Name</th>
                                        <th className="px-2 py-1 text-left font-semibold">Quantity</th>
                                        <th className="px-2 py-1 text-left font-semibold">Unit Price</th>
                                        <th className="px-2 py-1 text-left font-semibold">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {project.inventory && project.inventory.length > 0 ? (
                                        project.inventory.map((item: any, idx: any) => (
                                            <tr key={idx} className="bg-white even:bg-gray-50">
                                                <td className="px-2 py-1">{item.name}</td>
                                                <td className="px-2 py-1">{item.quantity}</td>
                                                <td className="px-2 py-1">₹{item.price}</td>
                                                <td className="px-2 py-1 font-semibold">₹{item.totalSpent}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className="text-gray-500 px-2 py-2">No inventory items.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div className="mt-2 text-gray-600 text-xs">
                            <span className="font-semibold">Total spent on items:</span> ₹{totalSpentOnItems}
                        </div>
                    </div>
                    <div>
                        <h4 className="font-medium mb-2">Used Items</h4>
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm border-separate border-spacing-y-2">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="px-2 py-1 text-left font-semibold">Name</th>
                                        <th className="px-2 py-1 text-left font-semibold">Quantity Used</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {project.usedItems && project.usedItems.length > 0 ? (
                                        project.usedItems.map((item: any, idx: any) => (
                                            <tr key={idx} className="bg-white even:bg-gray-50">
                                                <td className="px-2 py-1">{item.name}</td>
                                                <td className="px-2 py-1">{item.quantity}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={2} className="text-gray-500 px-2 py-2">No items used yet.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {canManageUpdates && (
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <button
                        onClick={() => setShowAddUpdate(!showAddUpdate)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md mb-4"
                    >
                        {showAddUpdate ? "Cancel" : "Update Inventory"}
                    </button>
                    {showAddUpdate && (
                        <form onSubmit={handleSubmit(onAddUpdateFormSubmit)}>
                            <div className="mb-3">
                                <label className="block font-medium mb-1">Update Content</label>
                                <textarea
                                    {...register("content", { required: true })}
                                    className="w-full border rounded px-3 py-2"
                                    rows={3}
                                    placeholder="Describe the update and any item utilisation..."
                                />
                            </div>
                            <div className="mb-3">
                                <label className="block font-medium mb-1">Items</label>
                                <div className="space-y-2">
                                    {fields.map((field, idx) => {
                                        const item = watchedItems?.[idx] || {};
                                        const total = (item.quantity || 0) * (item.price || 0);
                                        return (
                                            <div key={field.id} className="flex flex-col sm:flex-row gap-2 items-center">
                                                <input
                                                    {...register(`items.${idx}.name`, { required: true })}
                                                    placeholder="Name"
                                                    className="border rounded px-2 py-1 flex-1 min-w-[100px]"
                                                />
                                                <input
                                                    {...register(`items.${idx}.quantity`, { valueAsNumber: true, required: true })}
                                                    type="number"
                                                    min={1}
                                                    placeholder="Quantity"
                                                    className="border rounded px-2 py-1 w-20"
                                                />
                                                <input
                                                    {...register(`items.${idx}.price`, { valueAsNumber: true })}
                                                    type="number"
                                                    min={0}
                                                    placeholder="Price"
                                                    className="border rounded px-2 py-1 w-24"
                                                    disabled={item.type === "used"}
                                                />
                                                <select
                                                    {...register(`items.${idx}.type`)}
                                                    className="border rounded px-2 py-1"
                                                >
                                                    <option value="purchased">Purchased</option>
                                                    <option value="used">Used</option>
                                                </select>
                                                <span className="text-xs text-gray-700">
                                                    {item.type === "purchased"
                                                        ? <>Total: <span className="font-semibold">₹{total}</span></>
                                                        : null}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => remove(idx)}
                                                    className="text-red-500 text-xs ml-2"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        );
                                    })}
                                    <button
                                        type="button"
                                        onClick={() => append({ name: "", quantity: 1, price: 0, type: "purchased" })}
                                        className="text-blue-600 mt-2 text-sm"
                                    >
                                        + Add Item
                                    </button>
                                </div>
                            </div>
                            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-md w-full sm:w-auto">
                                Submit Update
                            </button>
                        </form>
                    )}
                </div>
            )}

            <UpdatesTimeline
                updates={project.updates || []}
                projectId={project._id}
                onAddUpdate={handleAddUpdate}
                onEditUpdate={handleEditUpdate}
                onDeleteUpdate={handleDeleteUpdate}
                canManageUpdates={canManageUpdates}
                isAuthenticated={isAuthenticated}
            />

            <Comments
                projectId={project._id}
                comments={project.comments || []}
                onAddComment={handleAddComment}
                onLikeComment={handleLikeComment}
                onDislikeComment={handleDislikeComment}
                onDeleteComment={handleDeleteComment}
                currentUserId={userId || undefined}
                isAuthenticated={isAuthenticated} // Pass authentication status explicitly
            />

            <PdfToSlides pdfUrl={project.pdfUrl} isOpen={isPdfOpen} onClose={() => setIsPdfOpen(false)} />
            <MapModal isOpen={isMapOpen} onClose={() => setIsMapOpen(false)} location={project.location} />

            {/* Report corruption modal - available to all users */}
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
                style={{ display: isReportModalOpen ? "flex" : "none" }}
            >
                <ReportModal
                    isOpen={isReportModalOpen}
                    onClose={() => setIsReportModalOpen(false)}
                    projectId={project._id}
                    projectTitle={project.title}
                />
            </div>
        </motion.div>
    );
};

export default ProjectPage;
