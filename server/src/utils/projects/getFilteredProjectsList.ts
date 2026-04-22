import { ProjectSummariesDto } from "@shared/types/dto/project.js";
import { ContentFilter } from "@shared/types/filter/contentFilter.js";

export const getFilteredProjectsList = (
  projectListItems: ProjectSummariesDto[],
  search: string,
  filter: ContentFilter,
) =>
  projectListItems.filter((p) => {
    const searchQuery = search.toLowerCase();

    const matchesSearch =
      !search || p.title.toLowerCase().includes(searchQuery);
    const matchesPriority = !filter.priority || p.priority === filter.priority;
    const matchesStatus = !filter.status || p.projectStatus === filter.status;

    let matchesAttachment = true;

    if (filter.hasAttachments) matchesAttachment = p.stats.attachmentCount > 0;
    if (filter.hasAttachments === false)
      matchesAttachment = p.stats.attachmentCount === 0;

    // refactor view laster (user-specific)
    

    return (
      matchesSearch && matchesPriority && matchesStatus && matchesAttachment
    );
  });
