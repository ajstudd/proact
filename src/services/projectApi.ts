import { api } from "./api";

export const projectApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Project CRUD operations
    createProject: builder.mutation({
      query: (formData) => ({
        url: "/create",
        method: "POST",
        body: formData,
      }),
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
      query: () => "/trimmed",
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

    // Project search and filter
    searchProjects: builder.query({
      query: (params) => {
        const { query, limit, page, sortBy, sortOrder, ...filters } = params;
        const queryParams = new URLSearchParams();

        if (query) queryParams.append("query", query);
        if (limit) queryParams.append("limit", limit.toString());
        if (page) queryParams.append("page", page.toString());
        if (sortBy) queryParams.append("sortBy", sortBy);
        if (sortOrder) queryParams.append("sortOrder", sortOrder);

        // Add any filters
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

    // Project updates
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
      query: ({ projectId, updateData }) => ({
        url: `/${projectId}/updates`,
        method: "POST",
        body: updateData,
      }),
      invalidatesTags: (result, error, { projectId }) => [
        { type: "Projects", id: projectId },
      ],
    }),

    editProjectUpdate: builder.mutation({
      query: ({ projectId, updateId, updateData }) => ({
        url: `/${projectId}/updates/${updateId}`,
        method: "PUT",
        body: updateData,
      }),
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

    // Project interactions (likes/dislikes)
    likeProject: builder.mutation({
      query: (projectId) => ({
        url: `/interaction/${projectId}/like`,
        method: "POST",
      }),
      invalidatesTags: (result, error, projectId) => [
        { type: "Projects", id: projectId },
      ],
    }),

    dislikeProject: builder.mutation({
      query: (projectId) => ({
        url: `/interaction/${projectId}/dislike`,
        method: "POST",
      }),
      invalidatesTags: (result, error, projectId) => [
        { type: "Projects", id: projectId },
      ],
    }),

    // Comments
    addComment: builder.mutation({
      query: ({ projectId, comment, parentCommentId }) => ({
        url: `/comments/${projectId}`,
        method: "POST",
        body: {
          content: comment,
          parentComment: parentCommentId || null,
        },
      }),
      invalidatesTags: (result, error, { projectId }) => [
        { type: "Projects", id: projectId },
      ],
    }),

    removeComment: builder.mutation({
      query: ({ projectId, commentId }) => ({
        url: `/comments/${projectId}/${commentId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { projectId }) => [
        { type: "Projects", id: projectId },
      ],
    }),

    likeComment: builder.mutation({
      query: ({ projectId, commentId }) => ({
        url: `/comments/${projectId}/${commentId}/like`,
        method: "POST",
      }),
      invalidatesTags: (result, error, { projectId }) => [
        { type: "Projects", id: projectId },
      ],
    }),

    dislikeComment: builder.mutation({
      query: ({ projectId, commentId }) => ({
        url: `/comments/${projectId}/${commentId}/dislike`,
        method: "POST",
      }),
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
  useGetProjectUpdatesQuery,
  useAddProjectUpdateMutation,
  useEditProjectUpdateMutation,
  useRemoveProjectUpdateMutation,
  useLikeProjectMutation,
  useDislikeProjectMutation,
  useAddCommentMutation,
  useRemoveCommentMutation,
  useLikeCommentMutation,
  useDislikeCommentMutation,
} = projectApi;
