import api from "./api";
import type { ApiResponse, PaginatedResponse, Announcement } from "../types";

export const announcementService = {
  getAll: async (params?: any) => {
    const response = await api.get<
      ApiResponse<PaginatedResponse<Announcement>>
    >("/announcements", { params });
    return response.data;
  },

  getFeed: async (params?: any) => {
    const response = await api.get<
      ApiResponse<PaginatedResponse<Announcement>>
    >("/announcements-feed", { params });
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get<ApiResponse<Announcement>>(
      `/announcements/${id}`,
    );
    return response.data;
  },

  create: async (data: Partial<Announcement>) => {
    const response = await api.post<ApiResponse<Announcement>>(
      "/announcements",
      data,
    );
    return response.data;
  },

  update: async (id: number, data: Partial<Announcement>) => {
    const response = await api.put<ApiResponse<Announcement>>(
      `/announcements/${id}`,
      data,
    );
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete<ApiResponse<null>>(
      `/announcements/${id}`,
    );
    return response.data;
  },
};
