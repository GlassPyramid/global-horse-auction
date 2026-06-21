"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { ImagePlus, X, Loader2, GripVertical } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface ImageUploadProps {
  urls: string[];
  onChange: (urls: string[]) => void;
  bucket?: string;
  maxFiles?: number;
}

export function ImageUpload({ urls, onChange, bucket = "horse-images", maxFiles = 8 }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadFiles = useCallback(async (files: FileList | File[]) => {
    const supabase = createClient();
    setUploading(true);
    const newUrls: string[] = [];

    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) continue;
      const ext = file.name.split(".").pop();
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { data, error } = await supabase.storage.from(bucket).upload(path, file, {
        cacheControl: "3600",
        upsert: false,
      });
      if (!error && data) {
        const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(data.path);
        newUrls.push(publicUrl);
      }
    }

    onChange([...urls, ...newUrls].slice(0, maxFiles));
    setUploading(false);
  }, [urls, onChange, bucket, maxFiles]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length) uploadFiles(e.dataTransfer.files);
  };

  const remove = (index: number) => {
    onChange(urls.filter((_, i) => i !== index));
  };

  const move = (from: number, to: number) => {
    const next = [...urls];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange(next);
  };

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      {urls.length < maxFiles && (
        <div
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
            dragOver ? "border-[#c9a84c] bg-[#c9a84c]/5" : "border-[#c9a84c]/20 hover:border-[#c9a84c]/40"
          }`}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 text-[#c9a84c] animate-spin" />
              <p className="text-sm text-[#7a8fa8] font-[family-name:var(--font-inter)]">Uploading...</p>
            </div>
          ) : (
            <>
              <ImagePlus className="w-8 h-8 text-[#c9a84c]/50 mx-auto mb-3" />
              <p className="text-sm text-[#7a8fa8] font-[family-name:var(--font-inter)]">
                Drop photos here or <span className="text-[#c9a84c] font-semibold">click to upload</span>
              </p>
              <p className="text-xs text-[#4a5a70] mt-1 font-[family-name:var(--font-inter)]">
                JPG, PNG, WEBP · Max {maxFiles} photos · {urls.length}/{maxFiles} uploaded
              </p>
            </>
          )}
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => e.target.files && uploadFiles(e.target.files)}
          />
        </div>
      )}

      {/* Previews */}
      {urls.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {urls.map((url, i) => (
            <div key={url} className="relative group rounded-xl overflow-hidden border border-[#c9a84c]/15 aspect-square bg-[#060c1d]">
              <Image src={url} alt={`Photo ${i + 1}`} fill className="object-cover" sizes="150px" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {i > 0 && (
                  <button onClick={() => move(i, i - 1)} className="p-1 bg-[#060c1d]/80 rounded text-[#c9a84c] hover:bg-[#c9a84c] hover:text-[#060c1d] transition-colors" title="Move left">
                    <GripVertical className="w-3.5 h-3.5" />
                  </button>
                )}
                <button onClick={() => remove(i)} className="p-1 bg-red-500/80 rounded text-white hover:bg-red-500 transition-colors" title="Remove">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              {i === 0 && (
                <div className="absolute bottom-1 left-1 text-[9px] font-bold bg-[#c9a84c] text-[#060c1d] px-1.5 py-0.5 rounded font-[family-name:var(--font-inter)]">
                  COVER
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
