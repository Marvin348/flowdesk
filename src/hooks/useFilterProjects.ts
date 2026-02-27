import type { ContentFilter } from "@/store/slices/filter";
import type { ProjectsList } from "@/type/projectsList";

export const useFilterProjects = (
  projectsWithMeta: ProjectsList[],
  filter: ContentFilter,
) =>
  projectsWithMeta.filter((pro) => {
    const matchesPriority =
      !filter.priority || pro.priority === filter.priority;

    const matchesStatus = !filter.status || pro.projectStatus === filter.status;

    const attachmentCount = pro.meta.attachmentCount;

    let matchesAttachments = true;
    if (filter.hasAttachments) matchesAttachments = attachmentCount > 0;
    if (filter.hasAttachments === false)
      matchesAttachments = attachmentCount === 0;

    const matchesBadge = filter.view === "all" || pro.badge === filter.view;

    return (
      matchesPriority && matchesStatus && matchesAttachments && matchesBadge
    );
  });
