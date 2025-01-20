"use client";

import React, { useCallback, useState } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { pinata } from "./pinata";
import Image from "next/image";
import { Loader2, UploadIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { deleteImage } from "./delete-image";
import { DeleteButton } from "./delete-button";
import { updateCid } from "./cid";

export function Dropzone() {
  const [files, setFiles] = useState<
    Array<{ file: File; uploading: boolean; id?: string; cid?: string }>
  >([]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length) {
      setFiles((prevFiles) => [
        ...prevFiles,
        ...acceptedFiles.map((file) => ({ file, uploading: false })),
      ]);

      for (const file of acceptedFiles) {
        try {
          setFiles((prevFiles) =>
            prevFiles.map((f) =>
              f.file === file ? { ...f, uploading: true } : f
            )
          );

          const keyRequest = await fetch("/api/img/key");
          const keyData = await keyRequest.json();

          const upload = await pinata.upload.file(file).key(keyData.JWT);

          if (!upload?.cid) {
            throw new Error("Failed to get CID from upload");
          }

          await updateCid(upload.cid);

          setFiles((prevFiles) =>
            prevFiles.map((f) =>
              f.file === file
                ? { ...f, uploading: false, id: upload.id, cid: upload.cid }
                : f
            )
          );

          toast.success(`File ${file.name} uploaded successfully`);
        } catch (error) {
          console.error("Upload error:", error);
          setFiles((prevFiles) =>
            prevFiles.map((f) =>
              f.file === file ? { ...f, uploading: false } : f
            )
          );
          toast.error("Failed to upload file");
        }
      }
    }
  }, []);

  const removeFile = async (fileId: string, fileName: string) => {
    if (fileId) {
      try {
        const result = await deleteImage(fileId);

        if (result.success) {
          setFiles((prevFiles) => prevFiles.filter((f) => f.id !== fileId));
          // Clear the CID in the database by passing empty string
          await updateCid("");
          toast.success(`File ${fileName} deleted successfully`);
        } else {
          toast.error("Error deleting file");
        }
      } catch (error) {
        console.error("Delete error:", error);
        toast.error("Failed to delete file");
      }
    }
  };

  const rejectedFiles = useCallback((fileRejection: FileRejection[]) => {
    if (fileRejection.length) {
      const toomanyFiles = fileRejection.find(
        (rejection) => rejection.errors[0].code === "too-many-files"
      );

      const fileSizetoBig = fileRejection.find(
        (rejection) => rejection.errors[0].code === "file-too-large"
      );

      if (toomanyFiles) {
        toast.error("Too many files selected, max is 5");
      }

      if (fileSizetoBig) {
        toast.error("File size exceeds 1MB limit");
      }
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected: rejectedFiles,
    maxFiles: 1,
    maxSize: 1024 * 1024 * 1, // 1MB
    accept: {
      "image/*": [],
    },
  });

  const file = files[0];

  return (
    <div className="w-[64px] h-[64px] relative">
      {!file ? (
        <div
          {...getRootProps({
            className: "border-dashed rounded-lg border-2 w-full h-full",
          })}
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-xs text-center">Drop here</p>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <UploadIcon className="size-6" />
            </div>
          )}
        </div>
      ) : (
        <div className="relative w-full h-full">
          <Image
            src={URL.createObjectURL(file.file)}
            alt={file.file.name}
            fill
            className={cn(
              file.uploading ? "opacity-50" : "",
              "rounded-lg object-cover"
            )}
          />

          {file.uploading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="size-6 animate-spin text-primary" />
            </div>
          ) : (
            <form
              action={() => removeFile(file.id!, file.file.name)}
              className="absolute -top-2 -right-2"
            >
              <DeleteButton />
            </form>
          )}
        </div>
      )}
    </div>
  );
}
