"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { restaurantFormSchema, type RestaurantFormValues, defaultRestaurantValues } from "@/lib/validation";
import { useToast } from "@/hooks/use-toast";
import { useCity, useCuisineTypes, useDiningTypes } from "@/hooks";
import { useBranchById } from "@/hooks";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { InputField, PhoneField, SelectField } from "../inputfields";
import { RestaurantHours } from "@/components/dashboard/restaurant-hours";
import { RestaurantGallery } from "@/components/dashboard/restaurant-gallery";
import { Permission } from "../types";

type TabKey = "profile" | "hours" | "gallery";
interface BranchsfromProps {
  branchId?: string;
  mode?: string;
}

export default function Branchsfrom({ branchId, mode = "edit" }: BranchsfromProps) {
  const { toast } = useToast();

  // data hooks for selects
  const { data: cuisineData, isError: cuisineError } = useCuisineTypes(20, 0);
  const { data: diningData, isError: diningError } = useDiningTypes(20, 0);
  const { data: cityData, isError: cityError } = useCity(20, 0);

  const isViewOnly = mode === Permission.VIEW || mode === "view";
  const isCreate = mode === Permission.CREATE || mode === "create";
  const isEdit = mode === Permission.EDIT || mode === "edit";

  // fetch branch only for edit/view
  const {
    data: branchData,
    isLoading: isBranchLoading,
    isError: isBranchError,
  } = useBranchById(!isCreate ? branchId : undefined);

  // defaults
  const defaultValues = useMemo<Partial<RestaurantFormValues>>(
    () => ({
      ...defaultRestaurantValues,
      // in create you can keep selects empty so Zod required kicks in
      ...(isCreate
        ? { cuisineType: "", restaurantType: "" }
        : {}),
      phone: { phoneCode: "855", phoneNumber: "" },
    }),
    [isCreate]
  );

  // form
  const form = useForm<RestaurantFormValues>({
    resolver: zodResolver(restaurantFormSchema),
    defaultValues,
    mode: "onChange",
  });

  // map API → form shape (robust to slight API differences)
  const normalizePhone = (input: any): { phoneCode: string; phoneNumber: string } => {
    if (input && typeof input === "object" && "phoneCode" in input) {
      return {
        phoneCode: String(input.phoneCode ?? "855"),
        phoneNumber: String(input.phoneNumber ?? ""),
      };
    }
    const raw = String(input ?? "");
    if (!raw) return { phoneCode: "855", phoneNumber: "" };
    const digits = raw.replace(/\D/g, "");
    // naive split: first 1–4 as code, rest as number
    const match = digits.match(/^(\d{1,4})(\d{4,})$/);
    if (match) return { phoneCode: match[1], phoneNumber: match[2] };
    return { phoneCode: "855", phoneNumber: digits };
  };

  const firstId = (v: unknown): string => {
  if (Array.isArray(v) && v.length > 0 && typeof v[0] === "string") return v[0] as string;
  if (typeof v === "string") return v;
  return "";
};

  const branchToForm = (b: any): RestaurantFormValues => ({
    name: b?.name ?? "",
    description: b?.description ?? "",
    cuisineType: firstId(b?.cuisineTypeIds) || b?.cuisineTypeId || b?.cuisineType || "",
    restaurantType: firstId(b?.diningStyleIds) || b?.restaurantTypeId || b?.restaurantType || "",
    address: b?.address ?? "",
    city: firstId(b?.city),
    district: b?.district ?? "",
    phone: normalizePhone(
      b?.phone ??
      (b?.phoneCode ? { phoneCode: b.phoneCode, phoneNumber: b.phoneNumber } : undefined) ??
      b?.contactPhone
    ),
    email: b?.email ?? b?.contactEmail ?? "",
  });

  // when branch loads in edit/view, hydrate the form
  useEffect(() => {
    if ((isEdit || isViewOnly) && branchData) {
      const values = branchToForm(branchData);
      form.reset(values, { keepDirtyValues: false });
    }
  }, [branchData, isEdit, isViewOnly, form]);

  // stepper
  const [tab, setTab] = useState<TabKey>("profile");
  const [completed, setCompleted] = useState<{ profile: boolean; hours: boolean }>({
    profile: false,
    hours: false,
  });

  const canOpenHours = isViewOnly || completed.profile;
  const canOpenGallery = isViewOnly || completed.hours;

  const handleTabChange = (next: string) => {
    const nextTab = next as TabKey;
    if (!isViewOnly) {
      if (nextTab === "hours" && !canOpenHours) {
        toast({
          title: "Complete Restaurant Profile first",
          description: "Click Next on the profile step to proceed.",
          variant: "destructive",
        });
        return;
      }
      if (nextTab === "gallery" && !canOpenGallery) {
        toast({
          title: "Finish Opening Hours first",
          description: "Click Next on the hours step to proceed.",
          variant: "destructive",
        });
        return;
      }
    }
    setTab(nextTab);
  };

  const handleProfileNext = async () => {
    if (isViewOnly) return;
    const ok = await form.trigger(undefined, { shouldFocus: true });
    if (!ok) return;
    setCompleted((s) => ({ ...s, profile: true }));
    toast({ title: "Profile complete", description: "Opening Hours is unlocked." });
  };

  const handleHoursNext = () => {
    if (isViewOnly) return;
    setCompleted((s) => ({ ...s, hours: true }));
    toast({ title: "Hours complete", description: "Photo Gallery is unlocked." });
  };

  // basic UX handling for branch fetch
  useEffect(() => {
    if (isBranchError) {
      toast({
        title: "Failed to load branch",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    }
  }, [isBranchError, toast]);

  const disableFormUI = isViewOnly || (isBranchLoading && (isEdit || !isCreate));

  return (
    <Tabs value={tab} onValueChange={handleTabChange} className="space-y-6">
      <TabsList className="grid w-full grid-cols-3 md:w-auto">
        <TabsTrigger value="profile">Restaurant Profile</TabsTrigger>
        <TabsTrigger value="hours" disabled={!canOpenHours}>Opening Hours</TabsTrigger>
        <TabsTrigger value="gallery" disabled={!canOpenGallery}>Photo Gallery</TabsTrigger>
      </TabsList>

      {/* Profile */}
      <TabsContent value="profile" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Restaurant Information</CardTitle>
            <CardDescription>
              {isBranchLoading && (isEdit || isViewOnly)
                ? "Loading branch details…"
                : "Update your restaurant's basic information."}
            </CardDescription>
          </CardHeader>

          <Form {...form}>
            <form className="contents">
              <CardContent className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <InputField
                    control={form.control}
                    name="name"
                    label="Restaurant Name"
                    placeholder="Fine Dining Restaurant"
                    disabled={disableFormUI}
                  />
                  <PhoneField
                    control={form.control}
                    name="phone"
                    label="Phone Number"
                    placeholder="12457709"
                    disabled={disableFormUI}
                  />
                </div>

                <InputField
                  control={form.control}
                  name="email"
                  label="Email Address"
                  placeholder="contact@restaurant.com"
                  disabled={disableFormUI}
                />

                <div className="grid gap-6 sm:grid-cols-2">
                  <SelectField
                    control={form.control}
                    name="cuisineType"
                    label="Cuisine Type"
                    placeholder="Select cuisine type"
                    data={cuisineData}
                    isError={cuisineError}
                    disabled={disableFormUI}
                  />
                  <SelectField
                    control={form.control}
                    name="restaurantType"
                    label="Restaurant Type"
                    placeholder="Select dining type"
                    data={diningData}
                    isError={diningError}
                    errorText="Error loading dining"
                    disabled={disableFormUI}
                  />
                </div>

                <InputField
                  control={form.control}
                  name="description"
                  label="Description"
                  placeholder="Describe your restaurant..."
                  type="textarea"
                  description="Describe your restaurant, cuisine, atmosphere, and what makes it special."
                  className="min-h-[120px] resize-y"
                  disabled={disableFormUI}
                />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Location</h3>

                  <InputField
                    control={form.control}
                    name="address"
                    label="Street Address"
                    placeholder="e.g., 123 Norodom Blvd"
                    disabled={disableFormUI}
                  />

                  <div className="grid gap-6 sm:grid-cols-2">
                    <SelectField
                      control={form.control}
                      name="city"
                      label="City"
                      placeholder="Select city"
                      data={cityData}
                      isError={cityError}
                      errorText="Error loading city"
                      disabled={disableFormUI}
                    />
                    <InputField
                      control={form.control}
                      name="district"
                      label="District"
                      placeholder="e.g., Chamkarmon"
                      disabled={disableFormUI}
                    />
                  </div>

                  <div className="aspect-video relative rounded-lg border bg-muted flex items-center justify-center">
                    <p className="text-muted-foreground">Map location selector will be displayed here</p>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex justify-end gap-3 border-t px-6 py-4">
                <Button variant="outline" type="button" disabled={disableFormUI}>
                  Cancel
                </Button>
                {!isViewOnly && (
                  <Button type="button" onClick={handleProfileNext} disabled={isBranchLoading}>
                    Next
                  </Button>
                )}
              </CardFooter>
            </form>
          </Form>
        </Card>
      </TabsContent>

      {/* Hours (static for now) */}
      <TabsContent value="hours">
        <Card>
          <CardHeader>
            <CardTitle>Opening Hours</CardTitle>
            <CardDescription>Set your restaurant's regular opening hours.</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <RestaurantHours />
          </CardContent>

          <CardFooter className="flex justify-end gap-3 border-t px-6 py-4">
            <Button
              variant="outline"
              type="button"
              onClick={() => setTab("profile")}
              disabled={isViewOnly}
            >
              Back
            </Button>
            {!isViewOnly && (
              <Button type="button" onClick={handleHoursNext}>
                Next
              </Button>
            )}
          </CardFooter>
        </Card>
      </TabsContent>

      {/* Gallery (static for now) */}
      <TabsContent value="gallery">
        <Card>
          <CardHeader>
            <CardTitle>Photo Gallery</CardTitle>
            <CardDescription>
              Upload and manage photos of your restaurant, dishes, and ambiance.
            </CardDescription>
          </CardHeader>

        <CardContent>
            <RestaurantGallery />
          </CardContent>

          <CardFooter className="flex justify-end gap-3 border-t px-6 py-4">
            <Button
              variant="outline"
              type="button"
              onClick={() => setTab("hours")}
              disabled={isViewOnly}
            >
              Back
            </Button>
            {!isViewOnly && (
              <Button
                type="button"
                onClick={() =>
                  toast({ title: "All set!", description: "You’ve completed all steps." })
                }
              >
                Finish
              </Button>
            )}
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

