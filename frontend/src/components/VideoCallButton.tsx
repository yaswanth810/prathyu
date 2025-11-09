import { useState } from 'react';
import { Video, ExternalLink } from 'lucide-react';
import { Button } from './ui/Button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/Dialog';

interface VideoCallButtonProps {
  meetingLink: string;
  sessionTitle: string;
}

export default function VideoCallButton({ meetingLink, sessionTitle }: VideoCallButtonProps) {
  const [showDialog, setShowDialog] = useState(false);

  const handleJoinCall = () => {
    // Open video call in new window
    window.open(meetingLink, '_blank', 'width=1200,height=800');
    setShowDialog(false);
  };

  return (
    <>
      <Button
        variant="default"
        onClick={() => setShowDialog(true)}
        className="bg-green-600 hover:bg-green-700"
      >
        <Video className="w-4 h-4 mr-2" />
        Join Video Call
      </Button>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Join Video Call</DialogTitle>
            <DialogDescription>
              You're about to join the video call for "{sessionTitle}"
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900 font-semibold mb-2">Before you join:</p>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>✓ Check your camera and microphone</li>
                <li>✓ Ensure stable internet connection</li>
                <li>✓ Find a quiet environment</li>
                <li>✓ Have your learning materials ready</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowDialog(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleJoinCall} className="flex-1 bg-green-600 hover:bg-green-700">
                <ExternalLink className="w-4 h-4 mr-2" />
                Join Now
              </Button>
            </div>

            <p className="text-xs text-gray-500 text-center">
              The video call will open in a new window
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
