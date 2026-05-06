import { Button } from "@/shared/components/ui/button";
import type { Attachment } from "@shared/types/attachment";
import { Plus } from "lucide-react";
import AttachmentsCard from "@/features/attachments/components/AttachmentsCard";

type AttachmentsViewProps = {
  attachments: Attachment[];
};

const AttachmentsView = ({ attachments }: AttachmentsViewProps) => {
  return (
    <section className="border rounded-md">
      <div className="flex items-center justify-between p-4 bg-muted-foreground/10">
        <h4 className="font-medium text-lg">Anhänge</h4>
        <Button>
          <Plus className="text-accent" /> <span>Hinzufügen</span>
        </Button>
      </div>
      <div className="p-4">
        <p className="text-muted-foreground text-sm">Dokumente</p>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
          {attachments.map((att) => (
            <div key={att.id} className="border rounded-md p-2">
              <AttachmentsCard attachment={att} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default AttachmentsView;
