import { redirect } from "next/navigation";

import { createClient } from "@/app/lib/supabase/server";

import AdminSidebar from "./components/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase =
    await createClient();

  const {
    data: { user },
  } =
    await supabase.auth.getUser();

  if (!user) {
    redirect(
      "/admin/login"
    );
  }

  const {
    data: admin,
    error,
  } =
    await supabase
      .from(
        "admin_users"
      )
      .select(`
        id,
        email,
        full_name,
        role,
        active
      `)
      .eq(
        "id",
        user.id
      )
      .single();

  if (
    error ||
    !admin ||
    !admin.active
  ) {
    await supabase.auth.signOut();

    redirect(
      "/admin/login"
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#f7f4ef] lg:flex lg:h-screen lg:overflow-hidden">

      {/* DESKTOP + MOBILE ADMIN NAVIGATION */}
      <AdminSidebar
        role={
          admin.role
        }
      />

      {/* RIGHT ADMIN AREA */}
      <div className="min-w-0 flex-1 lg:flex lg:flex-col lg:overflow-hidden">

        {/* DESKTOP ADMIN HEADER */}
        <header className="hidden shrink-0 border-b border-[#e5e0d8] bg-white lg:block">

          <div className="flex min-h-[82px] w-full min-w-0 items-center justify-between gap-4 px-8">

            {/* ADMIN IDENTITY */}
            <div className="min-w-0">

              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#941f25]">
                HBE Administration
              </p>

              <p className="mt-1 truncate font-bold text-[#171717]">
                {admin.full_name ||
                  admin.email}
              </p>

            </div>

            {/* ADMIN ROLE */}
            <div className="shrink-0 bg-[#f7f4ef] px-4 py-2 text-xs font-black uppercase text-[#5f5b55]">

              {admin.role ===
              "super_admin"
                ? "Super Admin"
                : "Admin"}

            </div>

          </div>

        </header>

        {/* PAGE CONTENT */}
        <div className="w-full min-w-0 max-w-full overflow-x-hidden lg:min-h-0 lg:flex-1 lg:overflow-y-auto">

          {children}

        </div>

      </div>

    </div>
  );
}