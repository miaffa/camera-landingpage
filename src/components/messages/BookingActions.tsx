"use client";

import { useState, useCallback } from "react";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

interface BookingActionsProps {
  bookingId: string;
  status: string;
  onStatusChange: () => void;
}

export function BookingActions({ bookingId, status, onStatusChange }: BookingActionsProps) {
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectMessage, setRejectMessage] = useState("");
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);

  const handleApprove = useCallback(async () => {
    setIsApproving(true);
    try {
      const response = await fetch(`/api/bookings/${bookingId}/approve`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "approve",
        }),
      });

      if (response.ok) {
        toast.success("Booking approved successfully!");
        onStatusChange();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to approve booking");
      }
    } catch (error) {
      console.error("Error approving booking:", error);
      toast.error("Failed to approve booking");
    } finally {
      setIsApproving(false);
    }
  }, [bookingId, onStatusChange]);

  const handleReject = useCallback(async () => {
    setIsRejecting(true);
    try {
      const response = await fetch(`/api/bookings/${bookingId}/approve`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "reject",
          message: rejectMessage.trim() || undefined,
        }),
      });

      if (response.ok) {
        toast.success("Booking rejected");
        setIsRejectDialogOpen(false);
        setRejectMessage("");
        onStatusChange();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to reject booking");
      }
    } catch (error) {
      console.error("Error rejecting booking:", error);
      toast.error("Failed to reject booking");
    } finally {
      setIsRejecting(false);
    }
  }, [bookingId, rejectMessage, onStatusChange]);

  if (status !== "pending") {
    return (
      <div className="flex items-center gap-2">
        <span className={`text-sm font-medium px-2 py-1 rounded ${
          status === "approved" 
            ? "bg-green-100 text-green-800" 
            : status === "cancelled"
            ? "bg-red-100 text-red-800"
            : "bg-gray-100 text-gray-800"
        }`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        onClick={handleApprove}
        disabled={isApproving}
        size="sm"
        className="bg-green-600 hover:bg-green-700 text-white"
      >
        <Check className="h-4 w-4 mr-1" />
        {isApproving ? "Approving..." : "Approve"}
      </Button>

      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogTrigger asChild>
          <Button
            variant="destructive"
            size="sm"
            disabled={isRejecting}
          >
            <X className="h-4 w-4 mr-1" />
            Reject
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Booking Request</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Are you sure you want to reject this booking request? You can optionally provide a reason.
            </p>
            <Textarea
              placeholder="Reason for rejection (optional)..."
              value={rejectMessage}
              onChange={(e) => setRejectMessage(e.target.value)}
              rows={3}
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsRejectDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleReject}
                disabled={isRejecting}
              >
                {isRejecting ? "Rejecting..." : "Reject Booking"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
