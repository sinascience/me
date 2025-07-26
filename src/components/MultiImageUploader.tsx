"use client";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Upload, 
  X, 
  Image as ImageIcon, 
  Loader2,
  AlertCircle,
  Plus,
  GripVertical
} from "lucide-react";

interface MultiImageUploaderProps {
  value?: string[];
  onChange: (imageUrls: string[]) => void;
  className?: string;
  accept?: string;
  maxSizeMB?: number;
  minImages?: number;
  maxImages?: number;
}

function MultiImageUploader({ 
  value = [], 
  onChange, 
  className = "",
  accept = "image/*",
  maxSizeMB = 5,
  minImages = 3,
  maxImages = 10
}: MultiImageUploaderProps) {
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

    if (e.dataTransfer.files) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = async (files: File[]) => {
    setError("");
    
    // Check if adding these files would exceed max limit
    if (value.length + files.length > maxImages) {
      setError(`Maximum ${maxImages} images allowed`);
      return;
    }

    setUploading(true);
    const uploadPromises = files.map(file => uploadSingleFile(file));
    
    try {
      const results = await Promise.all(uploadPromises);
      const successfulUploads = results.filter(result => result !== null) as string[];
      
      if (successfulUploads.length > 0) {
        onChange([...value, ...successfulUploads]);
      }
      
      if (successfulUploads.length !== files.length) {
        setError(`${files.length - successfulUploads.length} files failed to upload`);
      }
    } catch (error) {
      setError('Failed to upload images');
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const uploadSingleFile = async (file: File): Promise<string | null> => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select only image files');
      return null;
    }

    // Validate file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File size must be less than ${maxSizeMB}MB`);
      return null;
    }

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
        return result.imageUrl;
      } else {
        console.error('Upload failed:', result.error);
        return null;
      }
    } catch (error) {
      console.error('Upload error:', error);
      return null;
    }
  };

  const handleRemove = async (indexToRemove: number) => {
    const imageUrl = value[indexToRemove];
    
    // If there's an existing image, try to delete it from Supabase
    if (imageUrl && imageUrl.includes('supabase')) {
      try {
        const auth = localStorage.getItem('admin_auth');
        await fetch(`/api/admin/upload/delete?url=${encodeURIComponent(imageUrl)}`, {
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

    const newImages = value.filter((_, index) => index !== indexToRemove);
    onChange(newImages);
  };

  const handleReorder = (fromIndex: number, toIndex: number) => {
    const newImages = [...value];
    const [movedImage] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, movedImage);
    onChange(newImages);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Upload Area */}
      <motion.div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={openFileDialog}
        className={`
          relative w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-200 mb-4
          ${dragActive 
            ? 'border-blue-500 bg-blue-500/10' 
            : 'border-zinc-700 bg-zinc-800/50 hover:border-zinc-600 hover:bg-zinc-800'
          }
          ${uploading ? 'pointer-events-none' : ''}
          ${value.length >= maxImages ? 'opacity-50 pointer-events-none' : ''}
        `}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
          {uploading ? (
            <>
              <Loader2 className="h-6 w-6 text-blue-400 animate-spin mb-2" />
              <p className="text-sm text-zinc-400">Uploading images...</p>
            </>
          ) : (
            <>
              <div className="w-8 h-8 bg-zinc-700 rounded-lg flex items-center justify-center mb-2">
                <Plus className="h-4 w-4 text-zinc-400" />
              </div>
              <p className="text-sm font-medium text-zinc-300 mb-1">
                {value.length === 0 
                  ? `Add ${minImages}+ images (first 3 shown on homepage)`
                  : `Add more images (${value.length}/${maxImages})`
                }
              </p>
              <p className="text-xs text-zinc-500">
                PNG, JPG, WebP or GIF (max {maxSizeMB}MB each)
              </p>
            </>
          )}
        </div>
      </motion.div>

      {/* Image Grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <AnimatePresence>
            {value.map((imageUrl, index) => (
              <motion.div
                key={imageUrl + index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative group"
              >
                <div className="relative w-full h-32 bg-zinc-800 rounded-lg overflow-hidden border border-zinc-700">
                  <img
                    src={imageUrl}
                    alt={`Project image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleRemove(index)}
                        className="bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-lg transition-colors duration-200"
                        title="Remove image"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  </div>

                  {/* Position indicator */}
                  <div className="absolute top-2 left-2 bg-zinc-900/80 text-white text-xs px-2 py-1 rounded">
                    {index + 1}
                    {index < 3 && (
                      <span className="ml-1 text-blue-400">★</span>
                    )}
                  </div>

                  {/* Drag handle */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <GripVertical className="h-4 w-4 text-zinc-400 cursor-move" />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Validation Message */}
      {value.length < minImages && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 p-3 bg-yellow-900/20 border border-yellow-800 rounded-lg flex items-center gap-2 text-yellow-400"
        >
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm">
            Please upload at least {minImages} images. First 3 will be featured on homepage.
          </span>
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

      {/* Helper Text */}
      {value.length >= 3 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 p-3 bg-blue-900/20 border border-blue-800 rounded-lg flex items-center gap-2 text-blue-400"
        >
          <ImageIcon className="h-4 w-4" />
          <span className="text-sm">
            First 3 images (★) will be shown on homepage. Remaining images appear in project gallery/lightbox.
          </span>
        </motion.div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
        disabled={uploading || value.length >= maxImages}
        multiple
      />
    </div>
  );
}

export default MultiImageUploader;