import { z } from "zod";

// Phone
export const phoneSchema = z.object({
  phoneCode: z.string().min(1, "Country code is required"),
  phoneNumber: z
    .string()
    .min(5, "Phone number must be at least 5 digits")
    .regex(/^\d+$/, "Digits only"),
});
export type Phone = z.infer<typeof phoneSchema>;

// Restaurant form
export const restaurantFormSchema = z.object({
  name: z.string().min(2, "Restaurant name must be at least 2 characters."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  cuisineType: z.string().min(1, "Please select a cuisine type."),
  restaurantType: z.string().min(1, "Please select a restaurant type."),
  address: z.string().min(5, "Address must be at least 5 characters."),
  city: z.string().min(2, "City must be at least 2 characters."),
  district: z.string().min(2, "District must be at least 2 characters."),
  phone: phoneSchema,
  email: z.string().email("Please enter a valid email address."),
});
export type RestaurantFormValues = z.infer<typeof restaurantFormSchema>;

// initail defaults form of branch profile (pending .....)
export const defaultRestaurantValues: Partial<RestaurantFormValues> = {
  name: "",
  description: "",
  cuisineType: "",
  restaurantType: "",
  address: "",
  city: "",
  district: "",
  phone: { phoneCode: "855", phoneNumber: "" },
  email: "",
};
