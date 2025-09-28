import { supabaseServer } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function requireUser() {
  const supabase = await supabaseServer();
	const { data, error } = await supabase.auth.getUser();
	if (error || !data.user) {
		redirect("/sign-in");
	}
	return data.user;
}
