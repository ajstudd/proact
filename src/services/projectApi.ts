import { api } from "./api";

export const projectApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createProject: builder.mutation({
      query: (projectPayload) => ({
        url: "/projects",
        method: "POST",
        body: projectPayload,
      }),
    }),
  }),
});

export const { useCreateProjectMutation } = projectApi;
