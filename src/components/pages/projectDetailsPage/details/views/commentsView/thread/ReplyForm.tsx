import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useCreateCommentReply } from "@/mutations/comment/usecreateCommentReply";
import { useState } from "react";

const ReplyForm = ({
  commentId,
  taskId,
}: {
  commentId: string;
  taskId: string;
}) => {
  const [message, setMessage] = useState("");

  const { mutate, isPending, error } = useCreateCommentReply();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim()) return;

    const input = {
      taskId: taskId,
      message: message,
      parentCommentId: commentId,
    };

    mutate(input, {
      onSuccess: () => {
        setMessage("");
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-surface/5 rounded-md p-4">
      <textarea
        className="w-full p-2 resize-none rounded-md border-none focus:outline-none"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      ></textarea>
      <div className="text-right">
        <Button
          size="xs"
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
  );
};
export default ReplyForm;
