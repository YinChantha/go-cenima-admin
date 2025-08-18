"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  Edit,
  Eye,
  MoreHorizontal,
  Package,
  Plus,
  Trash,
  Users,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

interface PackageType {
  id: string;
  name: string;
  type: string;
  priceMode: string;
  price: number;
  kidPrice?: number;
  timeAllocation: number;
  minPax: number;
  maxPax: number;
  prepayment: boolean;
  description: string;
  image: string;
  isActive: boolean;
}

export default function PackagesPage() {
  const [packages, setPackages] = useState<PackageType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      // Mock data
      const mockPackages = [
        {
          id: "1",
          name: "Premium Dinner Experience",
          type: "all-you-can-eat",
          priceMode: "per-person",
          price: 45,
          timeAllocation: 120,
          minPax: 2,
          maxPax: 10,
          prepayment: true,
          description:
            "Our premium all-you-can-eat dinner experience with a selection of our finest dishes.",
          image:
            "https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg",
          isActive: true,
        },
        {
          id: "2",
          name: "Chef's Table",
          type: "set-menu",
          priceMode: "per-package",
          price: 350,
          timeAllocation: 150,
          minPax: 4,
          maxPax: 8,
          prepayment: true,
          description:
            "Exclusive chef's table experience with a personalized 8-course tasting menu.",
          image:
            "https://images.pexels.com/photos/696218/pexels-photo-696218.jpeg",
          isActive: true,
        },
        {
          id: "3",
          name: "Family Feast",
          type: "set-menu",
          priceMode: "per-person",
          price: 35,
          kidPrice: 20,
          timeAllocation: 90,
          minPax: 4,
          maxPax: 12,
          prepayment: true,
          description:
            "Perfect for families, our feast includes shared appetizers, mains, and desserts.",
          image:
            "https://images.pexels.com/photos/3184183/pexels-photo-3184183.jpeg",
          isActive: true,
        },
        {
          id: "4",
          name: "Business Lunch",
          type: "credit",
          priceMode: "per-person",
          price: 25,
          timeAllocation: 60,
          minPax: 2,
          maxPax: 6,
          prepayment: false,
          description:
            "Quick and efficient lunch service with à la carte options up to a set credit amount.",
          image:
            "https://images.pexels.com/photos/3184192/pexels-photo-3184192.jpeg",
          isActive: true,
        },
        {
          id: "5",
          name: "Weekend Brunch",
          type: "brunch",
          priceMode: "per-person",
          price: 30,
          kidPrice: 15,
          timeAllocation: 120,
          minPax: 1,
          maxPax: 8,
          prepayment: false,
          description:
            "Relaxed weekend brunch with a selection of breakfast and lunch options.",
          image:
            "https://images.pexels.com/photos/1813466/pexels-photo-1813466.jpeg",
          isActive: true,
        },
        {
          id: "6",
          name: "Romantic Dinner",
          type: "experience",
          priceMode: "per-package",
          price: 150,
          timeAllocation: 120,
          minPax: 2,
          maxPax: 2,
          prepayment: true,
          description:
            "Special romantic dinner for two with champagne and premium service.",
          image:
            "https://images.pexels.com/photos/1579739/pexels-photo-1579739.jpeg",
          isActive: false,
        },
      ];

      setPackages(mockPackages);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const getPackageTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      "all-you-can-eat": "All You Can Eat",
      "set-menu": "Set Menu",
      credit: "À la Carte Credit",
      brunch: "Brunch",
      experience: "Experience",
    };
    return types[type] || type;
  };

  const getPriceDisplay = (pkg: PackageType) => {
    if (pkg.priceMode === "per-person") {
      if (pkg.kidPrice) {
        return (
          <div>
            <div>${pkg.price} / adult</div>
            <div className="text-sm text-muted-foreground">
              ${pkg.kidPrice} / child
            </div>
          </div>
        );
      }
      return `$${pkg.price} / person`;
    }
    return `$${pkg.price} total`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Packages</h1>
          <p className="text-muted-foreground">
            Create and manage your dining packages.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/packages/create">
            <Plus className="mr-2 h-4 w-4" />
            Add New Package
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All Packages</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="inactive">Inactive</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <AspectRatio ratio={16 / 9}>
                    <Skeleton className="h-full w-full" />
                  </AspectRatio>
                  <CardHeader className="p-4">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                  <CardContent className="p-4 pt-0 space-y-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <div className="flex gap-2">
                      <Skeleton className="h-5 w-16" />
                      <Skeleton className="h-5 w-16" />
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between p-4 pt-0">
                    <Skeleton className="h-9 w-20" />
                    <Skeleton className="h-9 w-20" />
                  </CardFooter>
                </Card>
              ))
              : packages.map((pkg) => (
                <Card
                  key={pkg.id}
                  className="overflow-hidden h-full flex flex-col transition-all hover:shadow-md"
                >
                  <AspectRatio ratio={16 / 9}>
                    <img
                      src={pkg.image}
                      alt={pkg.name}
                      className="object-cover h-full w-full"
                    />
                  </AspectRatio>
                  <CardHeader className="p-4 pb-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">{pkg.name}</CardTitle>
                        <CardDescription className="flex items-center mt-1">
                          <Package className="h-3 w-3 mr-1" />
                          {getPackageTypeLabel(pkg.type)}
                        </CardDescription>
                      </div>
                      <Badge variant={pkg.isActive ? "default" : "outline"}>
                        {pkg.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-2 flex-grow">
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {pkg.description}
                    </p>
                    <div className="flex flex-wrap gap-3 text-sm">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span>{pkg.timeAllocation} min</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span>
                          {pkg.minPax}-{pkg.maxPax} guests
                        </span>
                      </div>
                    </div>
                    <div className="mt-3 font-medium">
                      {getPriceDisplay(pkg)}
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-2 border-t flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      asChild
                    >
                      <Link href={`/dashboard/packages/${pkg.id}`}>
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Link>
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">More options</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/packages/${pkg.id}/edit`}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive focus:text-destructive">
                          <Trash className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="active">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {!loading &&
              packages
                .filter((pkg) => pkg.isActive)
                .map((pkg) => (
                  <Card
                    key={pkg.id}
                    className="overflow-hidden h-full flex flex-col transition-all hover:shadow-md"
                  >
                    <AspectRatio ratio={16 / 9}>
                      <img
                        src={pkg.image}
                        alt={pkg.name}
                        className="object-cover h-full w-full"
                      />
                    </AspectRatio>
                    <CardHeader className="p-4 pb-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl">{pkg.name}</CardTitle>
                          <CardDescription className="flex items-center mt-1">
                            <Package className="h-3 w-3 mr-1" />
                            {getPackageTypeLabel(pkg.type)}
                          </CardDescription>
                        </div>
                        <Badge>Active</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-2 flex-grow">
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {pkg.description}
                      </p>
                      <div className="flex flex-wrap gap-3 text-sm">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span>{pkg.timeAllocation} min</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span>
                            {pkg.minPax}-{pkg.maxPax} guests
                          </span>
                        </div>
                      </div>
                      <div className="mt-3 font-medium">
                        {getPriceDisplay(pkg)}
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-2 border-t flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        asChild
                      >
                        <Link href={`/dashboard/packages/${pkg.id}`}>
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Link>
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">More options</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/packages/${pkg.id}/edit`}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive focus:text-destructive">
                            <Trash className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </CardFooter>
                  </Card>
                ))}
          </div>
        </TabsContent>

        <TabsContent value="inactive">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {!loading &&
              packages
                .filter((pkg) => !pkg.isActive)
                .map((pkg) => (
                  <Card
                    key={pkg.id}
                    className="overflow-hidden h-full flex flex-col transition-all hover:shadow-md"
                  >
                    <AspectRatio ratio={16 / 9}>
                      <img
                        src={pkg.image}
                        alt={pkg.name}
                        className="object-cover h-full w-full"
                      />
                    </AspectRatio>
                    <CardHeader className="p-4 pb-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl">{pkg.name}</CardTitle>
                          <CardDescription className="flex items-center mt-1">
                            <Package className="h-3 w-3 mr-1" />
                            {getPackageTypeLabel(pkg.type)}
                          </CardDescription>
                        </div>
                        <Badge variant="outline">Inactive</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-2 flex-grow">
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {pkg.description}
                      </p>
                      <div className="flex flex-wrap gap-3 text-sm">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span>{pkg.timeAllocation} min</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span>
                            {pkg.minPax}-{pkg.maxPax} guests
                          </span>
                        </div>
                      </div>
                      <div className="mt-3 font-medium">
                        {getPriceDisplay(pkg)}
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-2 border-t flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        asChild
                      >
                        <Link href={`/dashboard/packages/${pkg.id}`}>
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Link>
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">More options</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/packages/${pkg.id}/edit`}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive focus:text-destructive">
                            <Trash className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </CardFooter>
                  </Card>
                ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
