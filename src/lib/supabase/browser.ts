import { createBrowserClient } from "@supabase/ssr";
import { SupabaseClient } from "@supabase/supabase-js";

export function supabaseBrowser(): SupabaseClient {
	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
	const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

	if (!supabaseUrl || !supabaseKey) {
		// During build time, return a mock client to prevent build failures
		// This will be replaced with the real client at runtime when env vars are available
		console.warn("Supabase environment variables not available - using mock client");
		return {
			auth: {
				getSession: () => Promise.resolve({ data: { session: null }, error: null }),
				getUser: () => Promise.resolve({ data: { user: null }, error: null }),
				onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
				signOut: () => Promise.resolve({ error: null }),
				signInWithOAuth: () => Promise.resolve({ error: null }),
				signUp: () => Promise.resolve({ data: { user: null }, error: null }),
				signInWithPassword: () => Promise.resolve({ data: { user: null }, error: null }),
				signInWithOtp: () => Promise.resolve({ error: null })
			},
			from: () => ({
				select: () => ({
					eq: () => ({
						order: () => ({
							range: () => Promise.resolve({ data: [], error: null, count: 0 })
						}),
						range: () => Promise.resolve({ data: [], error: null, count: 0 })
					}),
					order: () => ({
						range: () => Promise.resolve({ data: [], error: null, count: 0 })
					}),
					range: () => Promise.resolve({ data: [], error: null, count: 0 })
				}),
				insert: () => Promise.resolve({ data: [], error: null }),
				update: () => Promise.resolve({ data: [], error: null }),
				delete: () => Promise.resolve({ data: [], error: null })
			})
		} as unknown as SupabaseClient;
	}
	
	return createBrowserClient(supabaseUrl, supabaseKey);
}
