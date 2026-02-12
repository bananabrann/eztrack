export type Project = {
    id: string;
    projectName: string;
    status: "ACTIVE" | "COMPLETED";
    startDate: string;
    endDate: string;
}

export const projects: Project[] = [
    {
        id: "21b10ecb-8a73-469c-ad2d-41237f2ee3aa",
        projectName: "Project Alpha",
        status: "ACTIVE",
        startDate: "2023-01-01",
        endDate: "2023-12-31"
    },
]