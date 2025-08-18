"use client"

import { useState } from 'react'
import Link from 'next/link'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { RestaurantGallery } from '@/components/dashboard/restaurant-gallery'
import { RestaurantHours } from '@/components/dashboard/restaurant-hours'

const restaurantFormSchema = z.object({
  name: z.string().min(2, {
    message: "Restaurant name must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  cuisineType: z.string({
    required_error: "Please select a cuisine type.",
  }),
  restaurantType: z.string({
    required_error: "Please select a restaurant type.",
  }),
  address: z.string().min(5, {
    message: "Address must be at least 5 characters.",
  }),
  city: z.string().min(2, {
    message: "City must be at least 2 characters.",
  }),
  district: z.string().min(2, {
    message: "District must be at least 2 characters.",
  }),
  phone: z.string().min(5, {
    message: "Phone number must be at least 5 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
})

type RestaurantFormValues = z.infer<typeof restaurantFormSchema>

export default function RestaurantPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  // Default values for the form
  const defaultValues: Partial<RestaurantFormValues> = {
    name: "Phnom Penh Fine Dining",
    description: "Authentic Cambodian cuisine with a modern twist. Our restaurant offers a premium dining experience with locally sourced ingredients and traditional recipes reimagined for the contemporary palate.",
    cuisineType: "cambodian",
    restaurantType: "fine-dining",
    address: "123 Norodom Blvd",
    city: "Phnom Penh",
    district: "Chamkarmon",
    phone: "+855 12 345 678",
    email: "info@phnompenhfinedining.com",
  }

  const form = useForm<RestaurantFormValues>({
    resolver: zodResolver(restaurantFormSchema),
    defaultValues,
  })

  function onSubmit(data: RestaurantFormValues) {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      console.log(data)
      toast({
        title: "Restaurant updated",
        description: "Your restaurant information has been updated successfully.",
      })
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Restaurant</h1>
        <p className="text-muted-foreground">
          Manage your restaurant information, opening hours, and images.
        </p>
      </div>
      
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 md:w-auto">
          <TabsTrigger value="profile">Restaurant Profile</TabsTrigger>
          <TabsTrigger value="hours">Opening Hours</TabsTrigger>
          <TabsTrigger value="gallery">Photo Gallery</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Restaurant Information</CardTitle>
              <CardDescription>
                Update your restaurant's basic information.
              </CardDescription>
            </CardHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent className="space-y-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Restaurant Name</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Fine Dining Restaurant" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., +855 12 345 678" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., contact@restaurant.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid gap-6 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="cuisineType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cuisine Type</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select cuisine type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="cambodian">Cambodian</SelectItem>
                              <SelectItem value="chinese">Chinese</SelectItem>
                              <SelectItem value="french">French</SelectItem>
                              <SelectItem value="italian">Italian</SelectItem>
                              <SelectItem value="japanese">Japanese</SelectItem>
                              <SelectItem value="korean">Korean</SelectItem>
                              <SelectItem value="thai">Thai</SelectItem>
                              <SelectItem value="vietnamese">Vietnamese</SelectItem>
                              <SelectItem value="fusion">Fusion</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="restaurantType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Restaurant Type</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select restaurant type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="casual">Casual Dining</SelectItem>
                              <SelectItem value="fine-dining">Fine Dining</SelectItem>
                              <SelectItem value="buffet">Buffet</SelectItem>
                              <SelectItem value="cafe">Café</SelectItem>
                              <SelectItem value="bistro">Bistro</SelectItem>
                              <SelectItem value="fast-casual">Fast Casual</SelectItem>
                              <SelectItem value="street-food">Street Food</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe your restaurant..." 
                            className="min-h-[120px] resize-y"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Describe your restaurant, cuisine, atmosphere, and what makes it special.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Location</h3>
                    
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., 123 Main Street" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid gap-6 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Phnom Penh" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="district"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>District</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Chamkarmon" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="aspect-video relative rounded-lg border bg-muted flex items-center justify-center">
                      <p className="text-muted-foreground">Map location selector will be displayed here</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end space-x-4 border-t px-6 py-4">
                  <Button variant="outline" type="button">
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Saving..." : "Save Changes"}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </TabsContent>
        
        <TabsContent value="hours">
          <Card>
            <CardHeader>
              <CardTitle>Opening Hours</CardTitle>
              <CardDescription>
                Set your restaurant's regular opening hours.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <RestaurantHours />
            </CardContent>
          </Card>
        </TabsContent>
        
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
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}