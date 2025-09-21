import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Trash2, Gift, Plus } from "lucide-react";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";

interface ApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: OfferType[];
}

interface GiftItem {
  id: number;
  name: string;
  image: string;
  lucky_draw_system: number;
}

interface BaseOffer {
  id: number;
  lucky_draw_system_id: number;
}

interface MobilePhoneOffer extends BaseOffer {
  type: "mobile";
  start_date: string;
  end_date: string;
  daily_quantity: number;
  type_of_offer: string;
  offer_condition_value: string;
  sale_numbers: number[] | null;
  gift: GiftItem;
  valid_condition: number[];
  priority: number;
}

interface RechargeCardOffer extends BaseOffer {
  type: "recharge";
  start_date: string;
  end_date: string;
  daily_quantity: number;
  type_of_offer: string;
  offer_condition_value: string;
  sale_numbers: number[] | null;
  amount: number;
  provider: string;
  valid_condition: number[];
}

type OfferType = MobilePhoneOffer | RechargeCardOffer;

interface OffersProps {
  luckyDrawId: number;
}

const offerSchema = z.object({
  type: z.enum(["mobile", "recharge"]),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().min(1, "End date is required"),
  daily_quantity: z.number().min(1, "Daily quantity must be at least 1"),
  type_of_offer: z.enum([
    "After every certain sale",
    "At certain sale position",
  ]),
  offer_condition_value: z.string().min(1, "Offer condition value is required"),
  gift: z.number().optional(),
  amount: z.number().optional(),
  provider: z.string().optional(),
});

type OfferFormData = z.infer<typeof offerSchema>;

