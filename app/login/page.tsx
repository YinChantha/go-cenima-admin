"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/auth-provider";
import { Eye, EyeOff, UtensilsCrossed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isMerchant, setisMerchant] = useState(false);
  const { login, user } = useAuth();
  const { toast } = useToast();
  const inputType = isMerchant ? "tel" : "email";
  const inputPlaceholder = isMerchant ? "012345678" : "hello@example.com";
  const labelText = isMerchant ? "Phone Number" : "Email";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    let result;
    try {
      if (!isMerchant) {
        result = await login({ email, password });
      } else {
        result = await login({ phoneNumber: email, password });
      }
      if (result && result.role) {
        toast({
          variant: "success",
          title: "Logged in successfully",
          description: "Welcome to the Restaurant Portal",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "Invalid email or password",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-background to-muted p-4">
      <Card className="mx-auto w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-red-100 p-3">
              <UtensilsCrossed className="h-8 w-8 text-red-600" />
            </div>
          </div>
          <CardTitle className="text-2xl">
            Sign in to Restaurant Portal
          </CardTitle>
          <CardDescription>
            Manage your restaurant, and bookings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="merchant"
                checked={isMerchant}
                onCheckedChange={(e) => setisMerchant(e === true)}
              />
              <Label
                htmlFor="merchant"
                className="text-sm font-normal cursor-pointer"
              >
                I am a Branch Restaurant (use phone number)
              </Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">{labelText}</Label>
              <Input
                id="email"
                type={inputType}
                placeholder={inputPlaceholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <a
                  href="/forgot-password"
                  className="text-sm text-red-600 hover:text-red-500 hover:underline transition-colors"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex-col justify-center border-t p-4">
          <p className="text-sm text-muted-foreground">
            <span>Need help? </span>
            <Link
              href="/contact"
              className="text-red-600 hover:text-red-500 hover:underline transition-colors"
            >
              Contact support
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
