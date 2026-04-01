import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Bold, Italic, Smile, Upload, X, CalendarIcon, Clock, Globe, Lock, Shield, Eye, HelpCircle,
  Image, FileText, Save, Send, Gift, Heart, GraduationCap
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { format } from "date-fns";
import CountdownTimer from "@/components/CountdownTimer";

const timezones = [
  "UTC", "America/New_York", "America/Chicago", "America/Denver", "America/Los_Angeles",
  "Europe/London", "Europe/Paris", "Asia/Tokyo", "Asia/Shanghai", "Australia/Sydney",
];

const suggestions = [
  { icon: Gift, label: "Birthday", date: "Next birthday" },
  { icon: Heart, label: "Anniversary", date: "Your anniversary" },
  { icon: GraduationCap, label: "Graduation", date: "Graduation day" },
];

const CreateCapsule = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState("12:00");
  const [timezone, setTimezone] = useState("UTC");
  const [files, setFiles] = useState<{ name: string; type: string; size: number; progress: number }[]>([]);
  const [isPrivate, setIsPrivate] = useState(true);
  const [pinLocked, setPinLocked] = useState(false);
  const [recipients, setRecipients] = useState<string[]>([]);
  const [recipientInput, setRecipientInput] = useState("");
  const [autoSaved, setAutoSaved] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  // Auto-save simulation
  useState(() => {
    const t = setTimeout(() => setAutoSaved(true), 5000);
    return () => clearTimeout(t);
  });

  const addRecipient = () => {
    if (recipientInput && /\S+@\S+\.\S+/.test(recipientInput) && !recipients.includes(recipientInput)) {
      setRecipients([...recipients, recipientInput]);
      setRecipientInput("");
    }
  };

  const simulateUpload = (name: string, type: string, size: number) => {
    const file = { name, type, size, progress: 0 };
    setFiles(prev => [...prev, file]);
    const interval = setInterval(() => {
      setFiles(prev => prev.map(f =>
        f.name === name ? { ...f, progress: Math.min(f.progress + 20, 100) } : f
      ));
    }, 300);
    setTimeout(() => clearInterval(interval), 1800);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const items = Array.from(e.dataTransfer.files);
    items.forEach(f => simulateUpload(f.name, f.type, f.size));
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const items = Array.from(e.target.files || []);
    items.forEach(f => simulateUpload(f.name, f.type, f.size));
  };

  const handleSubmit = () => {
    if (!title || !date) {
      toast.error("Please fill in the title and select a date");
      return;
    }
    setConfirmOpen(true);
  };

  const confirmCreate = () => {
    setConfirmOpen(false);
    toast.success("Capsule created successfully! ✨");
    navigate("/dashboard");
  };

  const unlockDate = date ? new Date(`${format(date, "yyyy-MM-dd")}T${time}:00Z`).toISOString() : null;

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display font-bold text-3xl">Create a Capsule</h1>
            <p className="text-muted-foreground mt-1">Fill it with memories and seal it for the future</p>
          </div>
          {autoSaved && (
            <div className="flex items-center gap-2 text-sm text-capsule-success">
              <Save className="w-4 h-4" /> Draft saved
            </div>
          )}
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Editor Panel */}
          <div className="lg:col-span-3 space-y-6">
            {/* Title & Description */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="glass rounded-2xl p-6 space-y-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input placeholder="Our First Anniversary..." className="h-11 rounded-xl text-lg font-display" value={title} onChange={e => setTitle(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Input placeholder="A short description of this capsule..." className="h-11 rounded-xl" value={description} onChange={e => setDescription(e.target.value)} />
              </div>
            </motion.div>

            {/* Rich Text Editor */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass rounded-2xl p-6 space-y-3">
              <Label>Message</Label>
              <div className="flex items-center gap-1 p-1 bg-muted/50 rounded-lg w-fit">
                <Button size="icon" variant="ghost" className="h-8 w-8"><Bold className="w-4 h-4" /></Button>
                <Button size="icon" variant="ghost" className="h-8 w-8"><Italic className="w-4 h-4" /></Button>
                <Button size="icon" variant="ghost" className="h-8 w-8"><Smile className="w-4 h-4" /></Button>
              </div>
              <Textarea
                placeholder="Write your heartfelt message here..."
                className="min-h-[180px] rounded-xl resize-none"
                value={message}
                onChange={e => setMessage(e.target.value)}
              />
            </motion.div>

            {/* File Upload */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass rounded-2xl p-6 space-y-4">
              <Label>Attachments</Label>
              <div
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${dragOver ? "border-primary bg-primary/5" : "border-border"}`}
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
              >
                <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground mb-2">Drag & drop files here, or</p>
                <label>
                  <Button variant="outline" size="sm" className="rounded-xl" asChild>
                    <span>Browse Files</span>
                  </Button>
                  <input type="file" multiple className="hidden" onChange={handleFileInput} />
                </label>
              </div>
              {files.length > 0 && (
                <div className="space-y-2">
                  {files.map(f => (
                    <div key={f.name} className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                      {f.type.startsWith("image") ? <Image className="w-5 h-5 text-primary" /> : <FileText className="w-5 h-5 text-primary" />}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm truncate">{f.name}</p>
                        <div className="h-1.5 bg-muted rounded-full mt-1 overflow-hidden">
                          <div className="h-full bg-primary rounded-full transition-all duration-300" style={{ width: `${f.progress}%` }} />
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">{f.progress}%</span>
                      <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setFiles(prev => prev.filter(x => x.name !== f.name))}>
                        <X className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Privacy & Security */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass rounded-2xl p-6 space-y-5">
              <h3 className="font-display font-semibold flex items-center gap-2"><Shield className="w-5 h-5" /> Privacy & Security</h3>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Private Capsule</span>
                  <Tooltip>
                    <TooltipTrigger><HelpCircle className="w-3.5 h-3.5 text-muted-foreground" /></TooltipTrigger>
                    <TooltipContent>Only you and recipients can view this capsule</TooltipContent>
                  </Tooltip>
                </div>
                <Switch checked={isPrivate} onCheckedChange={setIsPrivate} />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">PIN Lock</span>
                  <Tooltip>
                    <TooltipTrigger><HelpCircle className="w-3.5 h-3.5 text-muted-foreground" /></TooltipTrigger>
                    <TooltipContent>Require a PIN to open this capsule</TooltipContent>
                  </Tooltip>
                </div>
                <Switch checked={pinLocked} onCheckedChange={setPinLocked} />
              </div>

              {/* Recipients */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">Recipients
                  <Tooltip>
                    <TooltipTrigger><HelpCircle className="w-3.5 h-3.5 text-muted-foreground" /></TooltipTrigger>
                    <TooltipContent>People who will receive this capsule when it unlocks</TooltipContent>
                  </Tooltip>
                </Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="email@example.com"
                    className="h-10 rounded-xl"
                    value={recipientInput}
                    onChange={e => setRecipientInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addRecipient())}
                  />
                  <Button variant="outline" className="rounded-xl" onClick={addRecipient}>Add</Button>
                </div>
                {recipients.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {recipients.map(r => (
                      <Badge key={r} variant="secondary" className="rounded-full px-3 py-1 gap-1">
                        {r}
                        <X className="w-3 h-3 cursor-pointer" onClick={() => setRecipients(prev => prev.filter(x => x !== r))} />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Scheduling */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass rounded-2xl p-6 space-y-4 sticky top-24">
              <h3 className="font-display font-semibold flex items-center gap-2"><Clock className="w-5 h-5" /> Schedule</h3>

              <div className="space-y-2">
                <Label>Unlock Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start h-11 rounded-xl gap-2">
                      <CalendarIcon className="w-4 h-4" />
                      {date ? format(date, "PPP") : "Select a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 rounded-xl" align="start">
                    <Calendar mode="single" selected={date} onSelect={setDate} disabled={d => d < new Date()} />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Time</Label>
                  <Input type="time" className="h-10 rounded-xl" value={time} onChange={e => setTime(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Timezone</Label>
                  <Select value={timezone} onValueChange={setTimezone}>
                    <SelectTrigger className="h-10 rounded-xl"><Globe className="w-4 h-4 mr-1" /><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {timezones.map(tz => <SelectItem key={tz} value={tz}>{tz.replace(/_/g, " ")}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Countdown Preview */}
              {unlockDate && (
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Unlocks in:</Label>
                  <CountdownTimer targetDate={unlockDate} large />
                </div>
              )}

              {/* Smart Suggestions */}
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Quick picks</Label>
                <div className="grid grid-cols-3 gap-2">
                  {suggestions.map(s => (
                    <button
                      key={s.label}
                      className="p-3 rounded-xl bg-muted/50 hover:bg-muted text-center transition-colors"
                      onClick={() => {
                        const d = new Date();
                        d.setMonth(d.getMonth() + 3);
                        setDate(d);
                      }}
                    >
                      <s.icon className="w-5 h-5 mx-auto mb-1 text-primary" />
                      <p className="text-[11px] font-medium">{s.label}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Preview Card */}
              <div className="rounded-xl gradient-card border border-border/50 p-4 space-y-3 mt-4">
                <h4 className="font-display font-semibold text-sm">Preview</h4>
                <div className="space-y-1">
                  <p className="font-medium">{title || "Untitled Capsule"}</p>
                  <p className="text-xs text-muted-foreground">{description || "No description"}</p>
                </div>
                {message && <p className="text-sm text-muted-foreground line-clamp-3">{message}</p>}
                <div className="flex gap-2 text-xs text-muted-foreground">
                  <span>{files.length} files</span>
                  <span>•</span>
                  <span>{recipients.length} recipients</span>
                  <span>•</span>
                  <span>{isPrivate ? "Private" : "Public"}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <Button variant="outline" className="flex-1 rounded-xl" onClick={() => { toast.info("Draft saved"); }}>
                  <Save className="w-4 h-4 mr-2" /> Save Draft
                </Button>
                <Button className="flex-1 rounded-xl shadow-glow" onClick={handleSubmit}>
                  <Send className="w-4 h-4 mr-2" /> Create
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="glass rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-display">Seal this Capsule?</DialogTitle>
            <DialogDescription>Once created, the unlock date cannot be changed. Are you sure?</DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" className="rounded-xl" onClick={() => setConfirmOpen(false)}>Cancel</Button>
            <Button className="rounded-xl shadow-glow" onClick={confirmCreate}>Seal & Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateCapsule;
