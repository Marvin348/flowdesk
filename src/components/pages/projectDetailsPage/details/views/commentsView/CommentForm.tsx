import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useCreateComment } from "@/mutations/comment/useCreateComment";
import SelectedTask from "@/components/ui/select/SelectedTask";
import type { Task } from "@/type/domain/task";
import { Spinner } from "@/components/ui/spinner";

const CommentForm = ({ tasks }: { tasks: Task[] }) => {
  const [message, setMessage] = useState("");
  const [selectedTaskId, setSelectedTaskId] = useState("");
  const [taskErrorMessage, setTaskErrorMessage] = useState<string | null>(null);

  const { mutate, isPending, error } = useCreateComment();

  const taskOption = tasks.map((task) => {
    return {
      taskTitle: task.title,
      taskId: task.id,
    };
  });

  const handleOnChange = (value: string) => {
    setSelectedTaskId(value);
    setTaskErrorMessage(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setTaskErrorMessage(null);

    if (!selectedTaskId) {
      setTaskErrorMessage("Aufgabe auswählen");
      return;
    }

    if (!message.trim()) return;

    const input = {
      message: message,
      taskId: selectedTaskId,
    };

    mutate(input, {
      onSuccess: () => {
        setMessage("");
        setSelectedTaskId("");
        setTaskErrorMessage(null);
      },
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="bg-surface/5 rounded-md p-4">
        <textarea
          className="w-full  p-2 resize-none rounded-md border-none focus:outline-none"
          placeholder="Kommentar schreiben..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        {taskErrorMessage && <p className="error-text">{taskErrorMessage}</p>}
        <div className="flex items-center justify-between">

          <div className="flex items-center text-surface/60">
            <div className="w-50">
              <SelectedTask
                options={taskOption}
                value={selectedTaskId}
                onChange={handleOnChange}
              />
            </div>
          </div>

          <Button
            size="sm"
            className="bg-accent hover:bg-accent/95 w-20 rounded-full"
            type="submit"
            disabled={isPending}
          >
            Posten {isPending && <Spinner />}
          </Button>
        </div>
        {error && (
          <p className="error-text">Kommentar konnte nicht gesendet werden</p>
        )}
      </form>
    </>
  );
};
export default CommentForm;
