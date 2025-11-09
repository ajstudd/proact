import {
  useBookmarkProjectMutation,
  useRemoveBookmarkMutation,
  useGetBookmarkedProjectsQuery,
} from "../services/userApi";
import { useState, useEffect } from "react";
import { useCurrentUser } from "./useCurrentUser";

export const useBookmarks = () => {
  const { isAuthenticated } = useCurrentUser();
  const [bookmarkedProjects, setBookmarkedProjects] = useState<string[]>([]);

  const [
    bookmarkProject,
    {
      isLoading: isBookmarking,
      isError: isBookmarkError,
      error: bookmarkError,
    },
  ] = useBookmarkProjectMutation();

  const [
    removeBookmark,
    { isLoading: isRemoving, isError: isRemoveError, error: removeError },
  ] = useRemoveBookmarkMutation();

  const {
    data: bookmarksData,
    isLoading: isLoadingBookmarks,
    refetch: refetchBookmarks,
  } = useGetBookmarkedProjectsQuery(undefined, {
    skip: !isAuthenticated,
  });

  useEffect(() => {
    if (bookmarksData?.bookmarks) {
      const projectIds = bookmarksData.bookmarks.map(
        (project: any) => project._id
      );
      setBookmarkedProjects(projectIds);
    }
  }, [bookmarksData]);

  const isProjectBookmarked = (projectId: string) => {
    return bookmarkedProjects.includes(projectId);
  };

  const toggleBookmark = async (projectId: string) => {
    if (!isAuthenticated) {
      return {
        success: false,
        message: "You need to be logged in to bookmark projects",
      };
    }

    try {
      if (isProjectBookmarked(projectId)) {
        await removeBookmark(projectId).unwrap();
        setBookmarkedProjects((prev) => prev.filter((id) => id !== projectId));
      } else {
        await bookmarkProject({ projectId }).unwrap();
        setBookmarkedProjects((prev) => [...prev, projectId]);
      }
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        message: error.data?.message || "Failed to update bookmark status",
      };
    }
  };

  return {
    bookmarkedProjects,
    isProjectBookmarked,
    toggleBookmark,
    isBookmarking: isBookmarking || isRemoving,
    isBookmarkError: isBookmarkError || isRemoveError,
    bookmarkError: bookmarkError || removeError,
    isLoadingBookmarks,
    refetchBookmarks,
  };
};

export default useBookmarks;
