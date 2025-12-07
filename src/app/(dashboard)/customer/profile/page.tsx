"use client"

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Edit,
    Camera,
    Save,
    X,
    Building,
    Home,
    Globe,
    Shield,
    Bell,
    CreditCard,
    Clock,
    CheckCircle2,
    Award,
    TrendingUp,
    Loader2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

// Types
interface Customer {
    id: string;
    name: string;
    email: string;
    mobile: string;
    avatar?: string;
    role: string;
    createdAt: string;
    profile?: {
        dateOfBirth?: string;
        gender?: string;
        bio?: string;
    };
    address?: {
        id?: string;
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
        addressType?: string;
    }[];
    preferences?: {
        emailNotifications: boolean;
        smsNotifications: boolean;
        language: string;
        currency: string;
    };
    stats?: {
        totalBookings: number;
        completedBookings: number;
        cancelledBookings: number;
        totalSpent: number;
    };
}

// Skeleton Components
const ProfileHeaderSkeleton = () => (
    <Card className="border-gray-200 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse" />
        <CardContent className="pt-0">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 -mt-16 sm:-mt-12">
                <div className="w-32 h-32 rounded-full bg-gray-300 animate-pulse border-4 border-white" />
                <div className="flex-1 text-center sm:text-left mb-4 space-y-2">
                    <div className="h-8 bg-gray-200 rounded w-48 mx-auto sm:mx-0 animate-pulse" />
                    <div className="h-4 bg-gray-200 rounded w-64 mx-auto sm:mx-0 animate-pulse" />
                </div>
            </div>
        </CardContent>
    </Card>
);

const StatCardSkeleton = () => (
    <Card className="border-gray-200">
        <CardContent className="p-6">
            <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
                <div className="h-8 bg-gray-200 rounded w-16 animate-pulse" />
            </div>
        </CardContent>
    </Card>
);

const SectionSkeleton = () => (
    <Card className="border-gray-200">
        <CardHeader>
            <div className="h-6 bg-gray-200 rounded w-48 animate-pulse" />
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="h-10 bg-gray-200 rounded animate-pulse" />
            <div className="h-10 bg-gray-200 rounded animate-pulse" />
            <div className="h-10 bg-gray-200 rounded animate-pulse" />
        </CardContent>
    </Card>
);

