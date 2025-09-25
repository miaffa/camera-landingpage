"use client";

import * as React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { FaGoogle, FaSpinner } from "react-icons/fa";
import { toast } from "sonner";
import { supabaseBrowser } from "@/lib/supabase/browser";

interface AuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
	callbackUrl?: string;
}

export function AuthForm({ className, callbackUrl, ...props }: AuthFormProps) {
	const [isLoading, setIsLoading] = React.useState<boolean>(false);
	const [email, setEmail] = React.useState<string>("");
	const searchParams = useSearchParams();
	const router = useRouter();
	const supabase = React.useMemo(() => supabaseBrowser(), []);

	const redirectTo = callbackUrl || searchParams?.get("callbackUrl") || "/create";
	
	// Debug logging
	console.log("AuthForm - redirectTo:", redirectTo);
	console.log("AuthForm - callbackUrl:", callbackUrl);
	console.log("AuthForm - searchParams:", searchParams?.get("callbackUrl"));

	const handleGoogleSignIn = async () => {
		setIsLoading(true);
		try {
			const { data, error } = await supabase.auth.signInWithOAuth({
				provider: "google",
				options: { redirectTo: `${window.location.origin}/auth/callback?redirectTo=${encodeURIComponent(redirectTo)}` },
			});
			if (error) throw error;
			// Redirect handled by Supabase
		} catch (error) {
			console.error("Authentication error:", error);
			toast.error("Failed to continue with Google");
		} finally {
			setIsLoading(false);
		}
	};

	const handleEmailSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		console.log("Form submitted! Email:", email);
		console.log("Current redirectTo:", redirectTo);
		setIsLoading(true);

		try {
			console.log("=== AUTHENTICATION STARTING ===");
			// Development bypass - check if we're in development mode
			if (process.env.NODE_ENV === 'development') {
				console.log("Development mode: attempting authentication for", email);
				
				// Try to sign up directly (this will work for both new and existing users)
				const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
					email,
					password: 'Dev123!@#',
					options: { 
						emailRedirectTo: `${window.location.origin}/auth/callback?redirectTo=${encodeURIComponent(redirectTo)}`,
						// Skip email confirmation in development
						data: { skip_confirmation: true }
					},
				});

				console.log("Sign up response:", { signUpData, signUpError });

    if (signUpData.user) {
      console.log("Sign up successful, redirecting to:", redirectTo);
      toast.success("Account created and signed in (dev mode)");
      setEmail("");
      
      // Wait for session to be stored
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Verify session is stored
      const { data: { session } } = await supabase.auth.getSession();
      console.log("Session after signup:", session);
      
      // Check localStorage directly
      const storedSession = localStorage.getItem('sb-bjdbcsgihtpgjrshnpeq-auth-token');
      console.log("localStorage session after signup:", storedSession);
      
      // Longer delay to ensure auth state propagates
      setTimeout(() => {
        console.log("About to redirect to:", redirectTo);
        // Force refresh the page to ensure auth state is loaded
        window.location.href = redirectTo;
      }, 1000);
      return;
    }

				// If signup fails, try to sign in (user might already exist)
				if (signUpError) {
					console.log("Sign up failed, trying sign in:", signUpError.message);
					const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
						email,
						password: 'Dev123!@#',
					});

					if (signInData.user) {
						console.log("Sign in successful, redirecting to:", redirectTo);
						toast.success("Signed in successfully (dev mode)");
						setEmail("");
						
						// Wait for session to be stored
						await new Promise(resolve => setTimeout(resolve, 500));
						
      // Verify session is stored
      const { data: { session } } = await supabase.auth.getSession();
      console.log("Session after signin:", session);
						
      // Check localStorage directly
      const storedSession = localStorage.getItem('sb-bjdbcsgihtpgjrshnpeq-auth-token');
      console.log("localStorage session after signin:", storedSession);
						
						// Longer delay to ensure auth state propagates
						setTimeout(() => {
							console.log("About to redirect to:", redirectTo);
							// Force refresh the page to ensure auth state is loaded
							window.location.href = redirectTo;
						}, 1000);
						return;
					}

					if (signInError) {
						console.error("Both signup and signin failed:", { signUpError, signInError });
						throw signInError;
					}
				}
			} else {
				// Production flow - use OTP
				const { error } = await supabase.auth.signInWithOtp({
					email,
					options: { emailRedirectTo: `${window.location.origin}/auth/callback?redirectTo=${encodeURIComponent(redirectTo)}` },
				});
				if (error) throw error;
				toast.success("Check your email for the login link");
				setEmail("");
			}
		} catch (error) {
			console.error("=== AUTHENTICATION ERROR ===", error);
			toast.error("Something went wrong");
			// Don't redirect on error - keep user on page to see logs
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className={cn("flex flex-col space-y-6", className)} {...props}>
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

			<form onSubmit={handleEmailSignIn} className="space-y-4">
				<div className="space-y-2">
					<Label htmlFor="email">Email address</Label>
					<Input
						id="email"
						placeholder="name@example.com"
						type="email"
						autoCapitalize="none"
						autoComplete="email"
						autoCorrect="off"
						disabled={isLoading}
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
						className="w-full py-6"
					/>
				</div>
				<Button 
					type="submit" 
					disabled={isLoading} 
					className="w-full py-6"
					onClick={() => console.log("Button clicked!")}
				>
					{isLoading && <FaSpinner className="mr-2 h-4 w-4 animate-spin" />}
					Continue with Email
				</Button>
			</form>
		</div>
	);
}
