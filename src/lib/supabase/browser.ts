import { createBrowserClient } from "@supabase/ssr";

export function supabaseBrowser() {
	console.log("Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
	console.log("Supabase Key:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Present" : "Missing");
	
	return createBrowserClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
	);
}
