"use client";

import {
  useMemo,
  useState,
} from "react";

import type {
  ChangeEvent,
  FormEvent,
} from "react";

import { useRouter } from "next/navigation";

import { createClient } from "@/app/lib/supabase/client";

export default function NewPartnerPage() {
  const router = useRouter();

  const supabase = useMemo(
    () => createClient(),
    []
  );

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
    logoFile,
    setLogoFile,
  ] = useState<File | null>(
    null
  );

  const [
    logoPreview,
    setLogoPreview,
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
  ] = useState("1");

  const [active, setActive] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  function handleLogoFileChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file =
      event.target.files?.[0] ||
      null;

    setError("");

    if (!file) {
      setLogoFile(null);
      setLogoPreview("");
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/svg+xml",
    ];

    if (
      !allowedTypes.includes(
        file.type
      )
    ) {
      setLogoFile(null);
      setLogoPreview("");

      setError(
        "Logo must be a JPG, PNG, WEBP or SVG image."
      );

      event.target.value = "";

      return;
    }

    const maxSize =
      5 * 1024 * 1024;

    if (
      file.size > maxSize
    ) {
      setLogoFile(null);
      setLogoPreview("");

      setError(
        "Logo image must be 5MB or smaller."
      );

      event.target.value = "";

      return;
    }

    setLogoFile(file);

    const reader =
      new FileReader();

    reader.onload = () => {
      if (
        typeof reader.result ===
        "string"
      ) {
        setLogoPreview(
          reader.result
        );
      }
    };

    reader.readAsDataURL(
      file
    );
  }

  async function uploadLogo() {
    if (!logoFile) {
      return (
        logoUrl.trim() ||
        null
      );
    }

    const extension =
      logoFile.name
        .split(".")
        .pop()
        ?.toLowerCase() ||
      "png";

    const safePartnerName =
      (
        name.trim() ||
        "partner"
      )
        .toLowerCase()
        .replace(
          /[^a-z0-9]+/g,
          "-"
        )
        .replace(
          /^-|-$/g,
          ""
        );

    const fileName =
      `${safePartnerName}-${Date.now()}.${extension}`;

    const filePath =
      `logos/${fileName}`;

    const {
      error:
        uploadError,
    } =
      await supabase.storage
        .from(
          "partners"
        )
        .upload(
          filePath,
          logoFile,
          {
            cacheControl:
              "3600",
            upsert:
              false,
            contentType:
              logoFile.type,
          }
        );

    if (
      uploadError
    ) {
      throw uploadError;
    }

    const {
      data:
        publicUrlData,
    } =
      supabase.storage
        .from(
          "partners"
        )
        .getPublicUrl(
          filePath
        );

    return (
      publicUrlData
        .publicUrl ||
      null
    );
  }

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
        ? Number(
            displayOrder
          )
        : null;

    if (
      orderNumber !==
        null &&
      Number.isNaN(
        orderNumber
      )
    ) {
      setError(
        "Display order must be a number."
      );

      setSaving(false);

      return;
    }

    try {
      const finalLogoUrl =
        await uploadLogo();

      const {
        error:
          insertError,
      } =
        await supabase
          .from(
            "partners"
          )
          .insert({
            name:
              name.trim(),

            partner_type:
              partnerType.trim() ||
              null,

            logo_url:
              finalLogoUrl,

            website_url:
              websiteUrl.trim() ||
              null,

            description:
              description.trim() ||
              null,

            display_order:
              orderNumber,

            active,
          });

      if (
        insertError
      ) {
        throw insertError;
      }

      router.push(
        "/admin/partners"
      );

      router.refresh();

    } catch (
      submitError
    ) {
      console.error(
        "Create partner error:",
        submitError
      );

      if (
        submitError instanceof
        Error
      ) {
        setError(
          submitError.message
        );
      } else {
        setError(
          "Unable to create partner."
        );
      }

      setSaving(false);
    }
  }

  const inputClass =
    "mt-2 w-full border border-[#d8d3cb] bg-white px-4 py-3 text-[#171717] outline-none transition focus:border-[#941f25]";

  const labelClass =
    "text-xs font-black uppercase tracking-[0.12em] text-[#625d56]";

  const displayedLogo =
    logoPreview ||
    logoUrl;

  return (
    <main className="mx-auto w-full min-w-0 max-w-5xl p-4 sm:p-8 lg:p-10">

      <p className="text-xs font-black uppercase tracking-[0.25em] text-[#941f25]">
        Partner Management
      </p>

      <h1 className="mt-3 text-3xl font-black uppercase text-[#171717] sm:text-4xl">
        Add Partner
      </h1>

      <div className="mt-5 h-1 w-16 bg-[#c6a24a]" />

      <p className="mt-5 max-w-3xl leading-7 text-[#625d56]">
        Add a Heritage Boxing
        Entertainment sponsor,
        commercial partner or
        strategic partner.
      </p>

      <form
        onSubmit={
          handleSubmit
        }
        className="mt-8 space-y-8"
      >

        {/* PARTNER INFORMATION */}
        <section className="border border-[#e2ddd5] bg-white p-5 sm:p-8">

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
                onChange={(
                  event
                ) =>
                  setName(
                    event
                      .target
                      .value
                  )
                }
                placeholder="BlowPay"
                className={
                  inputClass
                }
              />

            </div>

            <div>

              <label className={labelClass}>
                Partner Type
              </label>

              <select
                value={
                  partnerType
                }
                onChange={(
                  event
                ) =>
                  setPartnerType(
                    event
                      .target
                      .value
                  )
                }
                className={
                  inputClass
                }
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
              value={
                description
              }
              onChange={(
                event
              ) =>
                setDescription(
                  event
                    .target
                    .value
                )
              }
              placeholder="Describe the partner relationship..."
              className={
                inputClass
              }
            />

          </div>

        </section>

        {/* BRANDING */}
        <section className="border border-[#e2ddd5] bg-white p-5 sm:p-8">

          <h2 className="text-xl font-black uppercase text-[#171717]">
            Logo & Website
          </h2>

          <p className="mt-2 text-sm leading-6 text-[#625d56]">
            Upload the partner logo
            directly, or paste an
            existing public logo URL.
          </p>

          <div className="mt-6 space-y-6">

            {/* LOGO UPLOAD */}
            <div>

              <label className={labelClass}>
                Upload Partner Logo
              </label>

              <div className="mt-2 border-2 border-dashed border-[#d8d3cb] bg-[#f7f4ef] p-5 sm:p-6">

                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/svg+xml"
                  onChange={
                    handleLogoFileChange
                  }
                  className="block w-full text-sm font-semibold text-[#625d56] file:mr-4 file:border-0 file:bg-[#941f25] file:px-5 file:py-3 file:text-xs file:font-black file:uppercase file:tracking-wide file:text-white hover:file:bg-[#74181d]"
                />

                <p className="mt-3 text-xs leading-5 text-[#8a847c]">
                  JPG, PNG, WEBP or
                  SVG. Maximum 5MB.
                </p>

                {logoFile && (

                  <div className="mt-4 flex flex-col gap-3 border-t border-[#ddd7ce] pt-4 sm:flex-row sm:items-center sm:justify-between">

                    <p className="min-w-0 truncate text-sm font-bold text-[#171717]">
                      {
                        logoFile.name
                      }
                    </p>

                    <button
                      type="button"
                      onClick={() => {
                        setLogoFile(
                          null
                        );

                        setLogoPreview(
                          ""
                        );
                      }}
                      className="shrink-0 border border-[#d8d3cb] bg-white px-4 py-2 text-xs font-black uppercase text-[#171717]"
                    >
                      Remove
                    </button>

                  </div>

                )}

              </div>

            </div>

            {/* MANUAL URL */}
            <div>

              <label className={labelClass}>
                Or Use Logo URL
              </label>

              <input
                type="url"
                value={
                  logoUrl
                }
                onChange={(
                  event
                ) =>
                  setLogoUrl(
                    event
                      .target
                      .value
                  )
                }
                placeholder="https://..."
                className={
                  inputClass
                }
              />

              <p className="mt-2 text-xs text-[#8a847c]">
                If you upload a file,
                the uploaded logo will
                be used instead of this
                URL.
              </p>

            </div>

            {/* LOGO PREVIEW */}
            {displayedLogo && (

              <div className="border border-[#e2ddd5] bg-[#f7f4ef] p-5 sm:p-6">

                <p className="mb-4 text-xs font-black uppercase tracking-[0.12em] text-[#625d56]">
                  Logo Preview
                </p>

                <div className="flex min-h-[150px] items-center justify-center bg-white p-6">

                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={
                      displayedLogo
                    }
                    alt="Partner logo preview"
                    className="max-h-[130px] max-w-full object-contain"
                  />

                </div>

              </div>

            )}

            {/* WEBSITE */}
            <div>

              <label className={labelClass}>
                Website URL
              </label>

              <input
                type="url"
                value={
                  websiteUrl
                }
                onChange={(
                  event
                ) =>
                  setWebsiteUrl(
                    event
                      .target
                      .value
                  )
                }
                placeholder="https://www.example.com/"
                className={
                  inputClass
                }
              />

            </div>

          </div>

        </section>

        {/* DISPLAY SETTINGS */}
        <section className="border border-[#e2ddd5] bg-white p-5 sm:p-8">

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
              value={
                displayOrder
              }
              onChange={(
                event
              ) =>
                setDisplayOrder(
                  event
                    .target
                    .value
                )
              }
              className={
                inputClass
              }
            />

            <p className="mt-2 text-xs text-[#8a847c]">
              Lower numbers appear
              first.
            </p>

          </div>

          <label className="mt-6 flex items-center gap-3">

            <input
              type="checkbox"
              checked={
                active
              }
              onChange={(
                event
              ) =>
                setActive(
                  event
                    .target
                    .checked
                )
              }
              className="h-5 w-5 accent-[#941f25]"
            />

            <span className="text-sm font-black uppercase text-[#171717]">
              Active Partner
            </span>

          </label>

          <p className="mt-2 text-sm text-[#625d56]">
            Active partners can be
            displayed on the public
            HBE website.
          </p>

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
            disabled={
              saving
            }
            className="bg-[#941f25] px-7 py-4 text-sm font-black uppercase text-white transition hover:bg-[#74181d] disabled:opacity-60"
          >
            {saving
              ? "Saving..."
              : "Add Partner"}
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