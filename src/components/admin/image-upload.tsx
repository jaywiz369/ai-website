"use client";

import { useState, useRef, useEffect } from "react";
import { Upload, Link, X, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  onFileSelect?: (file: File) => void;
  onClear?: () => void;
  className?: string;
}

export function ImageUpload({
  value,
  onChange,
  onFileSelect,
  onClear,
  className,
}: ImageUploadProps) {
  const [mode, setMode] = useState<"url" | "upload">("url");
  const [urlInput, setUrlInput] = useState(value);
  const [previewError, setPreviewError] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync urlInput when value changes externally (e.g., editing a different product)
  useEffect(() => {
    // Only sync if not a blob URL (blob URLs are temporary local previews)
    if (!value.startsWith("blob:")) {
      setUrlInput(value);
      setPreviewError(false);
    }
  }, [value]);

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setUrlInput(newUrl);
    setPreviewError(false);
    onChange(newUrl);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFileName(file.name);
      setPreviewError(false);

      // Create a local preview URL
      const localPreviewUrl = URL.createObjectURL(file);
      onChange(localPreviewUrl);

      // Notify parent about file selection for upload handling
      onFileSelect?.(file);
    }
  };

  const handleClear = () => {
    setUrlInput("");
    setSelectedFileName(null);
    setPreviewError(false);
    onChange("");
    onClear?.();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleImageError = () => {
    setPreviewError(true);
  };

  const handleImageLoad = () => {
    setPreviewError(false);
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Mode Toggle */}
      <div className="flex gap-2">
        <Button
          type="button"
          variant={mode === "url" ? "default" : "outline"}
          size="sm"
          onClick={() => setMode("url")}
        >
          <Link className="mr-2 h-4 w-4" />
          URL
        </Button>
        <Button
          type="button"
          variant={mode === "upload" ? "default" : "outline"}
          size="sm"
          onClick={() => setMode("upload")}
        >
          <Upload className="mr-2 h-4 w-4" />
          Upload
        </Button>
      </div>

      {/* URL Input Mode */}
      {mode === "url" && (
        <div className="space-y-2">
          <Label htmlFor="image-url">Image URL</Label>
          <div className="flex gap-2">
            <Input
              id="image-url"
              type="url"
              placeholder="https://example.com/image.jpg"
              value={urlInput}
              onChange={handleUrlChange}
            />
            {urlInput && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleClear}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      )}

      {/* File Upload Mode */}
      {mode === "upload" && (
        <div className="space-y-2">
          <Label htmlFor="image-file">Upload Image</Label>
          <div className="flex items-center gap-2">
            <Input
              ref={fileInputRef}
              id="image-file"
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="cursor-pointer"
            />
            {selectedFileName && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleClear}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          {selectedFileName && (
            <p className="text-sm text-muted-foreground">
              Selected: {selectedFileName}
            </p>
          )}
        </div>
      )}

      {/* Image Preview - 4:3 aspect ratio to match product cards */}
      <div className="space-y-2">
        <Label>Preview (4:3 aspect ratio - matches product cards)</Label>
        <div className="relative w-full aspect-[4/3] max-w-md mx-auto border border-input bg-muted/50 flex items-center justify-center overflow-hidden">
          {value && !previewError ? (
            <>
              <img
                src={value}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={handleImageError}
                onLoad={handleImageLoad}
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2"
                onClick={handleClear}
              >
                <X className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <div className="flex flex-col items-center text-muted-foreground">
              <ImageIcon className="h-12 w-12 mb-2" />
              <span className="text-sm">
                {previewError ? "Failed to load image" : "No image selected"}
              </span>
              <span className="text-xs mt-1">Recommended: 1200x900px</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
