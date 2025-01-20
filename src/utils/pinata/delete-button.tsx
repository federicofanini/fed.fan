"use client";

import { Loader2, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";
import { deleteImage } from "./delete-image";
import { toast } from "sonner";

interface DeleteButtonProps {
  fileId: string;
}

export function DeleteButton({ fileId }: DeleteButtonProps) {
  const { pending } = useFormStatus();

  async function handleDelete() {
    const result = await deleteImage({ fileId });

    if (!result?.data?.success) {
      toast.error("Failed to delete image");
      return;
    }

    toast.success("Image deleted successfully");
  }

  return (
    <Button
      size="mini"
      variant="destructive"
      disabled={pending}
      onClick={handleDelete}
    >
      {pending ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <XIcon className="size-4" />
      )}
    </Button>
  );
}
