import React, { useState } from "react";
import { Upload, FileType, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface UploadImeiProps {
  luckyDrawId: number;
}

const UploadImei: React.FC<UploadImeiProps> = ({ luckyDrawId }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setUploadStatus({
        type: "error",
        message: "Please select a file to upload.",
      });
      return;
    }

    setUploading(true);
    setUploadStatus(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("lucky_draw_system", luckyDrawId.toString());

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/offers/upload-imeino/`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        const data = await response.json();
        setUploadStatus({
          type: "success",
          message: data.message || "IMEI numbers uploaded successfully!",
        });
        setFile(null);
      } else {
        const errorData = await response.json();
        setUploadStatus({
          type: "error",
          message: errorData.error || "Upload failed: Unknown error",
        });
      }
    } catch (error) {
      console.error("Upload error:", error);
      setUploadStatus({
        type: "error",
        message: "An error occurred while uploading the file.",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          Upload IMEI Numbers
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label
              htmlFor="file"
              className="block text-sm font-medium text-gray-700"
            >
              Select File
            </Label>
            <div className="mt-1 flex items-center justify-center space-x-2">
              <Input
                id="file"
                type="file"
                onChange={handleFileChange}
                accept=".csv"
                className="flex-1"
              />
              <FileType className="h-5 w-5 text-gray-400" />
            </div>
          </div>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Only CSV files are allowed.</AlertDescription>
          </Alert>
          <Button
            type="submit"
            className="w-full"
            disabled={!file || uploading}
          >
            {uploading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                Uploading...
              </div>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload IMEI Numbers
              </>
            )}
          </Button>
        </form>
        {uploadStatus && (
          <Alert
            className={`mt-4 ${
              uploadStatus.type === "success" ? "bg-green-100" : "bg-red-100"
            }`}
          >
            <AlertDescription>{uploadStatus.message}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default UploadImei;
