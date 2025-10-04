"use client";

import * as React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { FaGoogle, FaSpinner } from "react-icons/fa";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { magicLinkSchema } from "@/lib/validations/auth.schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  callbackUrl?: string;
}

export function AuthForm({ className, callbackUrl, ...props }: AuthFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  // Form for magic link
  const magicLinkForm = useForm<{ email: string }>({
    resolver: zodResolver(magicLinkSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleImpersonation = React.useCallback(async (token: string) => {
    setIsLoading(true);
    try {
      const result = await signIn("credentials", {
        signedToken: token,
        redirect: false,
        callbackUrl: callbackUrl || searchParams?.get("callbackUrl") || "/app",
      });

      if (result?.error) {
        toast.error("Failed to impersonate user");
      } else if (result?.url) {
        router.push(result.url);
      }
    } catch (error) {
      console.error("Impersonation error:", error);
      toast.error("Failed to impersonate user");
    } finally {
      setIsLoading(false);
    }
  }, [callbackUrl, searchParams, router]);
  
  React.useEffect(() => {
    const impersonateToken = searchParams?.get("impersonateToken");
    if (impersonateToken) {
      // Use setTimeout to defer the state update and avoid render issues
      const timeoutId = setTimeout(() => {
        handleImpersonation(impersonateToken);
      }, 0);
      
      return () => clearTimeout(timeoutId);
    }
  }, [searchParams, handleImpersonation]);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn("google", {
        callbackUrl: callbackUrl || searchParams?.get("callbackUrl") || "/app",
      });
    } catch (error) {
      console.error("Authentication error:", error);
      toast.error("Failed to continue with Google");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (data: { email: string }) => {
    setIsLoading(true);
    try {
      toast.success("Sending magic link to your email...");
      
      // Send magic link for sign up
      const result = await signIn("email", {
        email: data.email,
        redirect: false,
        callbackUrl: callbackUrl || searchParams?.get("callbackUrl") || "/app",
      });

      if (result?.error) {
        toast.error("Failed to send magic link");
      } else {
        toast.success("Check your email for the sign-up link!");
      }
    } catch (error) {
      console.error("Sign up error:", error);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMagicLinkSignIn = async (data: { email: string }) => {
    setIsLoading(true);
    try {
      const result = await signIn("email", {
        email: data.email,
        redirect: false,
        callbackUrl: callbackUrl || searchParams?.get("callbackUrl") || "/app",
      });

      if (result?.error) {
        toast.error("Failed to send login email");
      } else {
        toast.success("Check your email for the login link");
      }
    } catch (error) {
      console.error("Authentication error:", error);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Button
        variant="outline"
        type="button"
        disabled={isLoading}
        onClick={handleGoogleSignIn}
        className="w-full py-6"
      >
        {isLoading ? (
          <FaSpinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <FaGoogle className="mr-2 h-4 w-4" />
        )}
        Continue with Google
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with email
          </span>
        </div>
      </div>

      <Tabs defaultValue="signin" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="signin">Sign In</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>

        <TabsContent value="signin" className="space-y-4">
          <form onSubmit={magicLinkForm.handleSubmit(handleMagicLinkSignIn)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="magiclink-email">Email address</Label>
              <Input
                id="magiclink-email"
                placeholder="name@example.com"
                type="email"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
                disabled={isLoading}
                {...magicLinkForm.register("email")}
                className="w-full py-6"
              />
              {magicLinkForm.formState.errors.email && (
                <p className="text-sm text-red-500">{magicLinkForm.formState.errors.email.message}</p>
              )}
            </div>
            <Button type="submit" disabled={isLoading} className="w-full py-6">
              {isLoading && <FaSpinner className="mr-2 h-4 w-4 animate-spin" />}
              Send Magic Link
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="signup" className="space-y-4">
          <form onSubmit={magicLinkForm.handleSubmit(handleSignUp)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="signup-email">Email address</Label>
              <Input
                id="signup-email"
                placeholder="name@example.com"
                type="email"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
                disabled={isLoading}
                {...magicLinkForm.register("email")}
                className="w-full py-6"
              />
              {magicLinkForm.formState.errors.email && (
                <p className="text-sm text-red-500">{magicLinkForm.formState.errors.email.message}</p>
              )}
            </div>
            <Button type="submit" disabled={isLoading} className="w-full py-6">
              {isLoading && <FaSpinner className="mr-2 h-4 w-4 animate-spin" />}
              Sign Up with Magic Link
            </Button>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
}
