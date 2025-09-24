"use client";

import { useEffect } from "react";
import { FaSpinner } from "react-icons/fa";
import { supabaseBrowser } from "@/lib/supabase/browser";

export default function SignOutPage() {
	useEffect(() => {
		const supabase = supabaseBrowser();
		supabase.auth.signOut().finally(() => {
			window.location.href = "/";
		});
	}, []);

	return (
		<div className="h-full flex flex-col items-center justify-center py-10 space-y-4">
			<FaSpinner className="h-8 w-8 animate-spin text-primary" />
			<p className="text-sm text-muted-foreground">Signing you out...</p>
		</div>
	);
}
