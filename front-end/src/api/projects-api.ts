import { apiFetch } from "./api";
import { ProjectListResponse, ProjectStatus } from "../types/projects";

export const getProjects = async (status?: ProjectStatus): Promise<ProjectListResponse> => {
    const url = status ? `/projects?status=${status}` : '/projects';
    return await apiFetch(url, {
        method: 'GET',
    });
};