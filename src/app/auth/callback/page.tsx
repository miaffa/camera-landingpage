"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/browser";

export default function SupabaseAuthCallback() {
	const router = useRouter();
	const search = useSearchParams();

	useEffect(() => {
		const supabase = supabaseBrowser();
		// Refresh session on callback landing
		supabase.auth.getSession().finally(() => {
			const redirectTo = search?.get("redirectTo") || "/app";
			router.replace(redirectTo);
		});
	}, [router, search]);

	return (
		<div className="h-full flex items-center justify-center">
			<p className="text-sm text-muted-foreground">Signing you in…</p>
		</div>
	);
}
