import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileUpload } from "@/components/FileUpload";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { ArrowLeft, Upload, CheckCircle, ArrowRight, Clock, Users, Lock } from "lucide-react";
import { capsuleApi, Capsule } from "@/lib/capsuleApi";

const UploadAttachments = () => {
  const { capsuleId } = useParams<{ capsuleId: string }>();
  const navigate = useNavigate();
  const [files, setFiles] = useState<File[]>([]);
  const [capsule, setCapsule] = useState<Capsule | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  useEffect(() => {
    if (!capsuleId) {
      navigate("/dashboard");
      return;
    }

    loadCapsule();
  }, [capsuleId, navigate]);

  const loadCapsule = async () => {
    try {
      const capsuleData = await capsuleApi.getCapsule(capsuleId);
      setCapsule(capsuleData);
      
      // Check if capsule is sealed
      if (capsuleData.is_sealed) {
        toast.error("This capsule is already sealed. No more files can be uploaded.");
        navigate(`/capsule/${capsuleId}`);
        return;
      }
    } catch (error) {
      console.error("Error loading capsule:", error);
      toast.error("Failed to load capsule");
      navigate("/dashboard");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpload = async () => {
    if (!capsuleId || files.length === 0) {
      toast.error("Please select at least one file to upload");
      return;
    }

    setIsUploading(true);
    toast.loading("Uploading files...");

    try {
      for (const file of files) {
        await capsuleApi.uploadAttachment(parseInt(capsuleId), file);
        setUploadedFiles(prev => [...prev, file.name]);
      }
      
      toast.success(`Successfully uploaded ${files.length} file(s)!`);
      setFiles([]);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload some files. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSkip = () => {
    navigate(`/capsule/${capsuleId}`);
  };

  const handleFinish = () => {
    navigate(`/capsule/${capsuleId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading capsule...</p>
        </div>
      </div>
    );
  }

  if (!capsule) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Capsule not found</p>
          <Button onClick={() => navigate("/dashboard")} className="mt-4">
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center scale-110"
        style={{ backgroundImage: "url('/time-capsule.jpg')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-purple-200/20 to-pink-200/20 dark:from-black/80 dark:via-black/60 dark:to-black/90 backdrop-blur-[3px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(168,85,247,0.35),transparent_40%),radial-gradient(circle_at_80%_70%,rgba(236,72,153,0.35),transparent_40%)]" />

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate(`/capsule/${capsuleId}`)}
              className="h-10 w-10 rounded-xl border-white/30 bg-white/10 hover:bg-white/20"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="font-display font-bold text-3xl text-gray-900 dark:text-white">
                Upload Attachments
              </h1>
              <p className="text-gray-700 dark:text-gray-300 mt-1">
                Add files to your time capsule
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Upload Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Capsule Info Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="backdrop-blur-xl bg-white/30 dark:bg-white/10 border-white/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                      <span className="text-white text-sm font-bold">
                        {capsule.title.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    {capsule.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {capsule.description || "No description"}
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {new Date(capsule.unlock_date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {capsule.recipients.length} recipients
                    </div>
                    <div className="flex items-center gap-1">
                      <Lock className="w-4 h-4" />
                      {capsule.is_private ? "Private" : "Public"}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* File Upload Component */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="p-[1px] rounded-2xl bg-gradient-to-r from-purple-400/30 via-pink-400/30 to-blue-400/30">
                <div className="relative rounded-2xl p-6 backdrop-blur-2xl bg-white/30 dark:bg-white/5 border border-white/30 dark:border-white/10">
                  <FileUpload
                    files={files}
                    onFilesChange={setFiles}
                    maxFiles={20}
                    maxSize={100 * 1024 * 1024} // 100MB
                    disabled={isUploading}
                  />
                </div>
              </div>
            </motion.div>

            {/* Success Messages */}
            {uploadedFiles.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-2"
              >
                <h3 className="font-semibold text-green-700 dark:text-green-300 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Uploaded Files
                </h3>
                {uploadedFiles.map((fileName, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-700 dark:text-green-300">{fileName}</span>
                  </div>
                ))}
              </motion.div>
            )}

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex gap-4"
            >
              <Button
                variant="outline"
                onClick={handleSkip}
                disabled={isUploading}
                className="flex-1 rounded-xl bg-white/20 border-white/20 hover:bg-white/30"
              >
                Skip for Now
              </Button>
              <Button
                onClick={handleUpload}
                disabled={files.length === 0 || isUploading}
                className="flex-1 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:scale-[1.02] transition shadow-lg"
              >
                {isUploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload {files.length} {files.length === 1 ? 'File' : 'Files'}
                  </>
                )}
              </Button>
            </motion.div>

            {/* Finish Button */}
            {uploadedFiles.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <Button
                  onClick={handleFinish}
                  className="rounded-xl font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-500 hover:scale-[1.02] transition shadow-lg"
                >
                  <ArrowRight className="w-4 h-4 mr-2" />
                  View Capsule
                </Button>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="backdrop-blur-xl bg-white/30 dark:bg-white/10 border-white/20">
                <CardHeader>
                  <CardTitle className="text-lg">Upload Guidelines</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-purple-500 mt-1.5"></div>
                    <div>
                      <p className="font-medium">File Types</p>
                      <p className="text-gray-600 dark:text-gray-400">Images, PDFs, documents, and more</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-purple-500 mt-1.5"></div>
                    <div>
                      <p className="font-medium">Max File Size</p>
                      <p className="text-gray-600 dark:text-gray-400">100MB per file</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-purple-500 mt-1.5"></div>
                    <div>
                      <p className="font-medium">Max Files</p>
                      <p className="text-gray-600 dark:text-gray-400">20 files per capsule</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-purple-500 mt-1.5"></div>
                    <div>
                      <p className="font-medium">Privacy</p>
                      <p className="text-gray-600 dark:text-gray-400">Files are encrypted and secure</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="backdrop-blur-xl bg-white/30 dark:bg-white/10 border-white/20">
                <CardHeader>
                  <CardTitle className="text-lg">Current Attachments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-4">
                    <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {capsule.attachments.length}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      files already uploaded
                    </p>
                  </div>
                  {capsule.attachments.length > 0 && (
                    <div className="space-y-2 mt-4">
                      {capsule.attachments.slice(0, 3).map((attachment) => (
                        <div key={attachment.id} className="text-xs text-gray-600 dark:text-gray-400 truncate">
                          • {attachment.file_name}
                        </div>
                      ))}
                      {capsule.attachments.length > 3 && (
                        <p className="text-xs text-gray-500">
                          ...and {capsule.attachments.length - 3} more
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadAttachments;
