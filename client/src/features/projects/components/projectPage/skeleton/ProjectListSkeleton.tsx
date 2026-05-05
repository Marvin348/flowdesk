import ProjectCardSkeleton from "@/features/projects/components/projectPage/skeleton/ProjectCardSkeleton";

const ProjectListSkeleton = () => {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 9 }).map((_, i) => (
        <ProjectCardSkeleton key={i} />
      ))}
    </div>
  );
};
export default ProjectListSkeleton;
