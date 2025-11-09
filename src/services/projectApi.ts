import { api } from "./api";
import { getCurrentUserId, getAuthToken } from "../utils/authUtils";
import { ProjectSearchResponse } from "../types";

export const projectApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createProject: builder.mutation({
      query: (formData) => {
        const token = getAuthToken();
        return {
          url: "/create",
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
      },
      invalidatesTags: ["Projects"],
    }),

    getAllProjects: builder.query({
      query: () => "/",
      providesTags: ["Projects"],
      transformResponse: (response: any) => {
        if (response.status === "error") {
          throw new Error(response.message);
        }
        return response.projects;
      },
    }),

    getProjectById: builder.query({
      query: (id) => `/${id}`,
      transformResponse: (response: any) => {
        if (response.status === "error") {
          throw new Error(response.message);
        }
        return response.project;
      },
      providesTags: (result, error, id) => [{ type: "Projects", id }],
    }),

    getTrimmedProjects: builder.query({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();

        if (params.userId) {
          queryParams.append("userId", params.userId);
        }

        Object.entries(params).forEach(([key, value]) => {
          if (key !== "userId" && value !== undefined && value !== null) {
            queryParams.append(key, value.toString());
          }
        });

        const queryString = queryParams.toString();
        return `/trimmed${queryString ? `?${queryString}` : ""}`;
      },
      transformResponse: (response: any) => {
        if (response.status === "error") {
          throw new Error(response.message);
        }
        return response.projects;
      },
      providesTags: ["Projects"],
    }),

    updateProject: builder.mutation({
      query: ({ id, projectData }) => ({
        url: `/${id}`,
        method: "PUT",
        body: projectData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Projects", id }],
    }),

    deleteProject: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Projects"],
    }),

    searchProjects: builder.query({
      query: (params) => {
        const { query, limit, page, sortBy, sortOrder, ...filters } = params;
        const queryParams = new URLSearchParams();

        if (query) queryParams.append("query", query);
        if (limit) queryParams.append("limit", limit.toString());
        if (page) queryParams.append("page", page.toString());
        if (sortBy) queryParams.append("sortBy", sortBy);
        if (sortOrder) queryParams.append("sortOrder", sortOrder);

        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            queryParams.append(key, value.toString());
          }
        });

        return `/search?${queryParams.toString()}`;
      },
      transformResponse: (response: any) => {
        if (response.status === "error") {
          throw new Error(response.message);
        }
        return response;
      },
    }),

    fastSearchProjects: builder.query<
      ProjectSearchResponse,
      {
        title?: string;
        description?: string;
        location?: string;
        startDate?: string;
        endDate?: string;
        id?: string;
        limit?: number;
        page?: number;
      }
    >({
      query: (params) => {
        const queryParams = new URLSearchParams();

        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            queryParams.append(key, value.toString());
          }
        });

        return `/fast-search?${queryParams.toString()}`;
      },
      transformResponse: (response: any) => {
        if (response.status === "error") {
          throw new Error(response.message);
        }
        return response;
      },
    }),

    getProjectUpdates: builder.query({
      query: (projectId) => `/${projectId}/updates`,
      transformResponse: (response: any) => {
        if (response.status === "error") {
          throw new Error(response.message);
        }
        return response.updates;
      },
      providesTags: (result, error, projectId) => [
        { type: "Projects", id: projectId },
      ],
    }),

    addProjectUpdate: builder.mutation({
      query: ({ projectId, content, media, purchasedItems, utilisedItems }) => {
        const formData = new FormData();
        formData.append("content", content);
        if (media && media.length > 0) {
          media.forEach((file: any) => {
            formData.append("media", file);
          });
        }
        if (purchasedItems && purchasedItems.length > 0) {
          formData.append("purchasedItems", JSON.stringify(purchasedItems));
        }
        if (utilisedItems && utilisedItems.length > 0) {
          formData.append("utilisedItems", JSON.stringify(utilisedItems));
        }
        return {
          url: `/${projectId}/updates`,
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: (result, error, { projectId }) => [
        { type: "Projects", id: projectId },
      ],
    }),

    editProjectUpdate: builder.mutation({
      query: ({ projectId, updateId, content, media, keepExistingMedia }) => {
        const formData = new FormData();
        formData.append("content", content);

        if (keepExistingMedia !== undefined) {
          formData.append("keepExistingMedia", String(keepExistingMedia));
        }

        if (media && media.length > 0) {
          media.forEach((file: any) => {
            formData.append("media", file);
          });
        }

        return {
          url: `/${projectId}/updates/${updateId}`,
          method: "PUT",
          body: formData,
        };
      },
      invalidatesTags: (result, error, { projectId }) => [
        { type: "Projects", id: projectId },
      ],
    }),

    removeProjectUpdate: builder.mutation({
      query: ({ projectId, updateId }) => ({
        url: `/${projectId}/updates/${updateId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { projectId }) => [
        { type: "Projects", id: projectId },
      ],
    }),

    updateProjectExpenditure: builder.mutation({
      query: ({ projectId, expenditure }) => ({
        url: `/${projectId}/expenditure`,
        method: "PUT",
        body: { expenditure },
      }),
      invalidatesTags: (result, error, { projectId }) => [
        { type: "Projects", id: projectId },
      ],
    }),

    likeProject: builder.mutation({
      query: (projectId) => {
        const userId = getCurrentUserId();
        return {
          url: `/interaction/${projectId}/like`,
          method: "POST",
          body: { userId },
        };
      },
      invalidatesTags: (result, error, projectId) => [
        { type: "Projects", id: projectId },
      ],
    }),

    dislikeProject: builder.mutation({
      query: (projectId) => {
        const userId = getCurrentUserId();
        return {
          url: `/interaction/${projectId}/dislike`,
          method: "POST",
          body: { userId },
        };
      },
      invalidatesTags: (result, error, projectId) => [
        { type: "Projects", id: projectId },
      ],
    }),

    addComment: builder.mutation({
      query: ({ projectId, comment, parentCommentId }) => {
        const userId = getCurrentUserId();
        return {
          url: `/comments`,
          method: "POST",
          body: {
            content: comment,
            projectId,
            userId,
            parentComment: parentCommentId || null,
          },
        };
      },
      transformResponse: (response: any) => {
        if (response.status === "error") {
          throw new Error(response.message);
        }
        return response;
      },
      invalidatesTags: (result, error, { projectId }) => [
        { type: "Projects", id: projectId },
      ],
    }),

    removeComment: builder.mutation({
      query: ({ projectId, commentId }) => {
        return {
          url: `/comments/${commentId}`,
          method: "DELETE",
        };
      },
      invalidatesTags: (result, error, { projectId }) => [
        { type: "Projects", id: projectId },
      ],
    }),

    likeComment: builder.mutation({
      query: ({ projectId, commentId }) => {
        const userId = getCurrentUserId();
        return {
          url: `/comments/${commentId}/like`,
          method: "POST",
          body: { userId },
        };
      },
      invalidatesTags: (result, error, { projectId }) => [
        { type: "Projects", id: projectId },
      ],
    }),

    dislikeComment: builder.mutation({
      query: ({ projectId, commentId }) => {
        const userId = getCurrentUserId();
        return {
          url: `/comments/${commentId}/dislike`,
          method: "POST",
          body: { userId },
        };
      },
      invalidatesTags: (result, error, { projectId }) => [
        { type: "Projects", id: projectId },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateProjectMutation,
  useGetAllProjectsQuery,
  useGetProjectByIdQuery,
  useGetTrimmedProjectsQuery,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  useSearchProjectsQuery,
  useFastSearchProjectsQuery,
  useGetProjectUpdatesQuery,
  useAddProjectUpdateMutation,
  useEditProjectUpdateMutation,
  useRemoveProjectUpdateMutation,
  useUpdateProjectExpenditureMutation,
  useLikeProjectMutation,
  useDislikeProjectMutation,
  useAddCommentMutation,
  useRemoveCommentMutation,
  useLikeCommentMutation,
  useDislikeCommentMutation,
} = projectApi;
