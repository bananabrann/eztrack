import { useNavigate } from "react-router";

export default function Dashboard() {
  const navigate = useNavigate();

  return (
  <main className="min-h-screen bg-background px-6">
    <div className="mx-auto flex min-h-[calc(100vh-120px)] max-w-xl flex-col items-center justify-center gap-6 py-10">
      <h1 className="text-2xl font-semibold text-primary">
        Choose Dashboard
      </h1>

      <div className="flex gap-4">
        <button className="btn bg-tertiary text-white border-0" onClick={() => navigate("/dashboard/foreman")}>
          Foreman
        </button>
        <button className="btn bg-secondary text-white border-0" onClick={() => navigate("/dashboard/crew")}>
          Crew
        </button>
      </div>
    </div>
  </main>
);
}