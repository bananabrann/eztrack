/**
 * Types interface for the projects
 */     
export interface Project {
    id: string;
    project_name: string;
    start_date: string;
    end_date: string;
    status: 'ACTIVE' | 'COMPLETED';
    created_at: string;
}

/**
 * Types interface for the project status
 */
export type ProjectStatus = 'ACTIVE' | 'COMPLETED';

/**
 * Types interface for the create project input
 */
export interface CreateProjectInput {
    project_name: string;
    start_date: string;
    end_date: string;
    status?: ProjectStatus;
}

/**
 * Types interface for the update project input
 */
export interface UpdateProjectInput {
    project_name?: string;
    start_date?: string;
    end_date?: string;
    status?: ProjectStatus;
}

/**
 * Types interface for the project list response */
export interface ProjectListResponse {
    message: string;
    data: Project[];
}

/**
 * Types interface for the project mutation response */
export interface ProjectMutationResponse {
    message: string;
    data: Project;
    
}

/**
 * Types interface for the delete project response */
export interface DeleteProjectResponse {
    message: string;
}

/**
 * Types interface for the API error response */
export interface ApiErrorResponse {
    error: string;
}