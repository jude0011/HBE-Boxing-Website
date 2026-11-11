"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import type {
  FormEvent,
} from "react";

import {
  useParams,
  useRouter,
} from "next/navigation";

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

export default function EditPartnerPage() {
  const params = useParams();
  const router = useRouter();

  const supabase = useMemo(
    () => createClient(),
    []
  );

  const partnerId =
    typeof params.id === "string"
      ? params.id
      : "";

  const [name, setName] =
    useState("");

  const [
    partnerType,
    setPartnerType,
  ] = useState("");

  const [
    logoUrl,
    setLogoUrl,
  ] = useState("");

  const [
    websiteUrl,
    setWebsiteUrl,
  ] = useState("");

  const [
    description,
    setDescription,
  ] = useState("");

  const [
    displayOrder,
    setDisplayOrder,
  ] = useState("");

  const [active, setActive] =
    useState(true);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const loadPartner =
      async () => {
        if (!partnerId) {
          setError(
            "Partner ID was not found."
          );

          setLoading(false);

          return;
        }

        const {
          data,
          error: loadError,
        } = await supabase
          .from("partners")
          .select("*")
          .eq(
            "id",
            partnerId
          )
          .single();

        if (loadError) {
          console.error(
            "Partner load error:",
            loadError
          );

          setError(
            loadError.message
          );

          setLoading(false);

          return;
        }

        const partner =
          data as PartnerRow;

        setName(
          partner.name || ""
        );

        setPartnerType(
          partner.partner_type ||
            ""
        );

        setLogoUrl(
          partner.logo_url || ""
        );

        setWebsiteUrl(
          partner.website_url ||
            ""
        );

        setDescription(
          partner.description ||
            ""
        );

        setDisplayOrder(
          partner.display_order !==
            null
            ? String(
                partner.display_order
              )
            : ""
        );

        setActive(
          partner.active ??
            true
        );

        setLoading(false);
      };

    void loadPartner();
  }, [
    partnerId,
    supabase,
  ]);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setSaving(true);
    setError("");

    if (!name.trim()) {
      setError(
        "Partner name is required."
      );

      setSaving(false);

      return;
    }

    const orderNumber =
      displayOrder.trim()
        ? Number(displayOrder)
        : null;

    if (
      orderNumber !== null &&
      Number.isNaN(orderNumber)
    ) {
      setError(
        "Display order must be a number."
      );

      setSaving(false);

      return;
    }

    const {
      error: updateError,
    } = await supabase
      .from("partners")
      .update({
        name:
          name.trim(),

        partner_type:
          partnerType.trim() ||
          null,

        logo_url:
          logoUrl.trim() ||
          null,

        website_url:
          websiteUrl.trim() ||
          null,

        description:
          description.trim() ||
          null,

        display_order:
          orderNumber,

        active,
      })
      .eq(
        "id",
        partnerId
      );

    if (updateError) {
      console.error(
        "Update partner error:",
        updateError
      );

      setError(
        updateError.message
      );

      setSaving(false);

      return;
    }

    router.push(
      "/admin/partners"
    );

    router.refresh();
  }

  const inputClass =
    "mt-2 w-full border border-[#d8d3cb] bg-white px-4 py-3 text-[#171717] outline-none transition focus:border-[#941f25]";

  const labelClass =
    "text-xs font-black uppercase tracking-[0.12em] text-[#625d56]";

  if (loading) {
    return (
      <main className="mx-auto max-w-5xl p-10">

        <p className="font-black uppercase text-[#625d56]">
          Loading Partner...
        </p>

      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl p-5 sm:p-8 lg:p-10">

      <p className="text-xs font-black uppercase tracking-[0.25em] text-[#941f25]">
        Partner Management
      </p>

      <h1 className="mt-3 text-3xl font-black uppercase text-[#171717] sm:text-4xl">
        Edit Partner
      </h1>

      <div className="mt-5 h-1 w-16 bg-[#c6a24a]" />

      <p className="mt-5 max-w-3xl leading-7 text-[#625d56]">
        Update partner information,
        branding, public visibility and
        display order.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-8"
      >

        {/* PARTNER INFORMATION */}
        <section className="border border-[#e2ddd5] bg-white p-6 sm:p-8">

          <h2 className="text-xl font-black uppercase text-[#171717]">
            Partner Information
          </h2>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">

            <div>

              <label className={labelClass}>
                Partner Name
              </label>

              <input
                required
                value={name}
                onChange={(event) =>
                  setName(
                    event.target.value
                  )
                }
                className={inputClass}
              />

            </div>

            <div>

              <label className={labelClass}>
                Partner Type
              </label>

              <select
                value={partnerType}
                onChange={(event) =>
                  setPartnerType(
                    event.target.value
                  )
                }
                className={inputClass}
              >

                <option value="">
                  Select Type
                </option>

                <option value="Official Partner">
                  Official Partner
                </option>

                <option value="Sponsor">
                  Sponsor
                </option>

                <option value="Payment Partner">
                  Payment Partner
                </option>

                <option value="Broadcast Partner">
                  Broadcast Partner
                </option>

                <option value="Media Partner">
                  Media Partner
                </option>

                <option value="Strategic Partner">
                  Strategic Partner
                </option>

                <option value="Technology Partner">
                  Technology Partner
                </option>

                <option value="Commercial Partner">
                  Commercial Partner
                </option>

              </select>

            </div>

          </div>

          <div className="mt-5">

            <label className={labelClass}>
              Description
            </label>

            <textarea
              rows={5}
              value={description}
              onChange={(event) =>
                setDescription(
                  event.target.value
                )
              }
              className={inputClass}
            />

          </div>

        </section>

        {/* BRANDING */}
        <section className="border border-[#e2ddd5] bg-white p-6 sm:p-8">

          <h2 className="text-xl font-black uppercase text-[#171717]">
            Logo & Website
          </h2>

          <div className="mt-6 space-y-5">

            <div>

              <label className={labelClass}>
                Logo URL
              </label>

              <input
                type="url"
                value={logoUrl}
                onChange={(event) =>
                  setLogoUrl(
                    event.target.value
                  )
                }
                className={inputClass}
              />

            </div>

            {logoUrl && (
              <div className="border border-[#e2ddd5] bg-[#f7f4ef] p-6">

                <p className="mb-4 text-xs font-black uppercase tracking-[0.12em] text-[#625d56]">
                  Logo Preview
                </p>

                <div className="flex min-h-[120px] items-center justify-center bg-white p-6">

                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={logoUrl}
                    alt={`${name} logo`}
                    className="max-h-[110px] max-w-full object-contain"
                  />

                </div>

              </div>
            )}

            <div>

              <label className={labelClass}>
                Website URL
              </label>

              <input
                type="url"
                value={websiteUrl}
                onChange={(event) =>
                  setWebsiteUrl(
                    event.target.value
                  )
                }
                className={inputClass}
              />

            </div>

          </div>

        </section>

        {/* DISPLAY */}
        <section className="border border-[#e2ddd5] bg-white p-6 sm:p-8">

          <h2 className="text-xl font-black uppercase text-[#171717]">
            Display Settings
          </h2>

          <div className="mt-6 max-w-sm">

            <label className={labelClass}>
              Display Order
            </label>

            <input
              type="number"
              min="0"
              value={displayOrder}
              onChange={(event) =>
                setDisplayOrder(
                  event.target.value
                )
              }
              className={inputClass}
            />

            <p className="mt-2 text-xs text-[#8a847c]">
              Lower numbers appear first.
            </p>

          </div>

          <label className="mt-6 flex items-center gap-3">

            <input
              type="checkbox"
              checked={active}
              onChange={(event) =>
                setActive(
                  event.target.checked
                )
              }
              className="h-5 w-5 accent-[#941f25]"
            />

            <span className="text-sm font-black uppercase text-[#171717]">
              Active Partner
            </span>

          </label>

        </section>

        {/* ERROR */}
        {error && (
          <div className="border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}

        {/* ACTIONS */}
        <div className="flex flex-col gap-3 sm:flex-row">

          <button
            type="submit"
            disabled={saving}
            className="bg-[#c6a24a] px-7 py-4 text-sm font-black uppercase text-[#171717] transition hover:bg-[#b08d39] disabled:opacity-60"
          >
            {saving
              ? "Saving..."
              : "Save Partner"}
          </button>

          <button
            type="button"
            onClick={() =>
              router.push(
                "/admin/partners"
              )
            }
            className="border border-[#d8d3cb] bg-white px-7 py-4 text-sm font-black uppercase text-[#171717]"
          >
            Cancel
          </button>

        </div>

      </form>

    </main>
  );
}