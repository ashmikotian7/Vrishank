import { Link } from "react-router-dom";
import { Capsule, capsuleApi } from "@/lib/capsuleApi";
import { Clock, Lock, CheckCircle, Image, Users, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import CountdownTimer from "./CountdownTimer";
import { useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

const statusConfig = {
  scheduled: { icon: Clock, label: "Scheduled", className: "bg-capsule-soft/15 text-capsule-soft border-capsule-soft/20" },
  delivered: { icon: CheckCircle, label: "Delivered", className: "bg-capsule-success/15 text-capsule-success border-capsule-success/20" },
  locked: { icon: Lock, label: "Locked", className: "bg-capsule-locked/15 text-capsule-locked border-capsule-locked/20" },
};

interface Props {
  capsule: Capsule;
  view?: "grid" | "list";
  onUpdate?: () => void;
}

const CapsuleCard = ({ capsule, view = "grid", onUpdate }: Props) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: capsule.title,
    description: capsule.description,
    message: capsule.message,
    is_private: capsule.is_private,
    unlock_date: capsule.unlock_date,
    timezone: capsule.timezone,
    recipient_emails: capsule.recipients.map(r => r.email)
  });
  const [isSaving, setIsSaving] = useState(false);

  // Check if capsule can be edited (within 1 hour of creation and not sealed)
  const canEdit = () => {
    if (capsule.is_sealed) return false;
    
    const creationTime = new Date(capsule.created_at);
    const currentTime = new Date();
    const oneHourInMs = 60 * 60 * 1000;
    
    return (currentTime.getTime() - creationTime.getTime()) < oneHourInMs;
  };
  // Determine status based on API response fields
  const getStatus = () => {
    if (capsule.is_unlocked) return 'delivered';
    if (capsule.is_sealed) return 'locked';
    return 'scheduled';
  };
  
  // Count notified recipients
  const notifiedCount = capsule.recipients.filter(r => r.is_notified).length;
  
  const status = statusConfig[getStatus()] || statusConfig.locked;
  const StatusIcon = status.icon;

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await capsuleApi.deleteCapsule(capsule.id.toString());
      toast.success("Capsule deleted successfully");
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Delete error:', error);
      toast.error("Failed to delete capsule");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = async () => {
    try {
      setIsSaving(true);
      await capsuleApi.updateCapsule(capsule.id.toString(), editForm);
      toast.success("Capsule updated successfully");
      setIsEditing(false);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Edit error:', error);
      toast.error("Failed to update capsule");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditFormChange = (field: string, value: any) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  if (view === "list") {
    return (
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-4 p-4 rounded-xl gradient-card shadow-card hover-lift border border-border/50"
      >
        <div className="w-10 h-10 rounded-lg gradient-hero flex items-center justify-center shrink-0">
          <StatusIcon className="w-5 h-5 text-primary-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-gray-800 dark:text-gray-200">{capsule.title}</p>
          <p className="text-sm text-gray-500">{capsule.description}</p>
          {capsule.message && <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{capsule.message}</p>}
        </div>
        <Badge variant="outline" className={status.className}>{status.label}</Badge>
        <div className="hidden sm:flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><Image className="w-3 h-3" /> {capsule.attachments.length} {capsule.attachments.length === 1 ? 'file' : 'files'}</span>
          <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {capsule.recipients.length} {capsule.recipients.length === 1 ? 'user' : 'users'}{notifiedCount > 0 && ` (${notifiedCount} notified)`}</span>
        </div>
        <div className="flex gap-1">
          {getStatus() === "delivered" && (
            <Link to={`/open/${capsule.id}`}>
              <Button size="sm" variant="ghost">Open</Button>
            </Link>
          )}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="icon" variant="ghost" className="text-destructive" disabled={isDeleting}>
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Capsule</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "{capsule.title}"? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleDelete}
                  className="bg-red-600 hover:bg-red-700"
                  disabled={isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          {canEdit() && (
          <Dialog open={isEditing} onOpenChange={setIsEditing}>
            <DialogTrigger asChild>
              <Button size="icon" variant="ghost">
                <Pencil className="w-3.5 h-3.5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Capsule</DialogTitle>
                <DialogDescription>
                  Make changes to your capsule details
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={editForm.title}
                    onChange={(e) => handleEditFormChange('title', e.target.value)}
                    placeholder="Enter capsule title"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={editForm.description}
                    onChange={(e) => handleEditFormChange('description', e.target.value)}
                    placeholder="Enter capsule description"
                    rows={3}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    value={editForm.message}
                    onChange={(e) => handleEditFormChange('message', e.target.value)}
                    placeholder="Enter your message"
                    rows={4}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="unlock_date">Unlock Date</Label>
                  <Input
                    id="unlock_date"
                    type="datetime-local"
                    value={editForm.unlock_date}
                    onChange={(e) => handleEditFormChange('unlock_date', e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Input
                    id="timezone"
                    value={editForm.timezone}
                    onChange={(e) => handleEditFormChange('timezone', e.target.value)}
                    placeholder="UTC"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_private"
                    checked={editForm.is_private}
                    onCheckedChange={(checked) => handleEditFormChange('is_private', checked)}
                  />
                  <Label htmlFor="is_private">Private Capsule</Label>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="recipients">Recipient Emails (comma-separated)</Label>
                  <Input
                    id="recipients"
                    value={editForm.recipient_emails.join(', ')}
                    onChange={(e) => handleEditFormChange('recipient_emails', e.target.value.split(',').map(email => email.trim()))}
                    placeholder="email1@example.com, email2@example.com"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button onClick={handleEdit} disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl gradient-card shadow-card hover-lift border border-border/50 overflow-hidden group"
    >
      <div className="h-2 gradient-hero" />
      <div className="p-5 space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-display font-semibold text-lg truncate">{capsule.title}</h3>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{capsule.description}</p>
          </div>
          <Badge variant="outline" className={`ml-2 shrink-0 ${status.className}`}>
            <StatusIcon className="w-3 h-3 mr-1" />
            {status.label}
          </Badge>
        </div>

        {getStatus() !== "delivered" && (
          <CountdownTimer targetDate={capsule.unlock_date} />
        )}

        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Image className="w-3.5 h-3.5" /> {capsule.attachments.length} {capsule.attachments.length === 1 ? 'file' : 'files'}</span>
            <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {capsule.recipients.length} {capsule.recipients.length === 1 ? 'user' : 'users'}{notifiedCount > 0 && ` (${notifiedCount} notified)`}</span>
          </div>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {getStatus() === "delivered" && (
              <Link to={`/open/${capsule.id}`}>
                <Button size="sm">Open</Button>
              </Link>
            )}
            {canEdit() && (
              <Dialog open={isEditing} onOpenChange={setIsEditing}>
                <DialogTrigger asChild>
                  <Button size="icon" variant="ghost" className="h-8 w-8">
                    <Pencil className="w-3.5 h-3.5" />
                  </Button>
                </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Edit Capsule</DialogTitle>
                  <DialogDescription>
                    Make changes to your capsule details
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title-grid">Title</Label>
                    <Input
                      id="title-grid"
                      value={editForm.title}
                      onChange={(e) => handleEditFormChange('title', e.target.value)}
                      placeholder="Enter capsule title"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description-grid">Description</Label>
                    <Textarea
                      id="description-grid"
                      value={editForm.description}
                      onChange={(e) => handleEditFormChange('description', e.target.value)}
                      placeholder="Enter capsule description"
                      rows={3}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="message-grid">Message</Label>
                    <Textarea
                      id="message-grid"
                      value={editForm.message}
                      onChange={(e) => handleEditFormChange('message', e.target.value)}
                      placeholder="Enter your message"
                      rows={4}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="unlock_date-grid">Unlock Date</Label>
                    <Input
                      id="unlock_date-grid"
                      type="datetime-local"
                      value={editForm.unlock_date}
                      onChange={(e) => handleEditFormChange('unlock_date', e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="timezone-grid">Timezone</Label>
                    <Input
                      id="timezone-grid"
                      value={editForm.timezone}
                      onChange={(e) => handleEditFormChange('timezone', e.target.value)}
                      placeholder="UTC"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_private-grid"
                      checked={editForm.is_private}
                      onCheckedChange={(checked) => handleEditFormChange('is_private', checked)}
                    />
                    <Label htmlFor="is_private-grid">Private Capsule</Label>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="recipients-grid">Recipient Emails (comma-separated)</Label>
                    <Input
                      id="recipients-grid"
                      value={editForm.recipient_emails.join(', ')}
                      onChange={(e) => handleEditFormChange('recipient_emails', e.target.value.split(',').map(email => email.trim()))}
                      placeholder="email1@example.com, email2@example.com"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleEdit} disabled={isSaving}>
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            )}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" disabled={isDeleting}>
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Capsule</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete "{capsule.title}"? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleDelete}
                    className="bg-red-600 hover:bg-red-700"
                    disabled={isDeleting}
                  >
                    {isDeleting ? "Deleting..." : "Delete"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CapsuleCard;
