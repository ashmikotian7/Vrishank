import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, X, Image, FileText, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface FileUploadProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
  maxFiles?: number;
  maxSize?: number;
  acceptedTypes?: string[];
  disabled?: boolean;
  className?: string;
  externalUploadProgress?: Record<string, number>;
}

export const FileUpload = ({
  files,
  onFilesChange,
  maxFiles = 10,
  maxSize = 50 * 1024 * 1024,
  acceptedTypes = ['image/*', 'application/pdf', 'text/*', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  disabled = false,
  className = "",
  externalUploadProgress = {}
}: FileUploadProps) => {
  const [dragOver, setDragOver] = useState(false);

  const validateFile = (file: File): string | null => {
    if (file.size > maxSize) {
      return `File size exceeds ${Math.round(maxSize / 1024 / 1024)}MB limit`;
    }

    const isValidType = acceptedTypes.some(type => {
      if (type.endsWith('*')) {
        return file.type.startsWith(type.slice(0, -1));
      }
      return file.type === type;
    });

    if (!isValidType) {
      return 'File type not supported';
    }

    return null;
  };

  const handleFileUpload = useCallback((newFiles: File[]) => {
    if (disabled) return;

    if (files.length + newFiles.length > maxFiles) {
      toast.error(`Maximum ${maxFiles} files allowed`);
      return;
    }

    const validFiles: File[] = [];
    const errors: string[] = [];

    newFiles.forEach(file => {
      const error = validateFile(file);
      if (error) {
        errors.push(`${file.name}: ${error}`);
      } else {
        if (!files.some(f => f.name === file.name && f.size === file.size)) {
          validFiles.push(file);
        }
      }
    });

    if (errors.length > 0) {
      toast.error(errors.join('\n'));
    }

    if (validFiles.length > 0) {
      const updatedFiles = [...files, ...validFiles];
      onFilesChange(updatedFiles);
    }
  }, [files, onFilesChange, maxFiles, maxSize, acceptedTypes, disabled]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const items = Array.from(e.dataTransfer.files);
    handleFileUpload(items);
  }, [handleFileUpload]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const items = Array.from(e.target.files || []);
    handleFileUpload(items);
    e.target.value = '';
  }, [handleFileUpload]);

  const removeFile = (fileName: string) => {
    const updatedFiles = files.filter(f => f.name !== fileName);
    onFilesChange(updatedFiles);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <Label className="text-gray-800 dark:text-gray-200">Attachments</Label>
      
      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
          dragOver
            ? "border-purple-400 bg-purple-500/10"
            : disabled
            ? "border-gray-300 bg-gray-50 cursor-not-allowed"
            : "border-white/30 hover:border-purple-400/50 cursor-pointer"
        }`}
        onDragOver={(e) => { 
          if (!disabled) {
            e.preventDefault(); 
            setDragOver(true); 
          }
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => !disabled && document.getElementById('file-input')?.click()}
      >
        <Upload className={`w-8 h-8 mx-auto mb-3 ${disabled ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'}`} />
        <p className={`text-sm mb-2 ${disabled ? 'text-gray-400' : 'text-gray-600 dark:text-gray-400'}`}>
          {disabled ? 'File upload disabled' : 'Drag & drop files here, or click to browse'}
        </p>
        {!disabled && (
          <Button 
            variant="outline" 
            size="sm" 
            className="rounded-xl bg-white/20 border-white/20 hover:bg-white/30"
            onClick={(e) => e.stopPropagation()}
          >
            Browse Files
          </Button>
        )}
        
        <input
          id="file-input"
          type="file"
          multiple
          className="hidden"
          onChange={handleFileInput}
          accept={acceptedTypes.join(',')}
          disabled={disabled}
        />
      </div>

      <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
        <p>• Maximum {maxFiles} files</p>
        <p>• Maximum file size: {formatFileSize(maxSize)}</p>
        <p>• Supported formats: Images, PDFs, Documents</p>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file) => {
            const progress = externalUploadProgress[file.name] || 0;
            const status = progress > 0 ? 'uploading' : 'pending';
            
            return (
              <div key={file.name} className="flex items-center gap-3 p-3 rounded-xl bg-white/20 dark:bg-white/10 border border-white/20 dark:border-white/10">
                {file.type.startsWith('image') ? 
                  <Image className="w-4 h-4 text-blue-500" /> : 
                  <FileText className="w-4 h-4 text-purple-500" />
                }
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate text-gray-800 dark:text-gray-200">{file.name}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                  {progress > 0 && (
                    <div className="mt-1">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                        <div 
                          className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{progress}%</p>
                    </div>
                  )}
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7"
                  onClick={() => removeFile(file.name)}
                  disabled={disabled || status === 'uploading'}
                >
                  <X className="w-3.5 h-3.5" />
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
