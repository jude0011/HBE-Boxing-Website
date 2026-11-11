"use client";

import Link from "next/link";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { createClient } from "@/app/lib/supabase/client";

type PartnerRow = {
  id: string;
  name: string;
  partner_type: string | null;
  logo_url: string | null;
  website_url: string | null;
  description: string | null;
  display_order: number | null;
  active: boolean;
  created_at: string;
};

export default function AdminPartnersPage() {
  const supabase = useMemo(
    () => createClient(),
    []
  );

  const [partners, setPartners] =
    useState<PartnerRow[]>([]);

  const [
    isSuperAdmin,
    setIsSuperAdmin,
  ] = useState(false);

  const [loading, setLoading] =
    useState(true);

  const [message, setMessage] =
    useState("");

  async function loadData() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const {
        data: adminData,
        error: adminError,
      } = await supabase
        .from("admin_users")
        .select("role")
        .eq("id", user.id)
        .single();

      if (adminError) {
        console.error(
          "Admin role error:",
          adminError
        );
      }

      setIsSuperAdmin(
        adminData?.role ===
          "super_admin"
      );
    }

    const {
      data,
      error,
    } = await supabase
      .from("partners")
      .select("*")
      .order("display_order", {
        ascending: true,
        nullsFirst: false,
      })
      .order("name", {
        ascending: true,
      });

    if (error) {
      console.error(
        "Partners load error:",
        error
      );

      setMessage(
        error.message
      );
    }

    setPartners(
      (data as PartnerRow[]) ||
        []
    );

    setLoading(false);
  }

  useEffect(() => {
    const initializePage =
      async () => {
        await loadData();
      };

    void initializePage();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function deletePartner(
    partner: PartnerRow
  ) {
    if (!isSuperAdmin) {
      setMessage(
        "Only the Super Admin can permanently delete partners."
      );

      return;
    }

    const confirmed =
      window.confirm(
        `PERMANENTLY delete "${partner.name}"? This cannot be undone.`
      );

    if (!confirmed) {
      return;
    }

    setMessage("");

    const {
      error,
    } = await supabase
      .from("partners")
      .delete()
      .eq("id", partner.id);

    if (error) {
      console.error(
        "Delete partner error:",
        error
      );

      setMessage(
        error.message
      );

      return;
    }

    setMessage(
      "Partner permanently deleted."
    );

    await loadData();
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl p-10">
        <p className="font-black uppercase text-[#625d56]">
          Loading Partners...
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl p-5 sm:p-8 lg:p-10">

      {/* HEADER */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">

        <div>

          <p className="text-xs font-black uppercase tracking-[0.25em] text-[#941f25]">
            Partner Management
          </p>

          <h1 className="mt-3 text-3xl font-black uppercase text-[#171717] sm:text-4xl">
            HBE Partners
          </h1>

          <div className="mt-5 h-1 w-16 bg-[#c6a24a]" />

          <p className="mt-5 max-w-3xl leading-7 text-[#625d56]">
            Manage Heritage Boxing Entertainment sponsors,
            commercial partners and strategic relationships.
          </p>

        </div>

        <Link
          href="/admin/partners/new"
          className="inline-flex items-center justify-center bg-[#941f25] px-6 py-4 text-sm font-black uppercase tracking-wide text-white transition hover:bg-[#74181d]"
        >
          + Add Partner
        </Link>

      </div>

      {/* SUPER ADMIN NOTICE */}
      {isSuperAdmin && (
        <div className="mt-6 border border-[#e2ddd5] bg-white px-5 py-4">

          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#941f25]">
            Super Admin Controls Enabled
          </p>

          <p className="mt-1 text-sm text-[#625d56]">
            Permanent-delete controls are visible only to the Super Admin.
          </p>

        </div>
      )}

      {/* MESSAGE */}
      {message && (
        <div className="mt-6 border border-[#d8d3cb] bg-white p-4 text-sm font-semibold text-[#171717]">
          {message}
        </div>
      )}

      {/* SUMMARY */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2">

        <div className="border border-[#e2ddd5] bg-white p-5">

          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#8a847c]">
            Total Partners
          </p>

          <p className="mt-1 text-3xl font-black text-[#171717]">
            {partners.length}
          </p>

        </div>

        <div className="border border-[#e2ddd5] bg-white p-5">

          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#8a847c]">
            Active Partners
          </p>

          <p className="mt-1 text-3xl font-black text-[#171717]">
            {
              partners.filter(
                (partner) =>
                  partner.active
              ).length
            }
          </p>

        </div>

      </div>

      {/* PARTNERS */}
      <div className="mt-8 space-y-5">

        {partners.length > 0 ? (
          partners.map(
            (partner) => (
              <article
                key={partner.id}
                className="overflow-hidden border border-[#e2ddd5] bg-white shadow-sm"
              >

                <div className="grid lg:grid-cols-[220px_1fr_auto]">

                  {/* LOGO */}
                  <div className="relative flex min-h-[180px] items-center justify-center overflow-hidden bg-[#f7f4ef] p-6">

                    {partner.logo_url ? (

                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={
                          partner.logo_url
                        }
                        alt={
                          partner.name
                        }
                        className="max-h-[130px] max-w-full object-contain"
                      />

                    ) : (

                      <span className="text-xs font-black uppercase tracking-wider text-[#8a847c]">
                        No Logo
                      </span>

                    )}

                  </div>

                  {/* PARTNER INFO */}
                  <div className="p-6">

                    <div className="flex flex-wrap items-center gap-3">

                      <h2 className="text-xl font-black uppercase text-[#171717] sm:text-2xl">
                        {partner.name}
                      </h2>

                      <span
                        className={
                          partner.active
                            ? "bg-green-100 px-3 py-1 text-xs font-black uppercase tracking-wide text-green-700"
                            : "bg-[#ece8e2] px-3 py-1 text-xs font-black uppercase tracking-wide text-[#625d56]"
                        }
                      >
                        {partner.active
                          ? "Active"
                          : "Inactive"}
                      </span>

                    </div>

                    {partner.partner_type && (
                      <p className="mt-3 text-sm font-black uppercase tracking-wide text-[#941f25]">
                        {
                          partner.partner_type
                        }
                      </p>
                    )}

                    {partner.description && (
                      <p className="mt-4 max-w-3xl leading-6 text-[#625d56]">
                        {
                          partner.description
                        }
                      </p>
                    )}

                    <div className="mt-5 flex flex-wrap gap-6 text-sm text-[#625d56]">

                      <p>
                        <strong>
                          Display Order:
                        </strong>{" "}
                        {
                          partner.display_order ??
                          "—"
                        }
                      </p>

                      {partner.website_url && (
                        <a
                          href={
                            partner.website_url
                          }
                          target="_blank"
                          rel="noreferrer"
                          className="font-bold text-[#941f25] hover:underline"
                        >
                          Visit Website
                        </a>
                      )}

                    </div>

                  </div>

                  {/* ACTIONS */}
                  <div className="flex items-center border-t border-[#eee9e2] p-6 lg:border-l lg:border-t-0">

                    <div className="w-full space-y-3">

                      <Link
                        href={`/admin/partners/${partner.id}`}
                        className="inline-flex w-full items-center justify-center bg-[#c6a24a] px-6 py-3 text-xs font-black uppercase tracking-wide text-[#171717] transition hover:bg-[#b08d39]"
                      >
                        Edit Partner
                      </Link>

                      {isSuperAdmin && (
                        <button
                          type="button"
                          onClick={() =>
                            deletePartner(
                              partner
                            )
                          }
                          className="inline-flex w-full items-center justify-center border border-red-300 bg-red-50 px-5 py-3 text-xs font-black uppercase tracking-wide text-red-700 transition hover:bg-red-700 hover:text-white"
                        >
                          Permanent Delete
                        </button>
                      )}

                    </div>

                  </div>

                </div>

              </article>
            )
          )
        ) : (

          <div className="border border-[#e2ddd5] bg-white p-8 text-[#625d56]">

            <p className="font-bold">
              No partners have been created yet.
            </p>

            <p className="mt-2 text-sm">
              Click + Add Partner to create the first HBE partner.
            </p>

          </div>

        )}

      </div>

    </main>
  );
}