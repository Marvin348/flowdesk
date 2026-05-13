import { Button } from "@/shared/components/ui/button";
import { Spinner } from "@/shared/components/ui/spinner";
import { useCreateComment } from "@/features/comments/hooks/useCreateComment";
import { useState } from "react";

type ReplyFormProps = {
  commentId: string;
  taskId: string;
  projectId: string;
  onCloseReply: () => void;
};

const ReplyForm = ({
  commentId,
  taskId,
  projectId,
  onCloseReply,
}: ReplyFormProps) => {
  const [message, setMessage] = useState("");

  const { mutate, isPending, error } = useCreateComment();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim()) return;

    const input = {
      taskId: taskId,
      message: message,
      parentCommentId: commentId,
      projectId,
    };

    mutate(input, {
      onSuccess: () => {
        onCloseReply();
        setMessage("");
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-muted rounded-md p-2">
      <textarea
        className="w-full p-2 resize-none rounded-md border-none focus:outline-none"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      ></textarea>
      <div className="text-right">
        <Button
          size="xs"
          className="rounded-full w-20"
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
  );
};
export default ReplyForm;
