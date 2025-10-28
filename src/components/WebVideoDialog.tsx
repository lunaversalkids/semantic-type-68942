import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface WebVideoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVideoInsert: (embedHtml: string) => void;
}

export const WebVideoDialog = ({
  open,
  onOpenChange,
  onVideoInsert,
}: WebVideoDialogProps) => {
  const [url, setUrl] = useState("");

  const getEmbedUrl = (inputUrl: string): string | null => {
    try {
      const urlObj = new URL(inputUrl);
      
      // YouTube
      if (urlObj.hostname.includes("youtube.com") || urlObj.hostname.includes("youtu.be")) {
        let videoId = "";
        if (urlObj.hostname.includes("youtu.be")) {
          videoId = urlObj.pathname.slice(1);
        } else {
          videoId = urlObj.searchParams.get("v") || "";
        }
        return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
      }
      
      // Vimeo
      if (urlObj.hostname.includes("vimeo.com")) {
        const videoId = urlObj.pathname.split("/").filter(Boolean)[0];
        return videoId ? `https://player.vimeo.com/video/${videoId}` : null;
      }
      
      return null;
    } catch {
      return null;
    }
  };

  const handleInsert = () => {
    if (!url.trim()) {
      toast.error("Please enter a video URL");
      return;
    }

    const embedUrl = getEmbedUrl(url);
    if (!embedUrl) {
      toast.error("Invalid video URL. Please use YouTube or Vimeo links.");
      return;
    }

    const embedHtml = `<div class="video-embed" style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; margin: 1rem 0;"><iframe src="${embedUrl}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`;
    
    onVideoInsert(embedHtml);
    toast.success("Video inserted successfully!");
    onOpenChange(false);
    setUrl("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Insert Web Video</DialogTitle>
          <DialogDescription>
            Paste a YouTube or Vimeo video URL to embed it
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="video-url">Video URL</Label>
            <Input
              id="video-url"
              placeholder="https://www.youtube.com/watch?v=..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleInsert}>Insert</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
