"use client";

import React, { useState, useEffect } from "react";
import {
  Gift,
  Tag,
  ArrowLeft,
  Edit2Icon,
  BarChart,
  User,
  Building,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import LuckyDrawDetails from "./manage-lucky-draw/LuckyDrawDetails";
import GiftItems from "./manage-lucky-draw/GiftItems";
import Offers from "./manage-lucky-draw/Offers";
import UploadImei from "./manage-lucky-draw/UploadImei";
import { LuckyDraw } from "@/app/types/luckyDraw";
import { fetchLuckyDraws } from "@/lib/api";
import Analytics from "./manage-lucky-draw/Analytics";
import { useAuth } from "@/components/providers/AuthProvider";

const ManageLuckyDraw: React.FC = () => {
  const [luckyDraws, setLuckyDraws] = useState<LuckyDraw[]>([]);
  const [selectedDraw, setSelectedDraw] = useState<LuckyDraw | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const getLuckyDraws = async () => {
      try {
        const data = await fetchLuckyDraws();
        setLuckyDraws(data.results);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    getLuckyDraws();
  }, []);

  const handleDrawClick = (draw: LuckyDraw) => setSelectedDraw(draw);
  const handleBackToList = () => setSelectedDraw(null);
  const handleUpdateDraw = (updatedDraw: LuckyDraw) => {
    setLuckyDraws(
      luckyDraws.map((draw) =>
        draw.id === updatedDraw.id ? updatedDraw : draw
      )
    );
    setSelectedDraw(updatedDraw);
  };

  const getStatus = (
    startDate: string,
    endDate: string
  ): "Active" | "Completed" | "Upcoming" => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (now < start) return "Upcoming";
    if (now > end) return "Completed";
    return "Active";
  };

  const getStatusColor = (status: "Active" | "Completed" | "Upcoming") => {
    const colors = {
      Active: "bg-green-500",
      Completed: "bg-blue-500",
      Upcoming: "bg-yellow-500",
    };
    return colors[status];
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  if (error)
    return (
      <div className="text-red-500 text-center mt-8 p-4 bg-red-100 rounded-lg">
        Error: {error}
      </div>
    );

  if (selectedDraw) {
    return (
      <div className="flex flex-col h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button
          onClick={handleBackToList}
          variant="outline"
          className="mb-6 text-gray-600 hover:text-gray-800 self-start transition-colors duration-200"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to List
        </Button>
        <Card className="bg-white rounded-lg overflow-hidden border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white p-6">
            <div className="flex justify-between items-center">
              <CardTitle className="text-3xl font-bold">
                {selectedDraw.name}
              </CardTitle>
              <Badge
                className={`${getStatusColor(
                  getStatus(selectedDraw.start_date, selectedDraw.end_date)
                )} text-white px-3 py-1 text-sm font-medium rounded-full`}
              >
                {getStatus(selectedDraw.start_date, selectedDraw.end_date)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="w-full justify-start bg-gray-100 h-20 p-4 space-x-4">
                {[
                  { value: "details", label: "General", icon: null },
                  { value: "gifts", label: "Gifts", icon: Gift },
                  { value: "offers", label: "Offers", icon: Tag },
                  { value: "upload-imei", label: "Upload IMEI", icon: Upload },
                  { value: "analytics", label: "Analytics", icon: BarChart },
                ].map(({ value, label, icon: Icon }) => (
                  <TabsTrigger
                    key={value}
                    value={value}
                    className="data-[state=active]:bg-white px-4 py-4 rounded-md transition-all duration-200 hover:bg-gray-200"
                  >
                    {Icon && <Icon className="mr-2 h-4 w-4" />}
                    {label}
                  </TabsTrigger>
                ))}
              </TabsList>
              <TabsContent value="details" className="p-6">
                <LuckyDrawDetails
                  luckyDraw={selectedDraw}
                  onUpdate={handleUpdateDraw}
                />
              </TabsContent>
              <TabsContent value="gifts" className="p-6">
                <GiftItems luckyDrawId={selectedDraw.id} />
              </TabsContent>
              <TabsContent value="offers" className="p-6">
                <Offers luckyDrawId={selectedDraw.id} />
              </TabsContent>
              <TabsContent value="upload-imei" className="p-6">
                <UploadImei luckyDrawId={selectedDraw.id} />
              </TabsContent>
              <TabsContent value="analytics" className="p-6">
                <Analytics luckyDrawId={selectedDraw.id} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Lucky Draw Systems</h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-gray-100 rounded-full px-4 py-2">
            <User className="h-5 w-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">
              {user?.email}
            </span>
          </div>
          <div className="flex items-center space-x-2 bg-gray-100 rounded-full px-4 py-2">
            <Building className="h-5 w-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">
              {user?.organization?.name}
            </span>
          </div>
          <Badge className="bg-blue-500 text-white">{user?.role}</Badge>
        </div>
      </div>
      <Card className="bg-white rounded-lg overflow-hidden flex-1 shadow-lg">
        <CardContent className="p-6">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold text-lg">Name</TableHead>
                <TableHead className="font-semibold text-lg">
                  Date Range
                </TableHead>
                <TableHead className="font-semibold text-lg">Status</TableHead>
                <TableHead className="font-semibold text-lg">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {luckyDraws.map((draw) => {
                const status = getStatus(draw.start_date, draw.end_date);
                return (
                  <TableRow
                    key={draw.id}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <TableCell className="font-medium text-lg">
                      {draw.name}
                    </TableCell>
                    <TableCell>{`${new Date(
                      draw.start_date
                    ).toLocaleDateString()} to ${new Date(
                      draw.end_date
                    ).toLocaleDateString()}`}</TableCell>
                    <TableCell>
                      <Badge
                        className={`inline-block ${getStatusColor(
                          status
                        )} text-white px-3 py-1 rounded-full`}
                      >
                        {status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        className="h-10 w-10 p-2 hover:bg-gray-200 rounded-full transition-colors duration-200"
                        onClick={() => handleDrawClick(draw)}
                      >
                        <Edit2Icon className="h-5 w-5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManageLuckyDraw;
