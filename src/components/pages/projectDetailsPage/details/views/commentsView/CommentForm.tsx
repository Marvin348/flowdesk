import { Button } from "@/components/ui/button";
import { useState } from "react";

const CommentForm = () => {
  const [input, setInput] = useState("");

  return (
    <form className="bg-surface/5 rounded-md p-4">
      <textarea
        className="w-full p-2 resize-none rounded-md border-none focus:outline-none"
        placeholder="Kommentar schreiben..."
      />

      <div className="flex items-center justify-between">
        <div className="text-surface/60">
          <button
            type="button"
            className="mr-2 size-8 rounded-md font-semibold hover:text-surface hover:bg-surface/5"
          >
            B
          </button>
          <button
            type="button"
            className="mr-2 size-8 rounded-md hover:text-surface hover:bg-surface/5"
          >
            I
          </button>
          <button
            type="button"
            className="underline size-8 rounded-md hover:text-surface hover:bg-surface/5"
          >
            U
          </button>
        </div>

        <Button
          size="sm"
          className="bg-accent hover:bg-accent/95 w-20 rounded-full"
          type="submit"
        >
          Posten
        </Button>
      </div>
    </form>
  );
};
export default CommentForm;
