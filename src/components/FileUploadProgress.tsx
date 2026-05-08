import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Image, FileText, CheckCircle, AlertCircle } from "lucide-react";

interface FileUploadProgress {
  name: string;
  type: string;
  size: number;
  progress: number;
  status?: 'pending' | 'uploading' | 'completed' | 'error';
  error?: string;
}

interface FileUploadProgressProps {
  files: FileUploadProgress[];
  onRemove: (fileName: string) => void;
  className?: string;
}

export const FileUploadProgress = ({ files, onRemove, className = "" }: FileUploadProgressProps) => {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusIcon = (status?: string, type?: string) => {
    if (status === 'completed') {
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    }
    if (status === 'error') {
      return <AlertCircle className="w-4 h-4 text-red-500" />;
    }
    if (type?.startsWith('image')) {
      return <Image className="w-4 h-4 text-blue-500" />;
    }
    return <FileText className="w-4 h-4 text-purple-500" />;
  };

  const getProgressColor = (status?: string) => {
    if (status === 'error') return 'bg-red-500';
    if (status === 'completed') return 'bg-green-500';
    return 'bg-gradient-to-r from-purple-500 to-pink-500';
  };

  if (files.length === 0) return null;

  return (
    <div className={`space-y-2 ${className}`}>
      {files.map((file) => (
        <div
          key={file.name}
          className="flex items-center gap-3 p-3 rounded-xl bg-white/20 dark:bg-white/10 border border-white/20 dark:border-white/10 backdrop-blur-sm"
        >
          {getStatusIcon(file.status, file.type)}
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-sm font-medium truncate text-gray-800 dark:text-gray-200">
                {file.name}
              </p>
              {file.status && (
                <Badge
                  variant="secondary"
                  className={`text-xs ${
                    file.status === 'completed'
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                      : file.status === 'error'
                      ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                      : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                  }`}
                >
                  {file.status}
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-1">
              <span>{formatFileSize(file.size)}</span>
              <span>•</span>
              <span>{file.progress}%</span>
            </div>
            
            <div className="h-1.5 bg-white/30 dark:bg-white/20 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${getProgressColor(file.status)}`}
                style={{ width: `${file.progress}%` }}
              />
            </div>
            
            {file.error && (
              <p className="text-xs text-red-500 mt-1">{file.error}</p>
            )}
          </div>
          
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7 hover:bg-white/20 dark:hover:bg-white/10"
            onClick={() => onRemove(file.name)}
            disabled={file.status === 'uploading'}
          >
            <X className="w-3.5 h-3.5" />
          </Button>
        </div>
      ))}
    </div>
  );
};

export default FileUploadProgress;
