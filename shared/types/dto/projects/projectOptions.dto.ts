export type ProjectOptionDto = {
  id: string;
  title: string;
  isInvited: boolean;
  createdAt: string;
  users: ProjectOptionUserDto[];
};

export type ProjectOptionUserDto = {
  id: string;
  name: string;
  avatarKey: string;
};

export type ProjectOptionsDto = {
  recent: ProjectOptionDto[];
  results: ProjectOptionDto[];
};
