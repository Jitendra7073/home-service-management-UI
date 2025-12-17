"use client"
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil, Trash2, Mail, Phone, Globe, Clock, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from '@tanstack/react-query';

const initialBusinessData = {
  businessName: "Jitendra Cleaning Services",
  businessEmail: "abcd@gmail.com",
  phoneNumber: "+91-9228339444",
  websiteUrl: "https://www.google.com",
  businessCategory: "Home Service",
  socialLinks: [
    { id: 1, platform: "Facebook", url: "https://facebook.com/business", icon: Facebook },
    { id: 2, platform: "Instagram", url: "https://instagram.com/business", icon: Instagram },
    { id: 3, platform: "Twitter", url: "https://twitter.com/business", icon: Twitter }
  ]
};

const initialSlots = [
  { id: 1, startTime: "09:00 AM", endTime: "10:00 AM" },
  { id: 2, startTime: "10:00 AM", endTime: "11:00 AM" },
  { id: 3, startTime: "11:00 AM", endTime: "12:00 PM" },
  { id: 4, startTime: "02:00 PM", endTime: "03:00 PM" },
  { id: 5, startTime: "03:00 PM", endTime: "04:00 PM" }
];

const categories = [
  { id: "1", name: "Home Service" },
  { id: "2", name: "Health & Wellness" },
  { id: "3", name: "Education" },
  { id: "4", name: "Beauty & Salon" }
];

function LabelAndValue({ label, value, icon: Icon }:any) {
  return (
    <div className="flex flex-col p-4 gap-2 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex items-center gap-2">
        {Icon && <Icon className="w-4 h-4 text-gray-600" />}
        <Label className="text-sm font-medium text-gray-600">{label}</Label>
      </div>
      <p className="text-gray-900 break-words">{value}</p>
    </div>
  );
}

function SocialLinkCard({ platform, url, icon: Icon }:any) {
  return (
    <a 
      href={url} 
      target="_blank" 
      rel="noopener noreferrer"
      className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
    >
      <Icon className="w-5 h-5 text-gray-700" />
      <div>
        <p className="font-medium text-gray-900">{platform}</p>
        <p className="text-sm text-gray-500 truncate max-w-[200px]">{url}</p>
      </div>
    </a>
  );
}

function SlotCard({ slot, onEdit, onDelete }:any) {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex items-center gap-3">
        <Clock className="w-5 h-5 text-gray-600" />
        <p className="font-medium text-gray-900">
          {slot.startTime} - {slot.endTime}
        </p>
      </div>
      <div className="flex gap-2">
        <Button 
          size="sm" 
          variant="outline"
          onClick={() => onEdit(slot)}
        >
          <Pencil className="w-4 h-4" />
        </Button>
        <Button 
          size="sm" 
          variant="outline"
          onClick={() => onDelete(slot)}
        >
          <Trash2 className="w-4 h-4 text-red-600" />
        </Button>
      </div>
    </div>
  );
}

