import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProfileForm } from "./ProfileForm";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?redirectTo=/portal/profile");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, phone, country, role, verified")
    .eq("id", user.id)
    .single();

  return (
    <ProfileForm
      userId={user.id}
      email={user.email ?? ""}
      fullName={profile?.full_name ?? ""}
      phone={profile?.phone ?? ""}
      country={profile?.country ?? ""}
      role={profile?.role ?? "BIDDER"}
      verified={profile?.verified ?? false}
    />
  );
}
