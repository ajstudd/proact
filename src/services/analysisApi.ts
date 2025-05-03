import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getAuthToken } from "../utils/authUtils";

const API_URL: string | undefined = process.env.NEXT_PUBLIC_API_URL;

export const analysisApi = createApi({
  reducerPath: "analysisApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}/analysis`,
    prepareHeaders: (headers) => {
      // Add auth token to every request
      const token = getAuthToken();
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // Get aggregate analysis for government dashboard
    getGovernmentDashboard: builder.query<GovernmentDashboardResponse, void>({
      query: () => `/dashboard`,
      transformResponse: (response: {
        success: boolean;
        analysis: any;
        message: string;
      }) => {
        if (!response.success) {
          throw new Error(
            response.message || "Failed to fetch government dashboard data"
          );
        }
        return response.analysis;
      },
    }),

    // Get detailed analysis for a specific project
    getProjectAnalysis: builder.query<ProjectAnalysisResponse, string>({
      query: (projectId) => `/project/${projectId}`,
      transformResponse: (response: {
        success: boolean;
        analysis: any;
        message: string;
      }) => {
        if (!response.success) {
          throw new Error(
            response.message || "Failed to fetch project analysis"
          );
        }
        return response.analysis;
      },
    }),

    // Manually trigger regeneration of project analysis
    regenerateProjectAnalysis: builder.mutation<
      ProjectAnalysisResponse,
      string
    >({
      query: (projectId) => ({
        url: `/project/${projectId}/regenerate`,
        method: "POST",
      }),
      transformResponse: (response: {
        success: boolean;
        analysis: any;
        message: string;
      }) => {
        if (!response.success) {
          throw new Error(
            response.message || "Failed to regenerate project analysis"
          );
        }
        return response.analysis;
      },
    }),

    // Manually trigger regeneration of government's aggregate analysis
    regenerateGovernmentAnalysis: builder.mutation<
      GovernmentDashboardResponse,
      void
    >({
      query: () => ({
        url: `/dashboard/regenerate`,
        method: "POST",
      }),
      transformResponse: (response: {
        success: boolean;
        analysis: any;
        message: string;
      }) => {
        if (!response.success) {
          throw new Error(
            response.message || "Failed to regenerate government dashboard"
          );
        }
        return response.analysis;
      },
    }),
  }),
});

export const {
  useGetGovernmentDashboardQuery,
  useGetProjectAnalysisQuery,
  useRegenerateProjectAnalysisMutation,
  useRegenerateGovernmentAnalysisMutation,
} = analysisApi;

// Types based on the backend models
export interface GovernmentDashboardResponse {
  _id: string;
  governmentId: string;
  lastUpdated: string;
  projectCount: {
    total: number;
    active: number;
    completed: number;
    stalled: number;
  };
  overallSatisfaction: {
    likesTotal: number;
    dislikesTotal: number;
    supportRatio: number;
    commentSentimentDistribution: {
      positive: number;
      neutral: number;
      negative: number;
    };
  };
  financialSummary: {
    totalBudget: number;
    totalExpenditure: number;
    averageExpenditureRatio: number;
    projectsOverBudget: number;
  };
  contractorPerformance: {
    mostActive: Array<{
      contractor: {
        _id: string;
        name: string;
        photo?: string;
      };
      activityScore: number;
      projectCount: number;
    }>;
    leastActive: Array<{
      contractor: {
        _id: string;
        name: string;
        photo?: string;
      };
      activityScore: number;
      projectCount: number;
    }>;
  };
  publicSentiment: {
    topPositiveTags: Array<{
      tag: string;
      count: number;
    }>;
    topNegativeTags: Array<{
      tag: string;
      count: number;
    }>;
    topConcerns: string[];
  };
  corruptionReports: {
    totalReports: number;
    resolvedReports: number;
    investigatingReports: number;
    averageSeverity: number;
    projectsWithMostReports: Array<{
      project: {
        _id: string;
        title: string;
      };
      reportCount: number;
    }>;
  };
}

export interface ProjectAnalysisResponse {
  _id: string;
  project: string;
  lastUpdated: string;
  supportMetrics: {
    likeCount: number;
    dislikeCount: number;
    supportRatio: number;
    commentSentiment: {
      positive: number;
      neutral: number;
      negative: number;
    };
  };
  progressMetrics: {
    updateFrequency: number;
    lastUpdateDate: string | null;
    daysSinceLastUpdate: number;
    totalUpdates: number;
  };
  financialMetrics: {
    expenditureRatio: number;
    budgetTotal: number;
    expenditureTotal: number;
    projectedCompletion: string | null;
    burnRate: number;
  };
  contractorMetrics: {
    activityLevel: number;
    responseRate: number;
    averageResponseTime: number;
  };
  commentAnalysis: {
    tags: Array<{
      tag: string;
      count: number;
      sentiment: "positive" | "neutral" | "negative";
    }>;
    topConcerns: string[];
    topPraises: string[];
  };
  corruptionReportMetrics: {
    reportCount: number;
    resolvedCount: number;
    investigatingCount: number;
    rejectedCount: number;
    pendingCount: number;
    averageSeverity: number;
  };
}
