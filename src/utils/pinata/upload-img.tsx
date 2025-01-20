"use client";

import React, { useCallback, useState, useEffect } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { pinata } from "./pinata";
import Image from "next/image";
import { Loader2, UploadIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { DeleteButton } from "./delete-button";
import { updateCid } from "./cid";
import { fetchAvatarUrlAction } from "@/actions/username/avatarUrl";

export function Dropzone() {
  const [files, setFiles] = useState<
    Array<{ file: File; uploading: boolean; id?: string; cid?: string }>
  >([]);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAvatar() {
      const result = await fetchAvatarUrlAction({});
      if (result?.data?.success && result?.data?.data) {
        setAvatarUrl(result?.data?.data);
      }
    }
    fetchAvatar();
  }, []);

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
        avatarUrl ? (
          <div className="relative w-full h-full">
            <Image
              src={avatarUrl}
              alt="Profile avatar"
              fill
              className="rounded-lg object-cover"
            />
            <div
              {...getRootProps({
                className:
                  "absolute inset-0 border-dashed rounded-lg border-2 opacity-0 hover:opacity-100 transition-opacity",
              })}
            >
              <input {...getInputProps()} />
              <div className="flex items-center justify-center h-full hover:bg-muted">
                <UploadIcon className="size-6" />
              </div>
            </div>
            <div className="absolute -top-2 -right-2">
              <DeleteButton fileId={avatarUrl.split("/").pop()!} />
            </div>
          </div>
        ) : (
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
        )
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
            <div className="absolute -top-2 -right-2">
              <DeleteButton fileId={file.id!} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
