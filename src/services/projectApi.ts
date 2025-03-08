import { api } from "./api";

export const projectApi = api.injectEndpoints({
  endpoints: (builder) => ({
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
    }),

    getProjectById: builder.query({
      query: (id) => `/${id}`,

      transformResponse: (response: any) => {
        if (response.status === "error") {
          throw new Error(response.message);
        }
        return response.project;
      },
      providesTags: ["Projects"],
    }),

    getTrimmedProjects: builder.query({
      query: () => "/trimmed",
    }),

    updateProject: builder.mutation({
      query: ({ id, projectData }) => ({
        url: `/${id}`,
        method: "PUT",
        body: projectData,
      }),
      invalidatesTags: ["Projects"],
    }),

    deleteProject: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Projects"],
    }),

    uploadFile: builder.mutation({
      query: (formData) => ({
        url: "/create",
        method: "POST",
        body: formData,
      }),
    }),
  }),
});

export const {
  useCreateProjectMutation,
  useGetAllProjectsQuery,
  useGetProjectByIdQuery,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  useUploadFileMutation,
} = projectApi;
