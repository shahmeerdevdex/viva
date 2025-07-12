
import React, { useState, useRef } from 'react';
import { Upload, Camera, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageUploadProps {
  onImageUpload: (imageUrl: string) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageUpload }) => {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
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

  const handleFile = (file: File) => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setPreview(imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = () => {
    if (preview) {
      onImageUpload(preview);
    }
  };

  const clearImage = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      {!preview ? (
        <div
          className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200 ${
            dragActive
              ? 'border-purple-400 bg-purple-50'
              : 'border-gray-300 hover:border-purple-300 hover:bg-gray-50'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center">
              <Camera className="w-8 h-8 text-white" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900">
                Upload Image
              </h3>
              <p className="text-gray-500 text-sm">
                or click to browse your files
              </p>
            </div>
            
            <Button 
              type="button" 
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-6 py-2 rounded-full font-medium"
            >
              Select Photo
            </Button>

            <p className="text-xs text-gray-400">
              PNG, JPG, JPEG • Up to 10MB
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="relative flex justify-center">
            <img
              src={preview}
              alt="Preview"
              className="w-32 h-32 object-cover rounded-xl shadow-md"
            />
            <Button
              onClick={clearImage}
              variant="destructive"
              size="sm"
              className="absolute -top-1 -right-1 rounded-full w-6 h-6 p-0"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
          
          <div className="text-center">
            <Button 
              onClick={handleUpload} 
              size="lg"
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-12 py-4 rounded-full font-medium text-lg"
            >
              Proceed with Analysis
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
