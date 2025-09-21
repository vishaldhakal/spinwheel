import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LuckyDraw } from "@/app/types/luckyDraw";
import { toast } from "@/hooks/use-toast";
import Image from "next/image";
import { Editor } from "@tinymce/tinymce-react";

interface LuckyDrawDetailsProps {
  luckyDraw: LuckyDraw;
  onUpdate: (updatedDraw: LuckyDraw) => void;
}

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.string().min(1, "Type is required"),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().min(1, "End date is required"),
  description: z.string().min(1, "Description is required"),
  how_to_participate: z.string().min(1, "How to participate is required"),
  redeem_condition: z.string().min(1, "Redeem condition is required"),
  terms_and_conditions: z.string().min(1, "Terms and conditions are required"),
  background_image: z.any(),
  hero_image: z.any(),
  main_offer_stamp_image: z.any(),
  qr: z.any(),
});

type FormData = z.infer<typeof schema>;

const LuckyDrawDetails: React.FC<LuckyDrawDetailsProps> = ({
  luckyDraw,
  onUpdate,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [previewImages, setPreviewImages] = useState<{ [key: string]: string }>(
    {
      background_image: luckyDraw.background_image || "",
      hero_image: luckyDraw.hero_image || "",
      main_offer_stamp_image: luckyDraw.main_offer_stamp_image || "",
      qr: luckyDraw.qr || "",
    }
  );

  const {
    control,
    handleSubmit,
    formState: { errors, dirtyFields },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: luckyDraw.name || "",
      type: luckyDraw.type || "",
      start_date: luckyDraw.start_date
        ? new Date(luckyDraw.start_date).toISOString().split("T")[0]
        : "",
      end_date: luckyDraw.end_date
        ? new Date(luckyDraw.end_date).toISOString().split("T")[0]
        : "",
      description: luckyDraw.description || "",
      how_to_participate: luckyDraw.how_to_participate || "",
      redeem_condition: luckyDraw.redeem_condition || "",
      terms_and_conditions: luckyDraw.terms_and_conditions || "",
      background_image: luckyDraw.background_image || undefined,
      hero_image: luckyDraw.hero_image || undefined,
      main_offer_stamp_image: luckyDraw.main_offer_stamp_image || undefined,
      qr: luckyDraw.qr || undefined,
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    const formData = new FormData();

    Object.keys(dirtyFields).forEach((key) => {
      const field = key as keyof FormData;
      if (data[field] instanceof FileList) {
        formData.append(field, data[field][0]);
      } else {
        formData.append(field, data[field] as string);
      }
    });

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/offers/lucky-draw-systems/${luckyDraw.id}/`,
        {
          method: "PATCH",
          body: formData,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update lucky draw");
      }

      const updatedDraw = await response.json();
      onUpdate(updatedDraw);
      toast({
        title: "Success",
        description: "Lucky draw updated successfully",
      });
    } catch (error) {
      console.error("Error updating lucky draw:", error);
      toast({
        title: "Error",
        description: "Failed to update lucky draw",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof typeof previewImages
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImages((prev) => ({
          ...prev,
          [field]: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const inputFields = [
    { name: "name", label: "Name", type: "text" },
    { name: "type", label: "Type", type: "text" },
    { name: "start_date", label: "Start Date", type: "date" },
    { name: "end_date", label: "End Date", type: "date" },
    { name: "background_image", label: "Background Image", type: "file" },
    { name: "hero_image", label: "Hero Image", type: "file" },
    {
      name: "main_offer_stamp_image",
      label: "Main Offer Stamp Image",
      type: "file",
    },
    { name: "qr", label: "QR Code", type: "file" },
  ];

  const editorFields = [
    { name: "description", label: "Description" },
    { name: "how_to_participate", label: "How to Participate" },
    { name: "redeem_condition", label: "Redeem Condition" },
    { name: "terms_and_conditions", label: "Terms and Conditions" },
  ];

  return (
    <Card className="border shadow-lg rounded-lg overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
        <CardTitle className="text-2xl font-bold">Lucky Draw Details</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {inputFields.map((field) => (
              <div key={field.name} className="space-y-2">
                <Label
                  htmlFor={field.name}
                  className="text-sm font-medium text-gray-700"
                >
                  {field.label}
                </Label>
                <Controller
                  name={field.name as keyof FormData}
                  control={control}
                  render={({ field: { onChange, value, ...rest } }) =>
                    field.type === "file" ? (
                      <div className="space-y-2">
                        <Input
                          type="file"
                          onChange={(e) => {
                            onChange(e.target.files);
                            handleImageChange(
                              e,
                              field.name as keyof typeof previewImages
                            );
                          }}
                          {...rest}
                          className="w-full p-2 border rounded-md"
                        />
                        {(previewImages[
                          field.name as keyof typeof previewImages
                        ] ||
                          value) && (
                          <div className="relative w-full h-64 rounded-md">
                            <Image
                              src={
                                previewImages[
                                  field.name as keyof typeof previewImages
                                ] || (value as string)
                              }
                              alt={field.label}
                              layout="fill"
                              objectFit="cover"
                              className="rounded-md"
                            />
                          </div>
                        )}
                      </div>
                    ) : (
                      <Input
                        type={field.type}
                        {...rest}
                        onChange={onChange}
                        value={value as string}
                        className="w-full p-2 border rounded-md"
                      />
                    )
                  }
                />
                {errors[field.name as keyof FormData] && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors[field.name as keyof FormData]?.message?.toString()}
                  </p>
                )}
              </div>
            ))}
          </div>
          {editorFields.map((field) => (
            <div key={field.name} className="space-y-2">
              <Label
                htmlFor={field.name}
                className="text-sm font-medium text-gray-700"
              >
                {field.label}
              </Label>
              <Controller
                name={field.name as keyof FormData}
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Editor
                    apiKey={"y6sw7x5cv41l7bibnjsbaye2dt14gvi9g8o5acnqzzls1uzf"}
                    init={{
                      height: 300,
                      menubar: false,
                      plugins: [
                        "advlist autolink lists link image charmap print preview anchor",
                        "searchreplace visualblocks code fullscreen",
                        "insertdatetime media table paste code help wordcount",
                      ],
                      toolbar:
                        "undo redo | formatselect | bold italic backcolor | \
                        alignleft aligncenter alignright alignjustify | \
                        bullist numlist outdent indent | removeformat | help",
                    }}
                    onEditorChange={onChange}
                    initialValue={value as string}
                  />
                )}
              />
              {errors[field.name as keyof FormData] && (
                <p className="text-red-500 text-sm mt-1">
                  {errors[field.name as keyof FormData]?.message?.toString()}
                </p>
              )}
            </div>
          ))}
          <div className="flex justify-end">
            <Button
              type="submit"
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-md hover:from-blue-600 hover:to-purple-600 transition duration-300"
              disabled={isLoading}
            >
              {isLoading ? "Updating..." : "Update Details"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default LuckyDrawDetails;
