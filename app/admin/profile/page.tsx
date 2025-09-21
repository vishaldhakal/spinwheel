// pages/profile.tsx or app/profile/page.tsx (depending on your Next.js setup)

"use client";

import React from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { User, Mail, Phone, Building, Calendar } from "lucide-react";

interface UserType {
  id: number;
  email: string;
  role: string;
  organization: {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
  };
  phone_number: string | null;
  is_active: boolean;
}

const ProfilePage: React.FC = () => {
  const { user } = useAuth() as { user: UserType };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <Card className="w-full">
        <CardHeader className="pb-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="text-2xl">
                {user?.email[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl font-bold">
                {user?.email}
              </CardTitle>
              <Badge
                className="mt-1"
                variant={user?.is_active ? "outline" : "destructive"}
              >
                {user?.is_active ? "Active" : "Inactive"}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-gray-500" />
              <span className="font-medium">Role:</span>
              <span>{user?.role}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="h-5 w-5 text-gray-500" />
              <span className="font-medium">Email:</span>
              <span>{user?.email}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="h-5 w-5 text-gray-500" />
              <span className="font-medium">Phone:</span>
              <span>{user?.phone_number || "Not provided"}</span>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-semibold mb-2">
                Organization Details
              </h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Building className="h-5 w-5 text-gray-500" />
                  <span className="font-medium">Name:</span>
                  <span>{user?.organization?.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-gray-500" />
                  <span className="font-medium">Joined:</span>
                  <span>{formatDate(user?.organization?.created_at)}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
