import CollaboratorsList from "@/components/pages/projectDetailsPage/details/views/overview/collaborators/CollaboratorsList";
import OpenTaskList from "@/components/pages/projectDetailsPage/details/views/overview/tasks/OpenTaskList";
import ProgressBarCard from "@/components/pages/projectDetailsPage/details/views/overview/ProgressBarCard";
import CommentsList from "@/components/pages/projectDetailsPage/details/views/overview/comments/CommentsList";
import type { ProjectsWithMeta } from "@/type/projectsWithMeta";
import type { Progress } from "@/utils/getProgressResult";
import type { User } from "@/type/user";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

type OverviewProps = {
  project: ProjectsWithMeta;
  progress: Progress;
  collaborator: User[];
  onOpen: () => void;
  inviteOpen: () => void;
};

const Overview = ({
  project,
  progress,
  collaborator,
  onOpen,
  inviteOpen,
}: OverviewProps) => {
  const allCommentsPerProject = project.tasks.flatMap((t) => t.comments);
  return (
    <div
      className={`grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 auto-rows-[170px]`}
    >
      <div className="border rounded-md h-full row-span-2">
        <CollaboratorsList collaborators={collaborator} inviteOpen={inviteOpen}/>
      </div>

      <div className="border rounded-md h-full row-span-2">
        <OpenTaskList tasks={project.tasks} users={collaborator} />
      </div>

      <div className="border rounded-md h-full xl:col-start-3 xl:row-span-1">
        <ProgressBarCard progress={progress} />
      </div>

      <div className="border rounded-md h-full row-span-3">
        <CommentsList comments={allCommentsPerProject} />
      </div>

      {/**TESTING SECTION */}
      <div className="border rounded-md h-full col-span-2 row-span-2">
        <div className="flex items-center justify-between gap-4 bg-muted-foreground/10 p-4">
          <h4 className="text-lg font-medium">Demo Section</h4>
          <Button onClick={onOpen}>
            <Plus className="text-accent" /> <span>Aufgabe</span>
          </Button>
        </div>
      </div>
      {/**TESTING SECTION */}
    </div>
  );
};
export default Overview;
