import React from "react";
import { X, User, Shield, Bell, CreditCard, DollarSign, Calendar, FileText, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEditProfile: () => void;
  onSignOut?: () => void;
}

interface SettingsItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick: () => void;
}

export function SettingsModal({ isOpen, onClose, onEditProfile, onSignOut }: SettingsModalProps) {
  const accountSettings: SettingsItem[] = [
    {
      id: "edit-profile",
      label: "Edit Profile",
      icon: User,
      onClick: () => {
        onClose();
        onEditProfile();
      },
    },
    {
      id: "privacy-settings",
      label: "Privacy Settings",
      icon: Shield,
      onClick: () => console.log("Privacy Settings clicked"),
    },
    {
      id: "notification-preferences",
      label: "Notification Preferences",
      icon: Bell,
      onClick: () => console.log("Notification Preferences clicked"),
    },
    {
      id: "payment-methods",
      label: "Payment Methods",
      icon: CreditCard,
      onClick: () => console.log("Payment Methods clicked"),
    },
    {
      id: "payment-account",
      label: "Payment Account",
      icon: DollarSign,
      onClick: () => console.log("Payment Account clicked"),
    },
    {
      id: "sign-out",
      label: "Sign Out",
      icon: LogOut,
      onClick: () => {
        onClose();
        onSignOut?.();
      },
    },
  ];

  const rentalSettings: SettingsItem[] = [
    {
      id: "availability-calendar",
      label: "Availability Calendar",
      icon: Calendar,
      onClick: () => console.log("Availability Calendar clicked"),
    },
    {
      id: "insurance-options",
      label: "Insurance Options",
      icon: Shield,
      onClick: () => console.log("Insurance Options clicked"),
    },
    {
      id: "pricing-templates",
      label: "Pricing Templates",
      icon: DollarSign,
      onClick: () => console.log("Pricing Templates clicked"),
    },
  ];

  const SettingsSection = ({ title, items }: { title: string; items: SettingsItem[] }) => (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="p-2 bg-gray-100 rounded-lg">
          {title === "Account Settings" ? (
            <User className="h-4 w-4 text-gray-600" />
          ) : (
            <FileText className="h-4 w-4 text-gray-600" />
          )}
        </div>
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      
      <div className="space-y-2">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.id}
              variant="ghost"
              className="w-full justify-start h-12 px-4"
              onClick={item.onClick}
            >
              <Icon className="mr-3 h-5 w-5 text-gray-600" />
              <span className="text-gray-700">{item.label}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Settings
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-8">
          <SettingsSection title="Account Settings" items={accountSettings} />
          <SettingsSection title="Rental Settings" items={rentalSettings} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
