import { apiClient } from "@/api/client";
import type { Project } from "@/type/project";

export const fetchProjects = async (): Promise<Project[]> => {
  const res = await apiClient.get("/projects");
  return res.data;
};

// const fetchJobs = async () => {
//   try {
//     const res = await fetch("https.....");
//     const data = await res.json();

//     return data;
//   } catch (error) {
//     throw error;
//   }
// };
