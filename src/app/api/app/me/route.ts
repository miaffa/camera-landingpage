import { NextResponse } from "next/server";
import { MeResponse } from "./types";
import { requireUser } from "@/lib/auth/requireUser";

export const dynamic = "force-dynamic";

export const GET = async () => {
	const user = await requireUser();
	// TODO: map to your plans logic if needed; keeping null for now
	return NextResponse.json<MeResponse>({
		currentPlan: null,
		// Minimal shape; adapt as needed
		user: {
			id: user.id,
			email: user.email ?? "",
			name: user.user_metadata?.full_name ?? user.email ?? "",
			image: user.user_metadata?.avatar_url ?? null,
		},
	});
};
