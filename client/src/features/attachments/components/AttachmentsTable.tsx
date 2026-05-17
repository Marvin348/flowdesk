import AttachmentTableRow from "@/features/attachments/components/AttachmentTableRow";
const AttachmentsTable = () => {
//   if (attachments.length === 0) {
//     return <AttachmentsEmptyState />;
//   }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-muted text-xs text-muted-foreground">
          <tr>
            <th className="px-4 py-3">Datei</th>
            <th className="px-4 py-3">Zugeordnet zu</th>
            <th className="px-4 py-3">Größe</th>
            <th className="px-4 py-3">Hochgeladen von</th>
            <th className="px-4 py-3">Datum</th>
            <th className="px-4 py-3">Aktionen</th>
          </tr>
        </thead>

        <tbody>
            <AttachmentTableRow/>
        </tbody>
      </table>
    </div>
  );
};
export default AttachmentsTable;
