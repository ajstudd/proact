import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { FiArrowLeft, FiMapPin, FiThumbsUp, FiThumbsDown } from "react-icons/fi";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import ProjectStats from "components/ProjectStats";
import Comments from "components/Comments";
import UpdatesTimeline from "components/UpdatesTimeline";
import PdfToSlides from "components/PdfToSlides";
import MapModal from "components/MapModal";
import ProjectStakeholders from "components/ProjectStakeholders";
import {
    useGetProjectByIdQuery,
    useLikeProjectMutation,
    useDislikeProjectMutation,
    useAddCommentMutation,
    useRemoveCommentMutation,
    useLikeCommentMutation,
    useDislikeCommentMutation
} from "@services";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { toast } from "react-toastify"; // Assuming you use react-hot-toast for notifications

const ProjectPage = () => {
    const router = useRouter();
    const { id } = router.query; // Get project ID from URL
    const [projectId, setProjectId] = useState<string | null>(null);

    // Get current user using our new hook
    const { user, isAuthenticated, userId } = useCurrentUser();

    useEffect(() => {
        if (id) {
            setProjectId(id as string);
        }
    }, [id]);

    const { data: project, error, isLoading } = useGetProjectByIdQuery(projectId!, {
        skip: !projectId,
    });

    // Get mutations for interactions
    const [likeProject] = useLikeProjectMutation();
    const [dislikeProject] = useDislikeProjectMutation();
    const [addComment] = useAddCommentMutation();
    const [removeComment] = useRemoveCommentMutation();
    const [likeComment] = useLikeCommentMutation();
    const [dislikeComment] = useDislikeCommentMutation();

    const [isMapOpen, setIsMapOpen] = useState(false);
    const [isPdfOpen, setIsPdfOpen] = useState(false);

    // Handlers for user interactions
    const handleLike = async () => {
        if (!projectId) return;

        if (!isAuthenticated) {
            toast.error("Please log in to support this project");
            // You might want to redirect to login page
            // router.push('/login');
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
            // You might want to redirect to login page
            // router.push('/login');
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

    const handleAddComment = async (comment: string, parentCommentId?: string) => {
        if (!projectId) return;

        if (!isAuthenticated) {
            toast.error("Please log in to comment");
            // You might want to redirect to login page
            // router.push('/login');
            return;
        }

        try {
            await addComment({
                projectId,
                comment,
                parentCommentId
            }).unwrap();
            toast.success("Comment added successfully");
        } catch (error) {
            console.error("Failed to add comment:", error);
            toast.error("Failed to add comment");
        }
    };

    const handleDeleteComment = async (commentId: string) => {
        if (!projectId) return;
        try {
            await removeComment({ projectId, commentId }).unwrap();
        } catch (error) {
            console.error("Failed to delete comment:", error);
        }
    };

    const handleLikeComment = async (commentId: string) => {
        if (!projectId || !isAuthenticated) {
            toast.error("You must be logged in to like comments");
            return;
        }

        try {
            await likeComment({ projectId, commentId }).unwrap();
        } catch (error) {
            console.error("Failed to like comment:", error);
        }
    };

    const handleDislikeComment = async (commentId: string) => {
        if (!projectId || !isAuthenticated) {
            toast.error("You must be logged in to dislike comments");
            return;
        }

        try {
            await dislikeComment({ projectId, commentId }).unwrap();
        } catch (error) {
            console.error("Failed to dislike comment:", error);
        }
    };

    if (isLoading) return <p className="text-center text-gray-500 mt-20">Loading...</p>;
    if (error) return <p className="text-center text-red-500 mt-20">Error loading project data.</p>;
    if (!project) return <p className="text-center text-gray-500 mt-20">Project not found.</p>;

    // Check if user has liked or disliked the project
    const userHasLiked = project.likes.includes(userId || '');
    const userHasDisliked = project.dislikes.includes(userId || '');

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
                <div className="mt-4 flex space-x-4">
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
            />

            <Comments
                projectId={project._id}
                comments={project.comments || []}
                onAddComment={handleAddComment}
                onLikeComment={handleLikeComment}
                onDislikeComment={handleDislikeComment}
                onDeleteComment={handleDeleteComment}
                currentUserId={userId || undefined}
            />

            <UpdatesTimeline updates={project.updates} />

            <PdfToSlides pdfUrl={project.pdfUrl} isOpen={isPdfOpen} onClose={() => setIsPdfOpen(false)} />
            <MapModal isOpen={isMapOpen} onClose={() => setIsMapOpen(false)} location={project.location} />
        </motion.div>
    );
};

export default ProjectPage;
