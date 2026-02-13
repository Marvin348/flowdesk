import type { ProjectsWithMeta } from "@/type/projectsWithMeta";
import type { ContentFilter } from "@/store/slices/ui-state/filter";

export const useFilterProjects = (
  projectsWithMeta: ProjectsWithMeta[],
  filter: ContentFilter,
) =>
  projectsWithMeta.filter((pro) => {
    const matchesPriority =
      !filter.priority || pro.priority === filter.priority;

    const matchesStatus = !filter.status || pro.status === filter.status;

    const attachmentCount = pro.attachmenetIds?.length ?? 0;

    let matchesAttachments = true;
    if (filter.hasAttachments) matchesAttachments = attachmentCount > 0;
    if (filter.hasAttachments === false) matchesAttachments = attachmentCount === 0;
    
    const matchesBadge = filter.view === "all" || pro.badge === filter.view;

    return matchesPriority && matchesStatus && matchesAttachments && matchesBadge;
  });
