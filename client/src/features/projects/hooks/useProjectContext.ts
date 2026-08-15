import { useOutletContext } from "react-router";

type ProjectOutletContext = {
  projectId: string;
};

export const useProjectContext = () => useOutletContext<ProjectOutletContext>();
