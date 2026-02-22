import CarouselControls from "@/components/ui/CarouselControls";
import type { Task } from "@/type/task";
import type { User } from "@/type/user";
import OpenTask from "@/components/projects/details/tasks/OpenTask";
import { useState } from "react";
import { Button } from "@/components/ui/button";

type OpenTaskListProps = {
  tasks: Task[];
  users: User[];
};
const OpenTaskList = ({ tasks, users }: OpenTaskListProps) => {
  const [index, setIndex] = useState(0);
  const taskItem = tasks[index];

  if (!taskItem) return null;

  console.log("taskItem", taskItem);
  const prev = () => setIndex((i) => Math.max(i - 1, 0));
  const next = () => setIndex((i) => Math.min(i + 1, tasks.length - 1));

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between gap-4 bg-muted-foreground/10 p-4">
        <h4 className="text-lg font-medium">Offene Aufgaben</h4>
        <CarouselControls prev={prev} next={next} />
      </div>

      <div className="flex-1 relative">
        <div className="p-4">
          <OpenTask task={taskItem} users={users} />
        </div>
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className="pb-4 px-4">
        <Button
          variant="outline"
          className=" w-full hover:bg-muted-foreground/5"
        >
          Alle Ansehen
        </Button>
      </div>
    </div>
  );
};
export default OpenTaskList;
