import { useState } from "react";
import type { UseFormSetValue, UseFormWatch } from "react-hook-form";
import type { NewTaskFields } from "../schemas/newTaskSchema";

type TaskTagsInput = {
  watch: UseFormWatch<NewTaskFields>;
  setValue: UseFormSetValue<NewTaskFields>;
};

export const useTaskTags = ({ watch, setValue }: TaskTagsInput) => {
  const [tagsInput, setTagsInput] = useState("");

  const tags = watch("tags") ?? [];

  const submitTag = () => {
    const next = tagsInput.trim();
    if (!next) return;

    if (tags.some((t) => t.toLowerCase() === next.toLowerCase())) return;

    setValue("tags", [...tags, next], {
      shouldValidate: true,
      shouldDirty: true,
    });

    setTagsInput("");
  };

  const removeTag = (tagToRemove: string) => {
    if (!tags.includes(tagToRemove)) return;

    setValue(
      "tags",
      tags.filter((t) => t !== tagToRemove),
      {
        shouldValidate: true,
        shouldDirty: true,
      },
    );
  };

  return {
    tags,
    setTagsInput,
    tagsInput,
    submitTag,
    removeTag,
  };
};