const CustomerProfilePage = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedData, setEditedData] = useState<Partial<Customer>>({});
    const queryClient = useQueryClient();

    // Fetch customer profile
    const { data: customer, isLoading, isError } = useQuery({
        queryKey: ["customer-profile"],
        queryFn: async () => {
            const res = await fetch("/api/customer/profile", {
                cache: "no-store",
            });

            if (!res.ok) {
                throw new Error("Failed to fetch profile");
            }
            const data = await res.json();
            return data.profile as Customer;
        },
    });

    // Update customer profile mutation
    const updateProfileMutation = useMutation({
        mutationFn: async (updatedData: Partial<Customer>) => {
            const res = await fetch("/api/customer/profile", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedData),
            });

            if (!res.ok) {
                throw new Error("Failed to update profile");
            }

            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["customer-profile"] });
            toast.success("Profile updated successfully");
            setIsEditing(false);
            setEditedData({});
        },
        onError: () => {
            toast.error("Failed to update profile. Please try again.");
        },
    });

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const handleEdit = () => {
        setEditedData(customer || {});
        setIsEditing(true);
    };

    const handleSave = () => {
        updateProfileMutation.mutate(editedData);
    };

    const handleCancel = () => {
        setEditedData({});
        setIsEditing(false);
    };

    const updateField = (field: string, value: any) => {
        setEditedData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const updateNestedField = (parent: string, field: string, value: any) => {
        setEditedData(prev => ({
            ...prev,
            [parent]: {
                ...(prev[parent as keyof Customer] as any),
                [field]: value
            }
        }));
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <div className="h-10 bg-gray-200 rounded w-48 animate-pulse mb-2" />
                        <div className="h-4 bg-gray-200 rounded w-96 animate-pulse" />
                    </div>
                    <div className="space-y-6">
                        <ProfileHeaderSkeleton />
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <StatCardSkeleton />
                            <StatCardSkeleton />
                            <StatCardSkeleton />
                            <StatCardSkeleton />
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <SectionSkeleton />
                            <SectionSkeleton />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (isError || !customer) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center p-4">
                <Card className="max-w-md w-full border-red-200">
                    <CardContent className="pt-6 text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <User className="w-8 h-8 text-red-600" />
                        </div>
                        <h2 className="text-xl font-semibold mb-2 text-gray-900">Failed to Load Profile</h2>
                        <p className="text-gray-600 mb-4">Please try refreshing the page</p>
                        <Button onClick={() => window.location.reload()}>
                            Retry
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const completionRate = customer.stats?.totalBookings
        ? Math.round((customer.stats.completedBookings / customer.stats.totalBookings) * 100)
        : 0;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">
                            My Profile
                        </h1>
                        <p className="text-gray-600">Manage your personal information and preferences</p>
                    </div>
                    {!isEditing ? (
                        <Button
                            onClick={handleEdit}
                            className="bg-gray-800 hover:bg-gray-900 text-white flex items-center gap-2 self-start sm:self-auto"
                            size="lg"
                        >
                            <Edit className="w-4 h-4" />
                            Edit Profile
                        </Button>
                    ) : (
                        <div className="flex gap-2 self-start sm:self-auto">
                            <Button
                                onClick={handleSave}
                                disabled={updateProfileMutation.isPending}
                                className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                                size="lg"
                            >
                                {updateProfileMutation.isPending ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Save className="w-4 h-4" />
                                )}
                                {updateProfileMutation.isPending ? 'Saving...' : 'Save'}
                            </Button>
                            <Button
                                onClick={handleCancel}
                                variant="outline"
                                className="flex items-center gap-2"
                                size="lg"
                                disabled={updateProfileMutation.isPending}
                            >
                                <X className="w-4 h-4" />
                                Cancel
                            </Button>
                        </div>
                    )}
                </div>

                {/* Profile Header Card with Cover */}
                <Card className="border-gray-200 overflow-hidden mb-6 shadow-lg">
                    <div className="h-32 sm:h-40 bg-gradient-to-r from-gray-600 via-gray-700 to-gray-800 relative">
                        <div className="absolute inset-0 bg-black opacity-10"></div>
                        {isEditing && (
                            <button className="absolute top-4 right-4 bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur-sm text-white px-3 py-2 rounded-lg flex items-center gap-2 transition-all">
                                <Camera className="w-4 h-4" />
                                <span className="text-sm">Change Cover</span>
                            </button>
                        )}
                    </div>
                    <CardContent className="pt-0">
                        <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 sm:gap-6 -mt-16 sm:-mt-12">
                            <div className="relative group">
                                <Avatar className="w-28 h-28 sm:w-32 sm:h-32 border-4 border-white shadow-xl">
                                    <AvatarImage src={customer.avatar} />
                                    <AvatarFallback className="bg-gradient-to-br from-gray-600 to-gray-900 text-white text-3xl font-bold">
                                        {getInitials(customer.name)}
                                    </AvatarFallback>
                                </Avatar>
                                {isEditing && (
                                    <button className="absolute inset-0 bg-black bg-opacity-60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Camera className="w-8 h-8 text-white" />
                                    </button>
                                )}
                            </div>
                            <div className="flex-1 text-center sm:text-left mb-4">
                                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                                    {customer.name}
                                </h2>
                                <p className="text-gray-600 mb-2">{customer.email}</p>
                                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                                    <Badge className="bg-blue-50 text-blue-700 border-blue-200 font-medium">
                                        <User className="w-3 h-3 mr-1" />
                                        {customer.role.charAt(0).toUpperCase() + customer.role.slice(1)}
                                    </Badge>
                                    <Badge className="bg-green-50 text-green-700 border-green-200 font-medium">
                                        <CheckCircle2 className="w-3 h-3 mr-1" />
                                        Active
                                    </Badge>
                                    <Badge className="bg-purple-50 text-purple-700 border-purple-200 font-medium">
                                        <Calendar className="w-3 h-3 mr-1" />
                                        Since {new Date(customer.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <Card className="border-gray-200 hover:shadow-lg transition-shadow bg-gradient-to-br from-blue-50 to-white">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Total Bookings</p>
                                    <p className="text-3xl font-bold text-gray-900">{customer.stats?.totalBookings || 0}</p>
                                </div>
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                    <Calendar className="w-6 h-6 text-blue-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-gray-200 hover:shadow-lg transition-shadow bg-gradient-to-br from-green-50 to-white">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Completed</p>
                                    <p className="text-3xl font-bold text-green-600">{customer.stats?.completedBookings || 0}</p>
                                </div>
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-gray-200 hover:shadow-lg transition-shadow bg-gradient-to-br from-purple-50 to-white">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Success Rate</p>
                                    <p className="text-3xl font-bold text-purple-600">{completionRate}%</p>
                                </div>
                                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                                    <TrendingUp className="w-6 h-6 text-purple-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-gray-200 hover:shadow-lg transition-shadow bg-gradient-to-br from-yellow-50 to-white">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Total Spent</p>
                                    <p className="text-3xl font-bold text-yellow-700">₹{(customer.stats?.totalSpent || 0).toLocaleString()}</p>
                                </div>
                                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                                    <Award className="w-6 h-6 text-yellow-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Personal Information */}
                    <Card className="border-gray-200 shadow-md hover:shadow-lg transition-shadow">
                        <CardHeader className="bg-gray-50 border-b border-gray-200">
                            <CardTitle className="flex items-center gap-2 text-gray-900">
                                <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center">
                                    <User className="w-5 h-5 text-white" />
                                </div>
                                Personal Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="space-y-4">
                                <div>
                                    <Label className="text-gray-700 font-medium">Full Name</Label>
                                    {isEditing ? (
                                        <Input
                                            value={editedData.name ?? customer.name}
                                            onChange={(e) => updateField('name', e.target.value)}
                                            className="mt-1.5 border-gray-300"
                                            placeholder="Enter your full name"
                                        />
                                    ) : (
                                        <p className="mt-1.5 text-gray-900 font-medium text-lg">{customer.name}</p>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-gray-700 font-medium flex items-center gap-1">
                                            <Mail className="w-4 h-4 text-gray-500" />
                                            Email Address
                                        </Label>
                                        {isEditing ? (
                                            <Input
                                                type="email"
                                                value={editedData.email ?? customer.email}
                                                onChange={(e) => updateField('email', e.target.value)}
                                                className="mt-1.5 border-gray-300"
                                                placeholder="your@email.com"
                                            />
                                        ) : (
                                            <p className="mt-1.5 text-gray-900 font-medium">{customer.email}</p>
                                        )}
                                    </div>

                                    <div>
                                        <Label className="text-gray-700 font-medium flex items-center gap-1">
                                            <Phone className="w-4 h-4 text-gray-500" />
                                            Mobile Number
                                        </Label>
                                        {isEditing ? (
                                            <Input
                                                value={editedData.mobile ?? customer.mobile}
                                                onChange={(e) => updateField('mobile', e.target.value)}
                                                className="mt-1.5 border-gray-300"
                                                placeholder="+91 98765 43210"
                                            />
                                        ) : (
                                            <p className="mt-1.5 text-gray-900 font-medium">{customer.mobile}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-gray-700 font-medium">Date of Birth</Label>
                                        {isEditing ? (
                                            <Input
                                                type="date"
                                                value={editedData.profile?.dateOfBirth ?? customer.profile?.dateOfBirth ?? ''}
                                                onChange={(e) => updateNestedField('profile', 'dateOfBirth', e.target.value)}
                                                className="mt-1.5 border-gray-300"
                                            />
                                        ) : (
                                            <p className="mt-1.5 text-gray-900 font-medium">
                                                {customer.profile?.dateOfBirth ? formatDate(customer.profile.dateOfBirth) : 'Not provided'}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <Label className="text-gray-700 font-medium">Gender</Label>
                                        {isEditing ? (
                                            <Select
                                                value={editedData.profile?.gender ?? customer.profile?.gender ?? ''}
                                                onValueChange={(value) => updateNestedField('profile', 'gender', value)}
                                            >
                                                <SelectTrigger className="mt-1.5 border-gray-300">
                                                    <SelectValue placeholder="Select gender" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Male">Male</SelectItem>
                                                    <SelectItem value="Female">Female</SelectItem>
                                                    <SelectItem value="Other">Other</SelectItem>
                                                    <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        ) : (
                                            <p className="mt-1.5 text-gray-900 font-medium">{customer.profile?.gender || 'Not provided'}</p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <Label className="text-gray-700 font-medium">Bio</Label>
                                    {isEditing ? (
                                        <Textarea
                                            value={editedData.profile?.bio ?? customer.profile?.bio ?? ''}
                                            onChange={(e) => updateNestedField('profile', 'bio', e.target.value)}
                                            className="mt-1.5 border-gray-300"
                                            rows={3}
                                            placeholder="Tell us about yourself..."
                                        />
                                    ) : (
                                        <p className="mt-1.5 text-gray-700 leading-relaxed">
                                            {customer.profile?.bio || 'No bio provided'}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Address Information */}
                    <Card className="border-gray-200 shadow-md hover:shadow-lg transition-shadow">
                        <CardHeader className="bg-gray-50 border-b border-gray-200">
                            <CardTitle className="flex items-center gap-2 text-gray-900">
                                <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center">
                                    <MapPin className="w-5 h-5 text-white" />
                                </div>
                                Address Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="space-y-4">
                                {customer.address && customer.address.length > 0 ? (
                                    customer.address.map((addr, index) => (
                                        <div
                                            key={index}
                                            className="p-4 bg-gradient-to-br from-gray-50 to-white rounded-lg border-2 border-gray-200 hover:border-gray-300 transition-colors"
                                        >
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${addr.addressType === 'Home'
                                                        ? 'bg-blue-100'
                                                        : 'bg-purple-100'
                                                        }`}>
                                                        {addr.addressType === 'Home' ? (
                                                            <Home className={`w-5 h-5 ${addr.addressType === 'Home' ? 'text-blue-600' : 'text-purple-600'}`} />
                                                        ) : (
                                                            <Building className="w-5 h-5 text-purple-600" />
                                                        )}
                                                    </div>
                                                    <Badge variant="outline" className="border-gray-300 font-medium">
                                                        {addr.addressType}
                                                    </Badge>
                                                </div>
                                                {isEditing && (
                                                    <Button variant="ghost" size="sm" className="hover:bg-gray-100">
                                                        <Edit className="w-4 h-4 text-gray-600" />
                                                    </Button>
                                                )}
                                            </div>
                                            <div className="space-y-1.5 text-sm">
                                                <p className="font-semibold text-gray-900">{addr.street}</p>
                                                <p className="text-gray-700">{addr.city}, {addr.state} - {addr.zipCode}</p>
                                                <p className="text-gray-600 flex items-center gap-1">
                                                    <Globe className="w-3 h-3" />
                                                    {addr.country}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8 text-gray-500">
                                        <MapPin className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                                        <p>No addresses added yet</p>
                                    </div>
                                )}
                                {isEditing && (
                                    <Button
                                        variant="outline"
                                        className="w-full border-dashed border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                                    >
                                        <MapPin className="w-4 h-4 mr-2" />
                                        Add New Address
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Preferences & Settings */}
                    <Card className="border-gray-200 shadow-md hover:shadow-lg transition-shadow">
                        <CardHeader className="bg-gray-50 border-b border-gray-200">
                            <CardTitle className="flex items-center gap-2 text-gray-900">
                                <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center">
                                    <Globe className="w-5 h-5 text-white" />
                                </div>
                                Preferences & Settings
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            {/* Notifications */}
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                    <Bell className="w-4 h-4 text-gray-700" />
                                    Notifications
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                                        <div>
                                            <p className="font-medium text-gray-900 text-sm">Email Notifications</p>
                                            <p className="text-xs text-gray-600 mt-0.5">Receive booking updates via email</p>
                                        </div>
                                        <Switch
                                            checked={editedData.preferences?.emailNotifications ?? customer.preferences?.emailNotifications ?? false}
                                            onCheckedChange={(checked) => updateNestedField('preferences', 'emailNotifications', checked)}
                                            disabled={!isEditing}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                                        <div>
                                            <p className="font-medium text-gray-900 text-sm">SMS Notifications</p>
                                            <p className="text-xs text-gray-600 mt-0.5">Receive booking updates via SMS</p>
                                        </div>
                                        <Switch
                                            checked={editedData.preferences?.smsNotifications ?? customer.preferences?.smsNotifications ?? false}
                                            onCheckedChange={(checked) => updateNestedField('preferences', 'smsNotifications', checked)}
                                            disabled={!isEditing}
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>

    )
}

export default CustomerProfilePage;