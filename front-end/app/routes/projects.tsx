import { useEffect, useState } from "react";
import { getProjects } from "../../src/api/projects-api";
import { Project } from "../../src/types/projects";

import { Toolbox } from "lucide-react";

export default function Projects() {

    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await getProjects();
                setProjects(response.data);
            } catch (err) {
                setError('Failed to load projects. Please try again later.');
                console.error("Error fetching projects:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);

    if (loading) {
        return (<div className="flex justify-center items-center h-screen">Loading projects...</div>);
    }

    if (error) {
        return (<div className="flex justify-center items-center h-screen text-red-500">{error}</div>);
    }


    return (
        <div className="flex flex-col gap-6 items-center mt-8">
            <h1 className="text-2xl font-bold mb-8">Project Management</h1>

            {projects.length === 0 ? (
                <div className="text-gray-500">No projects found. Please create a new project.</div>
            ) : (
                <ul className="list w-full max-w-md space-y-4">
                    {projects.map((project) => (
                        <li key={project.id} className="list-row  rounded-box shadow-md">
                            <Toolbox className="w-6 h-6 text-gray-500" />
                            <div>{project.project_name}</div>
                        </li>
                    ))}
                </ul>
            )}

        </div>
    );
}   