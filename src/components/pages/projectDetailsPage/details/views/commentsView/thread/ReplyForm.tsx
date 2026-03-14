import { Button } from "@/components/ui/button";

const ReplyForm = () => {
  return (
    <form className="bg-surface/5 rounded-md p-4">
      <textarea className="w-full p-2 resize-none rounded-md border-none focus:outline-none"></textarea>
      <Button
        size="xs"
        className="bg-accent hover:bg-accent/95 w-20 rounded-full"
        type="submit"
      >
        Senden
      </Button>
    </form>
  );
};
export default ReplyForm;
