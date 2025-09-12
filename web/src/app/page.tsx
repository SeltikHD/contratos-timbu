import DashboardStats from "@/components/dashboard-stats";
import Header from "@/components/header";
import ProjectCarousel from "@/components/project-carousel";
import { getProjects, getProjectsStats } from "@/services/projects";

export default async function Home() {
    const [projects, stats] = await Promise.all([getProjects(), getProjectsStats()]);

    return (
        <div className="min-h-screen bg-base-200">
            <Header />

            <main className="container mx-auto px-6 py-8">
                {/* Dashboard Stats */}
                <div className="mb-8">
                    <DashboardStats
                        totalProjetos={stats.totalProjetos}
                        projetosAtivos={stats.projetosAtivos}
                        projetosConcluidos={stats.projetosConcluidos}
                        valorTotalProjetos={stats.valorTotalProjetos}
                    />
                </div>

                {/* Projects Carousel */}
                <div className="bg-base-100 rounded-2xl shadow-xl p-6">
                    <ProjectCarousel projects={projects} />
                </div>
            </main>
        </div>
    );
}