const Offers: React.FC<OffersProps> = ({ luckyDrawId }) => {
  const [offers, setOffers] = useState<OfferType[]>([]);
  const [giftItems, setGiftItems] = useState<GiftItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingOffer, setIsAddingOffer] = useState(false);
  const [totalOffers, setTotalOffers] = useState(0);

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<OfferFormData>({
    resolver: zodResolver(offerSchema),
    defaultValues: {
      type: "mobile",
      type_of_offer: "After every certain sale",
    },
  });

  const offerType = watch("type");
  const typeOfOffer = watch("type_of_offer");
  const dailyQuantity = watch("daily_quantity");

  useEffect(() => {
    fetchOffers();
    fetchGiftItems();
  }, [luckyDrawId]);

  const fetchOffers = async () => {
    setIsLoading(true);
    try {
      const [mobileOffers, rechargeOffers] = await Promise.all([
        fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/offers/mobile-phone-offers/?lucky_draw_system_id=${luckyDrawId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        ).then((res) => res.json()) as Promise<ApiResponse>,
        fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/offers/recharge-card-offers/?lucky_draw_system_id=${luckyDrawId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        ).then((res) => res.json()) as Promise<ApiResponse>,
      ]);

      const allOffers = [...mobileOffers.results, ...rechargeOffers.results];
      setOffers(allOffers);
      setTotalOffers(mobileOffers.count + rechargeOffers.count);
    } catch (error) {
      console.error("Error fetching offers:", error);
      toast({
        title: "Error",
        description: "Failed to fetch offers",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchGiftItems = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/offers/gift-items/?lucky_draw_system_id=${luckyDrawId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      const data = await response.json();
      setGiftItems(data.results);
    } catch (error) {
      console.error("Error fetching gift items:", error);
      toast({
        title: "Error",
        description: "Failed to fetch gift items",
        variant: "destructive",
      });
    }
  };

  const onSubmit = async (data: OfferFormData) => {
    setIsAddingOffer(true);
    try {
      let endpoint = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/offers/`;
      endpoint +=
        data.type === "mobile"
          ? `mobile-phone-offers/`
          : `recharge-card-offers/`;

      const offerData = {
        ...data,
        lucky_draw_system: luckyDrawId,
        sale_numbers:
          data.type_of_offer === "At certain sale position"
            ? data.offer_condition_value.split(",").map(Number)
            : null,
        priority: 0,
      };

      // check if sales numbers are valid for the offer i.e should be equal to daily quantity and should be unique numbers

      if (offerData.type_of_offer === "At certain sale position") {
        const salesNumbers = offerData.offer_condition_value
          .split(",")
          .map(Number);
        if (salesNumbers.length !== offerData.daily_quantity) {
          alert("Number of sales numbers should be equal to daily quantity");
        }
        if (new Set(salesNumbers).size !== salesNumbers.length) {
          alert("Sales numbers should be unique numbers");
        }
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify(offerData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add offer");
      }

      const addedOffer = await response.json();
      setOffers([...offers, addedOffer]);
      setTotalOffers(totalOffers + 1);
      toast({
        title: "Success",
        description: "Offer added successfully",
      });
      reset();
    } catch (error) {
      console.error("Error adding offer:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to add offer",
        variant: "destructive",
      });
    } finally {
      setIsAddingOffer(false);
    }
  };

  const handleDeleteOffer = async (id: number, type: "mobile" | "recharge") => {
    try {
      const endpoint = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/offers/${
        type === "mobile" ? "mobile-phone-offers" : "recharge-card-offers"
      }/${id}/`;

      const response = await fetch(endpoint, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete offer");
      }

      setOffers(offers.filter((offer) => offer.id !== id));
      setTotalOffers(totalOffers - 1);
      toast({
        title: "Success",
        description: "Offer deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting offer:", error);
      toast({
        title: "Error",
        description: "Failed to delete offer",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div>Loading offers...</div>;
  }

  return (
    <Card className="w-full shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between bg-gray-50 p-6 border-b">
        <CardTitle className="text-2xl font-bold text-gray-800">
          All Offers
        </CardTitle>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-teal-600 hover:bg-teal-700 text-white">
              <Plus className="mr-2 h-4 w-4" /> Add New Offer
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-white">
            <DialogHeader>
              <DialogTitle>Add New Offer</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select offer type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mobile">Mobile Phone Offer</SelectItem>
                      <SelectItem value="recharge">
                        Recharge Card Offer
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {offerType === "mobile" && (
                <Controller
                  name="gift"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      defaultValue={field.value?.toString()}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a gift" />
                      </SelectTrigger>
                      <SelectContent>
                        {giftItems.map((gift) => (
                          <SelectItem key={gift.id} value={gift.id.toString()}>
                            {gift.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              )}
              <Controller
                name="start_date"
                control={control}
                render={({ field }) => (
                  <Input type="date" placeholder="Start Date" {...field} />
                )}
              />
              {errors.start_date && (
                <p className="text-red-500">{errors.start_date.message}</p>
              )}
              <Controller
                name="end_date"
                control={control}
                render={({ field }) => (
                  <Input type="date" placeholder="End Date" {...field} />
                )}
              />
              {errors.end_date && (
                <p className="text-red-500">{errors.end_date.message}</p>
              )}
              <Controller
                name="daily_quantity"
                control={control}
                render={({ field }) => (
                  <Input
                    type="number"
                    placeholder="Daily Quantity"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                )}
              />
              {errors.daily_quantity && (
                <p className="text-red-500">{errors.daily_quantity.message}</p>
              )}
              <Controller
                name="type_of_offer"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select offer condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="After every certain sale">
                        After every certain sale
                      </SelectItem>
                      <SelectItem value="At certain sale position">
                        At certain sale position
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {typeOfOffer === "After every certain sale" && (
                <p className="text-sm text-gray-500">
                  Enter a number to specify after how many sales the offer
                  should be given.
                </p>
              )}
              <Controller
                name="offer_condition_value"
                control={control}
                render={({ field }) => (
                  <Input
                    placeholder={
                      typeOfOffer === "After every certain sale"
                        ? "Enter a number"
                        : `Enter ${dailyQuantity} numbers separated by commas`
                    }
                    {...field}
                  />
                )}
              />
              {errors.offer_condition_value && (
                <p className="text-red-500">
                  {errors.offer_condition_value.message}
                </p>
              )}
              {typeOfOffer === "After every certain sale" && (
                <p className="text-sm text-gray-500">
                  Your offer will be <br />
                  {(() => {
                    const values = Array.from(
                      { length: dailyQuantity },
                      (_, i) => i + 1
                    ).map(
                      (num) => num * parseInt(watch("offer_condition_value"))
                    );

                    if (values.length > 5) {
                      return [
                        ...values.slice(0, 3),
                        "...",
                        ...values.slice(-2),
                      ].join(", ");
                    } else {
                      return values.join(", ");
                    }
                  })()}
                </p>
              )}
              {typeOfOffer === "At certain sale position" && (
                <p className="text-sm text-gray-500">
                  Enter {dailyQuantity} numbers separated by commas to specify
                  the exact sale positions for the offer.
                </p>
              )}

              {offerType === "recharge" && (
                <>
                  <Controller
                    name="amount"
                    control={control}
                    render={({ field }) => (
                      <Input
                        type="number"
                        placeholder="Amount"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value))
                        }
                      />
                    )}
                  />
                  <Controller
                    name="provider"
                    control={control}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select provider" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Ncell">Ncell</SelectItem>
                          <SelectItem value="Ntc">Ntc</SelectItem>
                          <SelectItem value="Smart Cell">Smart Cell</SelectItem>
                          <SelectItem value="Others">Others</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </>
              )}
              <Button
                type="submit"
                className="w-full bg-teal-600 hover:bg-teal-700"
                disabled={isAddingOffer}
              >
                <Gift className="mr-2 h-4 w-4" />
                {isAddingOffer ? "Adding..." : "Add Offer"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="p-6">
        {offers.length === 0 ? (
          <div className="text-center py-4">No offers available</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100">
                <TableHead className="font-semibold">Type</TableHead>
                <TableHead className="font-semibold">Date Range</TableHead>
                <TableHead className="font-semibold">Daily Quantity</TableHead>
                <TableHead className="font-semibold">Offer Condition</TableHead>
                <TableHead className="font-semibold">Gift/Amount</TableHead>
                <TableHead className="font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {offers.map((offer) => (
                <TableRow key={offer.id} className="hover:bg-gray-50">
                  <TableCell>
                    {"gift" in offer
                      ? "Mobile Phone Offer"
                      : "Recharge Card Offer"}
                  </TableCell>
                  <TableCell>
                    {`${format(
                      new Date(offer.start_date),
                      "MMM dd, yyyy"
                    )} - ${format(new Date(offer.end_date), "MMM dd, yyyy")}`}
                  </TableCell>
                  <TableCell>{offer.daily_quantity}</TableCell>
                  <TableCell>
                    {`${offer.type_of_offer}: ${
                      offer.type_of_offer === "At certain sale position"
                        ? offer.sale_numbers?.join(", ") || "N/A"
                        : offer.offer_condition_value
                    }`}
                  </TableCell>
                  <TableCell>
                    {"gift" in offer
                      ? offer.gift.name
                      : `${offer.amount} (${offer.provider})`}
                  </TableCell>
                  <TableCell>
                    <Button
                      onClick={() =>
                        handleDeleteOffer(
                          offer.id,
                          "gift" in offer ? "mobile" : "recharge"
                        )
                      }
                      size="sm"
                      variant="ghost"
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default Offers;
