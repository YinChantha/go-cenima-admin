"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
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
import { useToast } from '@/hooks/use-toast'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { ImageUpload } from '@/components/dashboard/image-upload'

const packageFormSchema = z.object({
  name: z.string().min(2, {
    message: "Package name must be at least 2 characters.",
  }),
  type: z.string({
    required_error: "Please select a package type.",
  }),
  priceMode: z.string({
    required_error: "Please select a pricing mode.",
  }),
  price: z.number().min(0, {
    message: "Price must be a positive number.",
  }),
  kidPrice: z.number().min(0, {
    message: "Kid price must be a positive number.",
  }).optional(),
  timeAllocation: z.number().min(30, {
    message: "Time allocation must be at least 30 minutes.",
  }),
  minPax: z.number().min(1, {
    message: "Minimum pax must be at least 1.",
  }),
  maxPax: z.number().min(1, {
    message: "Maximum pax must be at least 1.",
  }),
  prepayment: z.boolean(),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  image: z.string().url({
    message: "Please provide a valid image URL.",
  }),
  isActive: z.boolean(),
})

type PackageFormValues = z.infer<typeof packageFormSchema>

export default function CreatePackagePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<PackageFormValues>({
    resolver: zodResolver(packageFormSchema),
    defaultValues: {
      name: "",
      type: "all-you-can-eat",
      priceMode: "per-person",
      price: 0,
      timeAllocation: 90,
      minPax: 2,
      maxPax: 10,
      prepayment: true,
      description: "",
      image: "https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg",
      isActive: true,
    },
  })

  async function onSubmit(data: PackageFormValues) {
    setIsLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))      
      toast({
        title: "Package created",
        description: "Your new package has been created successfully.",
      })
      
      router.push('/dashboard/packages')
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create New Package</h1>
        <p className="text-muted-foreground">
          Add a new dining package to your restaurant.
        </p>
      </div>
      
      <Card>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle>Package Details</CardTitle>
              <CardDescription>
                Enter the details of your new dining package.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Package Image</FormLabel>
                      <FormControl>
                        <ImageUpload
                          value={field.value}
                          onChange={field.onChange}
                          className="mx-auto w-full max-w-2xl"
                        />
                      </FormControl>
                      <FormDescription>
                        Upload a high-quality image that represents your package.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Package Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Premium Dinner Experience" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Package Type</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select package type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="all-you-can-eat">All You Can Eat</SelectItem>
                            <SelectItem value="set-menu">Set Menu</SelectItem>
                            <SelectItem value="credit">À la Carte Credit</SelectItem>
                            <SelectItem value="brunch">Brunch</SelectItem>
                            <SelectItem value="experience">Experience</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="priceMode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price Mode</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select price mode" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="per-person">Per Person</SelectItem>
                            <SelectItem value="per-package">Per Package</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price ($)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="0" 
                            step="0.01"
                            placeholder="0.00"
                            {...field}
                            onChange={e => field.onChange(parseFloat(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                {form.watch('priceMode') === 'per-person' && (
                  <FormField
                    control={form.control}
                    name="kidPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kid Price ($)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="0" 
                            step="0.01"
                            placeholder="0.00"
                            {...field}
                            onChange={e => field.onChange(parseFloat(e.target.value))}
                          />
                        </FormControl>
                        <FormDescription>
                          Optional: Set a different price for children
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                
                <div className="grid gap-4 md:grid-cols-3">
                  <FormField
                    control={form.control}
                    name="timeAllocation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Time Allocation (minutes)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="30" 
                            step="15"
                            {...field}
                            onChange={e => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="minPax"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Minimum Pax</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="1"
                            {...field}
                            onChange={e => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="maxPax"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Maximum Pax</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="1"
                            {...field}
                            onChange={e => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
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
                          placeholder="Describe your package..." 
                          className="min-h-[120px] resize-y"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Provide a detailed description of what's included in the package.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="prepayment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prepayment Required</FormLabel>
                        <Select 
                          onValueChange={(value) => field.onChange(value === 'true')} 
                          defaultValue={field.value.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select prepayment option" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="true">Yes</SelectItem>
                            <SelectItem value="false">No</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Package Status</FormLabel>
                        <Select 
                          onValueChange={(value) => field.onChange(value === 'true')} 
                          defaultValue={field.value.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="true">Active</SelectItem>
                            <SelectItem value="false">Inactive</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-4">
              <Button
                variant="outline"
                onClick={() => router.push('/dashboard/packages')}
                type="button"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Package"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  )}