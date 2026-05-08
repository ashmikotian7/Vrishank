import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { 
  ArrowLeft, Calendar, Users, Lock, Unlock, FileText, Image, Download,
  Eye, Share2, Clock, MessageSquare, CheckCircle, AlertCircle
} from "lucide-react";
import { capsuleApi, Capsule } from "@/lib/capsuleApi";
import { format } from "date-fns";

const CapsuleView = () => {
  const { capsuleId } = useParams<{ capsuleId: string }>();
  const navigate = useNavigate();
  const [capsule, setCapsule] = useState<Capsule | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
    } catch (error) {
      console.error("Error loading capsule:", error);
      toast.error("Failed to load capsule");
      navigate("/dashboard");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSealCapsule = async () => {
    if (!capsule) return;

    try {
      const sealedCapsule = await capsuleApi.sealCapsule(capsule.id);
      setCapsule(sealedCapsule);
      toast.success("Capsule sealed successfully!");
    } catch (error) {
      console.error("Error sealing capsule:", error);
      toast.error("Failed to seal capsule");
    }
  };

  const handleShare = () => {
    if (!capsule) return;
    
    const shareUrl = `${window.location.origin}/open/${capsule.id}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success("Capsule link copied to clipboard!");
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <Image className="w-4 h-4" />;
    return <FileText className="w-4 h-4" />;
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

  const isUnlocked = capsule.is_unlocked;

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center scale-110"
        style={{ backgroundImage: "url('/time-capsule.jpg')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-purple-200/20 to-pink-200/20 dark:from-black/80 dark:via-black/60 dark:to-black/90 backdrop-blur-[3px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(168,85,247,0.35),transparent_40%),radial-gradient(circle_at_80%_70%,rgba(236,72,153,0.35),transparent_40%)]" />

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-6xl">
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
              onClick={() => navigate("/dashboard")}
              className="h-10 w-10 rounded-xl border-white/30 bg-white/10 hover:bg-white/20"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="font-display font-bold text-3xl text-gray-900 dark:text-white">
                {capsule.title}
              </h1>
              <p className="text-gray-700 dark:text-gray-300 mt-1">
                Created {format(new Date(capsule.created_at), "PPP")}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge
              variant={capsule.is_sealed ? "default" : "secondary"}
              className={`px-3 py-1 ${
                capsule.is_sealed
                  ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                  : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"
              }`}
            >
              {capsule.is_sealed ? (
                <>
                  <Lock className="w-3 h-3 mr-1" />
                  Sealed
                </>
              ) : (
                <>
                  <Unlock className="w-3 h-3 mr-1" />
                  Draft
                </>
              )}
            </Badge>

            <Badge
              variant={isUnlocked ? "default" : "secondary"}
              className={`px-3 py-1 ${
                isUnlocked
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                  : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
              }`}
            >
              {isUnlocked ? (
                <>
                  <Unlock className="w-3 h-3 mr-1" />
                  Unlocked
                </>
              ) : (
                <>
                  <Clock className="w-3 h-3 mr-1" />
                  Locked
                </>
              )}
            </Badge>

            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="rounded-xl bg-white/20 border-white/20 hover:bg-white/30"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description and Message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="backdrop-blur-xl bg-white/30 dark:bg-white/10 border-white/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Message
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {capsule.description && (
                    <div>
                      <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-2">
                        Description
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400">
                        {capsule.description}
                      </p>
                    </div>
                  )}
                  
                  <div>
                    <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-2">
                      Message
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                      {capsule.message}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Attachments */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="backdrop-blur-xl bg-white/30 dark:bg-white/10 border-white/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Attachments ({capsule.attachments.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {capsule.attachments.length === 0 ? (
                    <div className="text-center py-8">
                      <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-500">No attachments yet</p>
                      {!capsule.is_sealed && (
                        <Button
                          onClick={() => navigate(`/upload-attachments/${capsule.id}`)}
                          className="mt-3 rounded-xl"
                        >
                          Add Files
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {capsule.attachments.map((attachment) => (
                        <div
                          key={attachment.id}
                          className="flex items-center justify-between p-3 rounded-lg bg-white/20 dark:bg-white/5 border border-white/20"
                        >
                          <div className="flex items-center gap-3">
                            {getFileIcon(attachment.file_type)}
                            <div>
                              <p className="font-medium text-gray-800 dark:text-gray-200">
                                {attachment.file_name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {formatFileSize(attachment.file_size)} • 
                                {format(new Date(attachment.uploaded_at), "PPP")}
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(attachment.file_url, '_blank')}
                            className="rounded-xl"
                          >
                            <Download className="w-4 h-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Capsule Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="backdrop-blur-xl bg-white/30 dark:bg-white/10 border-white/20">
                <CardHeader>
                  <CardTitle className="text-lg">Capsule Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Unlock Date</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {format(new Date(capsule.unlock_date), "PPP")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Timezone</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {capsule.timezone}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Users className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Recipients</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {capsule.recipients.length} people
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Lock className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Privacy</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {capsule.is_private ? "Private" : "Public"}
                      </p>
                    </div>
                  </div>

                  {capsule.pin_lock && (
                    <div className="flex items-center gap-3">
                      <Lock className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium">PIN Protected</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          4-digit PIN required
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Recipients */}
            {capsule.recipients.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="backdrop-blur-xl bg-white/30 dark:bg-white/10 border-white/20">
                  <CardHeader>
                    <CardTitle className="text-lg">Recipients</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {capsule.recipients.map((recipient) => (
                        <div key={recipient.id} className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {recipient.email}
                          </span>
                          {recipient.is_notified && (
                            <CheckCircle className="w-3 h-3 text-green-500" />
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Actions */}
            {!capsule.is_sealed && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="backdrop-blur-xl bg-white/30 dark:bg-white/10 border-white/20">
                  <CardHeader>
                    <CardTitle className="text-lg">Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button
                      onClick={() => navigate(`/upload-attachments/${capsule.id}`)}
                      className="w-full rounded-xl"
                      variant="outline"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Add Files
                    </Button>
                    
                    <Button
                      onClick={handleSealCapsule}
                      className="w-full rounded-xl bg-gradient-to-r from-red-500 to-pink-500 hover:scale-[1.02] transition"
                    >
                      <Lock className="w-4 h-4 mr-2" />
                      Seal Capsule
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CapsuleView;
