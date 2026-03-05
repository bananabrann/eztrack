import { apiFetch } from "./api";
import {
	CreateProjectInput,
	ProjectListResponse,
	ProjectMutationResponse,
	ProjectStatus,
	UpdateProjectInput,
} from "../types/projects";

export const getProjects = async (
	status?: ProjectStatus,
): Promise<ProjectListResponse> => {
	const url = status ? `/projects?status=${status}` : "/projects";
	return await apiFetch(url, {
		method: "GET",
	});
};

export const createProject = async (
	input: CreateProjectInput,
): Promise<ProjectMutationResponse> => {
	return await apiFetch("/projects", {
		method: "POST",
		body: JSON.stringify(input),
	});
};

export const updateProject = async (
	id: string,
	input: UpdateProjectInput,
): Promise<ProjectMutationResponse> => {
	return await apiFetch(`/projects/${id}`, {
		method: "PATCH",
		body: JSON.stringify(input),
	});
};