function EditBusinessDialog({ open, onOpenChange, businessData, onSave }:any) {
  const [formData, setFormData] = useState(businessData);
  const [socialFields, setSocialFields] = useState(
    businessData.socialLinks.map((s:any) => ({ platform: s.platform, url: s.url }))
  );

  const handleSubmit = (e:any) => {
    e.preventDefault();
    onSave({ ...formData, socialLinks: socialFields });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Business Profile</DialogTitle>
          <DialogDescription>
            Update your business information
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label>Business Name *</Label>
            <Input
              value={formData.businessName}
              onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
              placeholder="Jitendra Cleaning Services"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Category *</Label>
              <Select 
                value={formData.businessCategory}
                onValueChange={(value) => setFormData({ ...formData, businessCategory: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.name}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Contact Email *</Label>
              <Input
                type="email"
                value={formData.businessEmail}
                onChange={(e) => setFormData({ ...formData, businessEmail: e.target.value })}
                placeholder="example@gmail.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Phone Number *</Label>
              <Input
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                placeholder="+91 9876543210"
              />
            </div>

            <div>
              <Label>Website</Label>
              <Input
                value={formData.websiteUrl}
                onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                placeholder="https://yourbusiness.com"
              />
            </div>
          </div>

          <div>
            <Label>Social Profiles</Label>
            <div className="mt-2 space-y-2">
              {socialFields.map((field:any, index:any) => (
                <div key={index} className="grid grid-cols-2 gap-2">
                  <Input
                    placeholder="Platform (e.g., Instagram)"
                    value={field.platform}
                    onChange={(e) => {
                      const newFields = [...socialFields];
                      newFields[index].platform = e.target.value;
                      setSocialFields(newFields);
                    }}
                  />
                  <Input
                    placeholder="https://profile.com"
                    value={field.url}
                    onChange={(e) => {
                      const newFields = [...socialFields];
                      newFields[index].url = e.target.value;
                      setSocialFields(newFields);
                    }}
                  />
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => setSocialFields([...socialFields, { platform: '', url: '' }])}
                className="w-full"
              >
                + Add Social Link
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function EditSlotDialog({ open, onOpenChange, slot, onSave }:any) {
  const [startTime, setStartTime] = useState(slot?.startTime || '');
  const [endTime, setEndTime] = useState(slot?.endTime || '');

  const handleSubmit = () => {
    onSave({ ...slot, startTime, endTime });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Time Slot</DialogTitle>
          <DialogDescription>
            Update the time slot details
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label>Start Time *</Label>
            <Input
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              placeholder="09:00 AM"
            />
          </div>

          <div>
            <Label>End Time *</Label>
            <Input
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              placeholder="10:00 AM"
            />
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DeleteDialog({ open, onOpenChange, title, description, onConfirm }:any) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const BusinessInfo = () => {
  const {data} = useQuery({
    queryKey: ['businessInfo'],
    queryFn: async () => {
      const res = await fetch('/api/provider/business',{
        method:"GET",
        headers:{
          "Content-Type":"application/json"
        }
      })
      return await res.json()
    }
  })
  const [businessData, setBusinessData] = useState(initialBusinessData);
  const [slots, setSlots] = useState(initialSlots);
  
  const [editBusinessOpen, setEditBusinessOpen] = useState(false);
  const [editSlotOpen, setEditSlotOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [slotToDelete, setSlotToDelete] = useState(null);

  const handleSaveBusiness = (data:any) => {
    const updatedSocialLinks = data.socialLinks
      .filter((s:any) => s.platform && s.url)
      .map((s:any, index:any) => ({
        id: businessData.socialLinks[index]?.id || Date.now() + index,
        platform: s.platform,
        url: s.url,
        icon: getIconForPlatform(s.platform)
      }));

    setBusinessData({ ...data, socialLinks: updatedSocialLinks });
    setEditBusinessOpen(false);
  };

  const handleEditSlot = (slot:any) => {
    setSelectedSlot(slot);
    setEditSlotOpen(true);
  };

  const handleSaveSlot = (updatedSlot:any) => {
    setSlots(slots.map(s => s.id === updatedSlot.id ? updatedSlot : s));
    setEditSlotOpen(false);
    setSelectedSlot(null);
  };

  const handleDeleteSlot = (slot:any) => {
    setSlotToDelete(slot);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteSlot = () => {
    setSlots(slots.filter(s => s.id !== slotToDelete.id));
    setDeleteDialogOpen(false);
    setSlotToDelete(null);
  };

  const getIconForPlatform = (platform:any) => {
    const platformLower = platform.toLowerCase();
    if (platformLower.includes('facebook')) return Facebook;
    if (platformLower.includes('instagram')) return Instagram;
    if (platformLower.includes('twitter')) return Twitter;
    if (platformLower.includes('linkedin')) return Linkedin;
    return Globe;
  };

  return (
    <div className="flex w-full justify-center bg-gray-50 min-h-screen py-8">
      <div className="w-full max-w-[1400px] px-4 md:px-6 space-y-10">
        <section className="py-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">Manage Business Profile</h1>
            <p className="text-gray-600">Here you can manage your business profile and time slots.</p>
          </div>
        </section>

        <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Business Profile</h2>
            <Button onClick={() => setEditBusinessOpen(true)}>
              <Pencil className="w-4 h-4 mr-2" />
              Edit Business
            </Button>
          </div>

          <div className="space-y-4">
            <LabelAndValue 
              label="Business Name" 
              value={businessData.businessName}
            />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <LabelAndValue 
                icon={Mail}
                label="Business Email" 
                value={businessData.businessEmail} 
              />
              <LabelAndValue 
                icon={Phone}
                label="Mobile Number" 
                value={businessData.phoneNumber} 
              />
              <LabelAndValue 
                icon={Globe}
                label="Website URL" 
                value={businessData.websiteUrl} 
              />
              <LabelAndValue 
                label="Business Category" 
                value={businessData.businessCategory} 
              />
            </div>
          </div>
        </section>

        <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Business Social Platforms</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {businessData.socialLinks.map((link) => (
              <SocialLinkCard 
                key={link.id}
                platform={link.platform}
                url={link.url}
                icon={link.icon}
              />
            ))}
          </div>
        </section>

        <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Business Time Slots</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {slots.map((slot) => (
              <SlotCard
                key={slot.id}
                slot={slot}
                onEdit={handleEditSlot}
                onDelete={handleDeleteSlot}
              />
            ))}
          </div>
        </section>

        <EditBusinessDialog
          open={editBusinessOpen}
          onOpenChange={setEditBusinessOpen}
          businessData={businessData}
          onSave={handleSaveBusiness}
        />

        {selectedSlot && (
          <EditSlotDialog
            open={editSlotOpen}
            onOpenChange={setEditSlotOpen}
            slot={selectedSlot}
            onSave={handleSaveSlot}
          />
        )}

        <DeleteDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          title="Delete Time Slot"
          description={`Are you sure you want to delete the slot "${slotToDelete?.startTime} - ${slotToDelete?.endTime}"? This action cannot be undone.`}
          onConfirm={confirmDeleteSlot}
        />
      </div>
    </div>
  );
};

export default BusinessInfo;