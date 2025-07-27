"use client";
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { 
  Upload, 
  X, 
  Image as ImageIcon, 
  Loader2,
  AlertCircle
} from "lucide-react";
import Image from "next/image";

interface ImageUploaderProps {
  value?: string;
  onChange: (imageUrl: string) => void;
  onRemove?: () => void;
  className?: string;
  accept?: string;
  maxSizeMB?: number;
}

function ImageUploader({ 
  value, 
  onChange, 
  onRemove,
  className = "",
  accept = "image/*",
  maxSizeMB = 5 
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file: File) => {
    setError("");
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File size must be less than ${maxSizeMB}MB`);
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const auth = localStorage.getItem('admin_auth');
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${auth}`
        },
        body: formData
      });

      const result = await response.json();

      if (response.ok) {
        onChange(result.imageUrl);
      } else {
        setError(result.error || 'Failed to upload image');
      }
    } catch (error) {
      setError('Failed to upload image');
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async () => {
    // If there's an existing image, try to delete it from Supabase
    if (value && value.includes('supabase')) {
      try {
        const auth = localStorage.getItem('admin_auth');
        await fetch(`/api/admin/upload/delete?url=${encodeURIComponent(value)}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${auth}`
          }
        });
      } catch (error) {
        console.error('Failed to delete image from storage:', error);
        // Continue with removal even if delete fails
      }
    }

    onChange("");
    if (onRemove) onRemove();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`w-full ${className}`}>
      {value ? (
        // Image Preview
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative group"
        >
          <div className="relative w-full h-48 bg-zinc-800 rounded-lg overflow-hidden border border-zinc-700">
            <Image
              src={value}
              alt="Uploaded image"
              width={400}
              height={192}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={openFileDialog}
                  className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition-colors duration-200"
                  title="Change image"
                >
                  <Upload className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={handleRemove}
                  className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors duration-200"
                  title="Remove image"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        // Upload Area
        <motion.div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={openFileDialog}
          className={`
            relative w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-200
            ${dragActive 
              ? 'border-blue-500 bg-blue-500/10' 
              : 'border-zinc-700 bg-zinc-800/50 hover:border-zinc-600 hover:bg-zinc-800'
            }
            ${uploading ? 'pointer-events-none' : ''}
          `}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
            {uploading ? (
              <>
                <Loader2 className="h-8 w-8 text-blue-400 animate-spin mb-3" />
                <p className="text-sm text-zinc-400">Uploading image...</p>
              </>
            ) : (
              <>
                <div className="w-12 h-12 bg-zinc-700 rounded-lg flex items-center justify-center mb-3">
                  <ImageIcon className="h-6 w-6 text-zinc-400" />
                </div>
                <p className="text-sm font-medium text-zinc-300 mb-1">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-zinc-500">
                  PNG, JPG, WebP or GIF (max {maxSizeMB}MB)
                </p>
              </>
            )}
          </div>
        </motion.div>
      )}

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 p-3 bg-red-900/20 border border-red-800 rounded-lg flex items-center gap-2 text-red-400"
        >
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm">{error}</span>
        </motion.div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
        disabled={uploading}
      />
    </div>
  );
}

export default ImageUploader;