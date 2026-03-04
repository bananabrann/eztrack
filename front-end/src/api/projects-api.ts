import { apiFetch } from "./api";
import {
	CreateProjectInput,
	ProjectListResponse,
	ProjectMutationResponse,
	ProjectStatus,
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
