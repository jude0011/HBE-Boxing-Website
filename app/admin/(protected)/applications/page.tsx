"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import Link from "next/link";

import { createClient } from "@/app/lib/supabase/client";

type ApplicationStatus =
  | "pending"
  | "approved"
  | "rejected";

type Division = {
  id: string;
  name: string;
};

type BoxerApplication = {
  id: string;
  created_at?: string | null;

  status:
    | ApplicationStatus
    | string
    | null;

  approved_boxer_id?: string | null;
  approved_at?: string | null;

  first_name: string | null;
  last_name: string | null;
  birth_name: string | null;
  nickname: string | null;

  date_of_birth: string | null;
  gender: string | null;

  country: string | null;
  state_region: string | null;
  hometown: string | null;

  residence: string | null;
  birthplace: string | null;

  email: string | null;
  phone: string | null;

  division: string | null;
  boxer_level: string | null;

  stance: string | null;
  debut_date: string | null;

  career_start_year: number | null;
  career_end_year: number | null;

  wins: number | null;
  losses: number | null;
  draws: number | null;

  knockouts: number | null;
  knockout_losses: number | null;

  bouts: number | null;
  rounds: number | null;

  gym: string | null;
  trainer: string | null;

  boxrec_id: string | null;
  boxrec_world_rank: number | null;
  boxrec_country_rank: number | null;

  instagram_url: string | null;
  facebook_url: string | null;

  boxing_bio: string | null;
  why_hbe: string | null;

  photo_url: string | null;

  is_read: boolean;
  read_at: string | null;
};

type PhotoMap = Record<
  string,
  string
>;

function formatDate(
  value:
    | string
    | null
    | undefined
) {
  if (!value) {
    return "—";
  }

  const date =
    new Date(
      value.includes("T")
        ? value
        : `${value}T00:00:00Z`
    );

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return value;
  }

  return date.toLocaleDateString(
    "en-GB",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    }
  );
}

function Field({
  label,
  value,
}: {
  label: string;
  value:
    | string
    | number
    | null
    | undefined;
}) {
  return (
    <div className="border-b border-[#e5e0d8] py-4">

      <p className="text-[11px] font-black uppercase tracking-[0.15em] text-[#817a73]">
        {label}
      </p>

      <p className="mt-1 break-words font-bold text-[#171717]">
        {value !== null &&
        value !== undefined &&
        value !== ""
          ? value
          : "—"}
      </p>

    </div>
  );
}

function slugify(
  firstName: string,
  lastName: string
) {
  return `${firstName}-${lastName}`
    .toLowerCase()
    .trim()
    .replace(
      /[^a-z0-9]+/g,
      "-"
    )
    .replace(
      /^-|-$/g,
      ""
    );
}

function countryCode(
  country:
    | string
    | null
) {
  if (!country) {
    return null;
  }

  const value =
    country
      .trim()
      .toLowerCase();

  if (
    value.length === 2
  ) {
    return value.toUpperCase();
  }

  const codes:
    Record<
      string,
      string
    > = {
      nigeria: "NG",
      "united kingdom": "GB",
      england: "GB",
      scotland: "GB",
      wales: "GB",

      "united states": "US",
      usa: "US",
      "united states of america": "US",

      ghana: "GH",
      kenya: "KE",
      uganda: "UG",
      tanzania: "TZ",

      "south africa": "ZA",
      zimbabwe: "ZW",
      zambia: "ZM",

      cameroon: "CM",
      senegal: "SN",
      gambia: "GM",

      liberia: "LR",
      sierra_leone: "SL",
      "sierra leone": "SL",

      congo: "CG",
      "democratic republic of the congo":
        "CD",
      drc: "CD",

      canada: "CA",
      mexico: "MX",

      france: "FR",
      germany: "DE",
      italy: "IT",
      spain: "ES",
      ireland: "IE",

      australia: "AU",
      "new zealand": "NZ",

      philippines: "PH",
      japan: "JP",
      china: "CN",
      india: "IN",

      brazil: "BR",
      argentina: "AR",

      jamaica: "JM",
      cuba: "CU",
      "puerto rico": "PR",

      ukraine: "UA",
      russia: "RU",
      poland: "PL",
    };

  return (
    codes[value] ||
    null
  );
}

export default function BoxerApplicationsAdminPage() {
  const supabase =
    useMemo(
      () => createClient(),
      []
    );

  const [
    applications,
    setApplications,
  ] = useState<
    BoxerApplication[]
  >([]);

  const [
    divisions,
    setDivisions,
  ] = useState<
    Division[]
  >([]);

  const [
    photoUrls,
    setPhotoUrls,
  ] = useState<PhotoMap>(
    {}
  );

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  const [
    success,
    setSuccess,
  ] = useState("");

  const [
    filter,
    setFilter,
  ] = useState<
    | "all"
    | "pending"
    | "approved"
    | "rejected"
  >("all");

  const [
    expandedId,
    setExpandedId,
  ] = useState<
    string | null
  >(null);

  const [
    updatingId,
    setUpdatingId,
  ] = useState<
    string | null
  >(null);

  useEffect(() => {
    async function loadApplications() {
      setLoading(true);
      setError("");

      const [
        applicationResult,
        divisionResult,
      ] = await Promise.all([
        supabase
          .from(
            "boxer_applications"
          )
          .select("*")
          .order(
            "created_at",
            {
              ascending:
                false,
            }
          ),

        supabase
          .from(
            "divisions"
          )
          .select(
            "id, name"
          )
          .order(
            "name"
          ),
      ]);

      if (
        applicationResult.error
      ) {
        setError(
          applicationResult.error.message
        );

        setLoading(false);
        return;
      }

      const rows =
        (
          applicationResult.data as BoxerApplication[]
        ) || [];

      setApplications(
        rows
      );

      setDivisions(
        (
          divisionResult.data as Division[]
        ) || []
      );

      const photoEntries =
        await Promise.all(
          rows.map(
            async (
              application
            ) => {
              if (
                !application.photo_url
              ) {
                return null;
              }

              const {
                data:
                  signedData,
              } =
                await supabase.storage
                  .from(
                    "boxer-applications"
                  )
                  .createSignedUrl(
                    application.photo_url,
                    60 * 60
                  );

              if (
                !signedData
              ) {
                return null;
              }

              return [
                application.id,
                signedData.signedUrl,
              ] as const;
            }
          )
        );

      const nextPhotos:
        PhotoMap = {};

      photoEntries.forEach(
        (entry) => {
          if (!entry) {
            return;
          }

          nextPhotos[
            entry[0]
          ] =
            entry[1];
        }
      );

      setPhotoUrls(
        nextPhotos
      );

      setLoading(false);
    }

    void loadApplications();
  }, [supabase]);

  async function toggleApplicationDetails(
    application: BoxerApplication
  ) {
    if (
      expandedId ===
      application.id
    ) {
      setExpandedId(
        null
      );

      return;
    }

    setExpandedId(
      application.id
    );

    if (
      !application.is_read
    ) {
      const now =
        new Date()
          .toISOString();

      const {
        error:
          readError,
      } =
        await supabase
          .from(
            "boxer_applications"
          )
          .update({
            is_read:
              true,

            read_at:
              now,
          })
          .eq(
            "id",
            application.id
          );

      if (
        readError
      ) {
        console.error(
          "Unable to mark boxer application as read:",
          readError
        );

        return;
      }

      setApplications(
        (current) =>
          current.map(
            (item) =>
              item.id ===
              application.id
                ? {
                    ...item,

                    is_read:
                      true,

                    read_at:
                      now,
                  }
                : item
          )
      );
    }
  }

  function findDivisionId(
    divisionName:
      string | null
  ) {
    if (
      !divisionName
    ) {
      return null;
    }

    const cleaned =
      divisionName
        .trim()
        .toLowerCase();

    const match =
      divisions.find(
        (division) =>
          division.name
            .trim()
            .toLowerCase() ===
          cleaned
      );

    return (
      match?.id ||
      null
    );
  }

  async function createUniqueSlug(
    application:
      BoxerApplication
  ) {
    const base =
      slugify(
        application.first_name ||
          "boxer",
        application.last_name ||
          application.id.slice(
            0,
            6
          )
      ) ||
      `boxer-${application.id.slice(
        0,
        6
      )}`;

    const {
      data:
        existing,
    } =
      await supabase
        .from("boxers")
        .select("id")
        .eq(
          "profile_slug",
          base
        )
        .maybeSingle();

    if (!existing) {
      return base;
    }

    return `${base}-${application.id.slice(
      0,
      6
    )}`;
  }

  async function copyApplicationPhoto(
    application:
      BoxerApplication,
    boxerId: string
  ) {
    if (
      !application.photo_url
    ) {
      return null;
    }

    const {
      data:
        photoBlob,
      error:
        downloadError,
    } =
      await supabase.storage
        .from(
          "boxer-applications"
        )
        .download(
          application.photo_url
        );

    if (
      downloadError ||
      !photoBlob
    ) {
      throw new Error(
        "The application was approved, but the fighter photo could not be loaded."
      );
    }

    const extension =
      application.photo_url
        .split(".")
        .pop()
        ?.toLowerCase() ||
      "jpg";

    const name =
      slugify(
        application.first_name ||
          "boxer",
        application.last_name ||
          "fighter"
      ) || "boxer";

    const storagePath =
      `${boxerId}/${name}-${Date.now()}.${extension}`;

    const {
      error:
        uploadError,
    } =
      await supabase.storage
        .from(
          "boxers"
        )
        .upload(
          storagePath,
          photoBlob,
          {
            cacheControl:
              "3600",
            upsert: false,
          }
        );

    if (uploadError) {
      throw new Error(
        uploadError.message
      );
    }

    const {
      data:
        publicUrl,
    } =
      supabase.storage
        .from("boxers")
        .getPublicUrl(
          storagePath
        );

    return (
      publicUrl.publicUrl
    );
  }

  async function approveAndCreateBoxer(
    application:
      BoxerApplication
  ) {
    setUpdatingId(
      application.id
    );

    setError("");
    setSuccess("");

    /*
      DUPLICATE PROTECTION
    */
    if (
      application.approved_boxer_id
    ) {
      setSuccess(
        "This application has already been approved and linked to a boxer."
      );

      setUpdatingId(
        null
      );

      return;
    }

    try {
      const boxerId =
        crypto.randomUUID();

      const profileSlug =
        await createUniqueSlug(
          application
        );

      const divisionId =
        findDivisionId(
          application.division
        );

      /*
        COPY PHOTO FIRST
      */
      const boxerPhotoUrl =
        await copyApplicationPhoto(
          application,
          boxerId
        );

      const wins =
        application.wins ??
        0;

      const knockouts =
        application.knockouts ??
        0;

      const koPercentage =
        wins > 0
          ? Number(
              (
                (
                  knockouts /
                  wins
                ) *
                100
              ).toFixed(
                1
              )
            )
          : 0;

      /*
        CREATE BOXER
      */
      const {
        error:
          boxerError,
      } =
        await supabase
          .from(
            "boxers"
          )
          .insert({
            id:
              boxerId,

            first_name:
              application.first_name,

            last_name:
              application.last_name,

            nickname:
              application.nickname,

            profile_slug:
              profileSlug,

            photo_url:
              boxerPhotoUrl,

            division_id:
              divisionId,

            nationality_code:
              countryCode(
                application.country
              ),

            hometown:
              application.hometown,

            state_region:
              application.state_region,

            career_highlights:
              application.boxing_bio,

            active:
              true,

            birth_name:
              application.birth_name,

            date_of_birth:
              application.date_of_birth,

            gender:
              application.gender,

            residence:
              application.residence,

            birthplace:
              application.birthplace,

            career_start_year:
              application.career_start_year,

            career_end_year:
              application.career_end_year,

            debut_date:
              application.debut_date,

            facebook_url:
              application.facebook_url,

            instagram_url:
              application.instagram_url,

            wins:
              application.wins ??
              0,

            losses:
              application.losses ??
              0,

            draws:
              application.draws ??
              0,

            knockout_wins:
              application.knockouts ??
              0,

            knockout_losses:
              application.knockout_losses ??
              0,

            bouts:
              application.bouts ??
              0,

            rounds:
              application.rounds ??
              0,

            ko_percentage:
              koPercentage,

            stance:
              application.stance,

            boxrec_id:
              application.boxrec_id,

            boxrec_world_rank:
              application.boxrec_world_rank,

            boxrec_country_rank:
              application.boxrec_country_rank,

            boxrec_rating_stars:
              0,

            boxrec_world_total:
              null,

            boxrec_country_total:
              null,

            boxrec_last_checked:
              application.boxrec_id
                ? new Date()
                    .toISOString()
                    .slice(
                      0,
                      10
                    )
                : null,
          });

      if (
        boxerError
      ) {
        throw new Error(
          boxerError.message
        );
      }

      /*
        LINK APPLICATION TO BOXER
        + APPROVE
      */
      const {
        error:
          applicationError,
      } =
        await supabase
          .from(
            "boxer_applications"
          )
          .update({
            status:
              "approved",

            approved_boxer_id:
              boxerId,

            approved_at:
              new Date()
                .toISOString(),
          })
          .eq(
            "id",
            application.id
          );

      if (
        applicationError
      ) {
        throw new Error(
          applicationError.message
        );
      }

      setApplications(
        (current) =>
          current.map(
            (item) =>
              item.id ===
              application.id
                ? {
                    ...item,

                    status:
                      "approved",

                    approved_boxer_id:
                      boxerId,

                    approved_at:
                      new Date()
                        .toISOString(),
                  }
                : item
          )
      );

      setSuccess(
        `${application.first_name || "The fighter"} ${application.last_name || ""} was approved and created as an HBE boxer.`
      );

    } catch (
      approvalError
    ) {
      console.error(
        approvalError
      );

      setError(
        approvalError instanceof
          Error
          ? approvalError.message
          : "Unable to approve this application."
      );
    }

    setUpdatingId(
      null
    );
  }

  async function updateStatus(
    applicationId:
      string,
    status:
      "pending" |
      "rejected"
  ) {
    setUpdatingId(
      applicationId
    );

    setError("");
    setSuccess("");

    const {
      error:
        updateError,
    } =
      await supabase
        .from(
          "boxer_applications"
        )
        .update({
          status,
        })
        .eq(
          "id",
          applicationId
        );

    if (
      updateError
    ) {
      setError(
        updateError.message
      );

      setUpdatingId(
        null
      );

      return;
    }

    setApplications(
      (current) =>
        current.map(
          (application) =>
            application.id ===
            applicationId
              ? {
                  ...application,
                  status,
                }
              : application
        )
    );

    setUpdatingId(
      null
    );
  }

  const pendingCount =
    applications.filter(
      (application) =>
        application.status ===
        "pending"
    ).length;

  const approvedCount =
    applications.filter(
      (application) =>
        application.status ===
        "approved"
    ).length;

  const rejectedCount =
    applications.filter(
      (application) =>
        application.status ===
        "rejected"
    ).length;

  const filteredApplications =
    applications.filter(
      (application) => {
        if (
          filter === "all"
        ) {
          return true;
        }

        return (
          application.status ===
          filter
        );
      }
    );

  function statusClasses(
    status:
      string | null
  ) {
    if (
      status === "approved"
    ) {
      return "bg-green-100 text-green-700";
    }

    if (
      status === "rejected"
    ) {
      return "bg-red-100 text-red-700";
    }

    return "bg-amber-100 text-amber-700";
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl p-10">

        <p className="font-black uppercase">
          Loading Boxer Applications...
        </p>

      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl p-5 sm:p-8 lg:p-10">

      {/* HEADER */}
      <div>

        <p className="text-xs font-black uppercase tracking-[0.25em] text-[#941f25]">
          Fighter Recruitment
        </p>

        <h1 className="mt-3 text-3xl font-black uppercase sm:text-4xl">
          Boxer Applications
        </h1>

        <div className="mt-5 h-1 w-16 bg-[#c6a24a]" />

        <p className="mt-5 max-w-3xl leading-7 text-[#625d56]">
          Review fighter applications.
          Approving an application
          automatically creates the
          official HBE boxer profile.
        </p>

      </div>

      {/* MESSAGES */}
      {success && (

        <div className="mt-7 border border-green-200 bg-green-50 p-4 font-semibold text-green-700">
          {success}
        </div>

      )}

      {error && (

        <div className="mt-7 border border-red-200 bg-red-50 p-4 font-semibold text-red-700">
          {error}
        </div>

      )}

      {/* COUNTS */}
      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

        <div className="border border-[#e2ddd5] bg-white p-6">
          <p className="text-xs font-black uppercase text-[#817a73]">
            Total Applications
          </p>

          <p className="mt-2 text-3xl font-black">
            {applications.length}
          </p>
        </div>

        <div className="border border-[#e2ddd5] bg-white p-6">
          <p className="text-xs font-black uppercase text-[#817a73]">
            Pending
          </p>

          <p className="mt-2 text-3xl font-black text-amber-700">
            {pendingCount}
          </p>
        </div>

        <div className="border border-[#e2ddd5] bg-white p-6">
          <p className="text-xs font-black uppercase text-[#817a73]">
            Approved
          </p>

          <p className="mt-2 text-3xl font-black text-green-700">
            {approvedCount}
          </p>
        </div>

        <div className="border border-[#e2ddd5] bg-white p-6">
          <p className="text-xs font-black uppercase text-[#817a73]">
            Rejected
          </p>

          <p className="mt-2 text-3xl font-black text-red-700">
            {rejectedCount}
          </p>
        </div>

      </section>

      {/* FILTERS */}
      <div className="mt-8 flex flex-wrap gap-3">

        {[
          ["all", "All"],
          ["pending", "Pending"],
          ["approved", "Approved"],
          ["rejected", "Rejected"],
        ].map(
          ([
            value,
            label,
          ]) => (

            <button
              key={value}
              type="button"
              onClick={() =>
                setFilter(
                  value as
                    typeof filter
                )
              }
              className={
                filter ===
                value
                  ? "bg-[#941f25] px-5 py-3 text-xs font-black uppercase text-white"
                  : "border border-[#d8d3cb] bg-white px-5 py-3 text-xs font-black uppercase"
              }
            >
              {label}
            </button>

          )
        )}

      </div>

      {/* APPLICATIONS */}
      <section className="mt-8 space-y-5">

        {filteredApplications.length ===
        0 ? (

          <div className="border border-[#e2ddd5] bg-white p-8">
            No boxer applications found.
          </div>

        ) : (

          filteredApplications.map(
            (application) => {
              const fullName =
                `${application.first_name || ""} ${
                  application.last_name || ""
                }`.trim();

              const expanded =
                expandedId ===
                application.id;

              const record =
                `${application.wins ?? 0}-${
                  application.losses ?? 0
                }-${application.draws ?? 0}`;

              const photo =
                photoUrls[
                  application.id
                ];

              return (

                <article
                  key={
                    application.id
                  }
                  className="overflow-hidden border border-[#e2ddd5] bg-white"
                >

                  {/* SUMMARY */}
                  <div className="p-5 sm:p-6">

                    <div className="grid gap-6 lg:grid-cols-[110px_1fr_auto] lg:items-center">

                      <div className="h-[130px] w-[105px] overflow-hidden bg-[#efebe5]">

                        {photo ? (

                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={photo}
                            alt={fullName}
                            className="h-full w-full object-cover"
                          />

                        ) : (

                          <div className="flex h-full items-center justify-center p-3 text-center text-xs">
                            Photo unavailable
                          </div>

                        )}

                      </div>

                      <div>

                        <div className="flex flex-wrap items-center gap-3">

                          <h2 className="text-xl font-black uppercase sm:text-2xl">
                            {fullName}
                          </h2>

                          <span
                            className={`px-3 py-2 text-xs font-black uppercase ${statusClasses(
                              application.status
                            )}`}
                          >
                            {application.status ||
                              "pending"}
                          </span>

                        </div>

                        {application.nickname && (

                          <p className="mt-1 italic text-[#625d56]">
                            &ldquo;
                            {application.nickname}
                            &rdquo;
                          </p>

                        )}

                        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-[#625d56]">

                          <span>
                            <strong>
                              Division:
                            </strong>{" "}
                            {application.division ||
                              "—"}
                          </span>

                          <span>
                            <strong>
                              Record:
                            </strong>{" "}
                            {record}
                          </span>

                          <span>
                            <strong>
                              Country:
                            </strong>{" "}
                            {application.country ||
                              "—"}
                          </span>

                          <span>
                            <strong>
                              Applied:
                            </strong>{" "}
                            {formatDate(
                              application.created_at
                            )}
                          </span>

                        </div>

                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          void toggleApplicationDetails(
                            application
                          )
                        }
                        className="bg-[#c6a24a] px-5 py-3 text-xs font-black uppercase text-[#171717] transition hover:bg-[#b08d39]"
                      >
                        {expanded
                          ? "Close Details"
                          : "Review Application"}
                      </button>

                    </div>

                  </div>

                  {expanded && (

                    <div className="border-t border-[#e2ddd5] bg-[#f7f4ef] p-5 sm:p-8">

                      {/* PERSONAL */}
                      <section>

                        <p className="text-xs font-black uppercase tracking-[0.2em] text-[#941f25]">
                          Personal Information
                        </p>

                        <div className="mt-5 grid gap-x-8 bg-white px-5 sm:grid-cols-2 lg:grid-cols-3">

                          <Field
                            label="First Name"
                            value={application.first_name}
                          />

                          <Field
                            label="Last Name"
                            value={application.last_name}
                          />

                          <Field
                            label="Birth Name"
                            value={application.birth_name}
                          />

                          <Field
                            label="Nickname"
                            value={application.nickname}
                          />

                          <Field
                            label="Date of Birth"
                            value={formatDate(
                              application.date_of_birth
                            )}
                          />

                          <Field
                            label="Gender"
                            value={application.gender}
                          />

                          <Field
                            label="Country / Nationality"
                            value={application.country}
                          />

                          <Field
                            label="State / Region"
                            value={application.state_region}
                          />

                          <Field
                            label="Hometown"
                            value={application.hometown}
                          />

                          <Field
                            label="Residence"
                            value={application.residence}
                          />

                          <Field
                            label="Birthplace"
                            value={application.birthplace}
                          />

                        </div>

                      </section>

                      {/* CONTACT */}
                      <section className="mt-8">

                        <p className="text-xs font-black uppercase tracking-[0.2em] text-[#941f25]">
                          Contact Information
                        </p>

                        <div className="mt-5 grid gap-x-8 bg-white px-5 sm:grid-cols-2">

                          <Field
                            label="Email"
                            value={application.email}
                          />

                          <Field
                            label="Phone"
                            value={application.phone}
                          />

                        </div>

                      </section>

                      {/* BOXING */}
                      <section className="mt-8">

                        <p className="text-xs font-black uppercase tracking-[0.2em] text-[#941f25]">
                          Professional Fighter Profile
                        </p>

                        <div className="mt-5 grid gap-x-8 bg-white px-5 sm:grid-cols-2 lg:grid-cols-3">

                          <Field
                            label="Division"
                            value={application.division}
                          />

                          <Field
                            label="Boxer Level"
                            value={application.boxer_level}
                          />

                          <Field
                            label="Stance"
                            value={application.stance}
                          />

                          <Field
                            label="Professional Debut"
                            value={formatDate(
                              application.debut_date
                            )}
                          />

                          <Field
                            label="Career Start Year"
                            value={application.career_start_year}
                          />

                          <Field
                            label="Career End Year"
                            value={application.career_end_year}
                          />

                          <Field
                            label="Gym"
                            value={application.gym}
                          />

                          <Field
                            label="Trainer"
                            value={application.trainer}
                          />

                        </div>

                      </section>

                      {/* RECORD */}
                      <section className="mt-8">

                        <p className="text-xs font-black uppercase tracking-[0.2em] text-[#941f25]">
                          Professional Record
                        </p>

                        <div className="mt-5 grid gap-x-8 bg-white px-5 sm:grid-cols-2 lg:grid-cols-4">

                          <Field
                            label="Wins"
                            value={application.wins ?? 0}
                          />

                          <Field
                            label="Losses"
                            value={application.losses ?? 0}
                          />

                          <Field
                            label="Draws"
                            value={application.draws ?? 0}
                          />

                          <Field
                            label="KO Wins"
                            value={application.knockouts ?? 0}
                          />

                          <Field
                            label="KO Losses"
                            value={application.knockout_losses ?? 0}
                          />

                          <Field
                            label="Bouts"
                            value={application.bouts ?? 0}
                          />

                          <Field
                            label="Rounds"
                            value={application.rounds ?? 0}
                          />

                        </div>

                      </section>

                      {/* BOXREC */}
                      <section className="mt-8">

                        <p className="text-xs font-black uppercase tracking-[0.2em] text-[#941f25]">
                          BoxRec Information
                        </p>

                        <div className="mt-5 grid gap-x-8 bg-white px-5 sm:grid-cols-3">

                          <Field
                            label="BoxRec ID"
                            value={application.boxrec_id}
                          />

                          <Field
                            label="World Rank"
                            value={application.boxrec_world_rank}
                          />

                          <Field
                            label="National Rank"
                            value={application.boxrec_country_rank}
                          />

                        </div>

                      </section>

                      {/* SOCIAL */}
                      <section className="mt-8">

                        <p className="text-xs font-black uppercase tracking-[0.2em] text-[#941f25]">
                          Social Media
                        </p>

                        <div className="mt-5 grid gap-5 sm:grid-cols-2">

                          <div className="bg-white p-5">

                            <p className="text-xs font-black uppercase">
                              Instagram
                            </p>

                            {application.instagram_url ? (

                              <a
                                href={application.instagram_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-2 block break-all font-bold text-[#941f25]"
                              >
                                {application.instagram_url}
                              </a>

                            ) : (
                              <p className="mt-2">
                                —
                              </p>
                            )}

                          </div>

                          <div className="bg-white p-5">

                            <p className="text-xs font-black uppercase">
                              Facebook
                            </p>

                            {application.facebook_url ? (

                              <a
                                href={application.facebook_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-2 block break-all font-bold text-[#941f25]"
                              >
                                {application.facebook_url}
                              </a>

                            ) : (
                              <p className="mt-2">
                                —
                              </p>
                            )}

                          </div>

                        </div>

                      </section>

                      {/* BIO */}
                      <section className="mt-8 grid gap-5 lg:grid-cols-2">

                        <div className="bg-white p-6">

                          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#941f25]">
                            Boxing Career
                          </p>

                          <p className="mt-4 whitespace-pre-line leading-7 text-[#5f5b55]">
                            {application.boxing_bio ||
                              "—"}
                          </p>

                        </div>

                        <div className="bg-white p-6">

                          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#941f25]">
                            Why HBE?
                          </p>

                          <p className="mt-4 whitespace-pre-line leading-7 text-[#5f5b55]">
                            {application.why_hbe ||
                              "—"}
                          </p>

                        </div>

                      </section>

                      {/* WORKFLOW */}
                      <section className="mt-8 border border-[#e2ddd5] bg-white p-6">

                        <p className="text-xs font-black uppercase tracking-[0.2em] text-[#941f25]">
                          Application Workflow
                        </p>

                        <h3 className="mt-2 text-xl font-black uppercase">
                          Review Decision
                        </h3>

                        {application.approved_boxer_id ? (

                          <div className="mt-5">

                            <div className="border border-green-200 bg-green-50 p-5">

                              <p className="font-black uppercase text-green-700">
                                Boxer Created
                              </p>

                              <p className="mt-2 text-sm text-green-700">
                                This application is connected to an official HBE boxer.
                              </p>

                              <Link
                                href={`/admin/boxers/${application.approved_boxer_id}`}
                                className="mt-4 inline-flex bg-[#c6a24a] px-5 py-3 text-xs font-black uppercase text-[#171717] transition hover:bg-[#b08d39]"
                              >
                                Edit Boxer
                              </Link>

                            </div>

                          </div>

                        ) : (

                          <div className="mt-5 flex flex-wrap gap-3">

                            <button
                              type="button"
                              disabled={
                                updatingId === application.id
                              }
                              onClick={() =>
                                updateStatus(
                                  application.id,
                                  "pending"
                                )
                              }
                              className="border border-amber-300 bg-amber-50 px-5 py-3 text-xs font-black uppercase text-amber-700 disabled:opacity-50"
                            >
                              Pending
                            </button>

                            <button
                              type="button"
                              disabled={
                                updatingId === application.id
                              }
                              onClick={() =>
                                approveAndCreateBoxer(
                                  application
                                )
                              }
                              className="bg-green-700 px-5 py-3 text-xs font-black uppercase text-white disabled:opacity-50"
                            >
                              {updatingId === application.id
                                ? "Creating Boxer..."
                                : "Approve & Create Boxer"}
                            </button>

                            <button
                              type="button"
                              disabled={
                                updatingId === application.id
                              }
                              onClick={() =>
                                updateStatus(
                                  application.id,
                                  "rejected"
                                )
                              }
                              className="border border-red-300 bg-red-50 px-5 py-3 text-xs font-black uppercase text-red-700 disabled:opacity-50"
                            >
                              Reject
                            </button>

                          </div>

                        )}

                      </section>

                    </div>

                  )}

                </article>

              );
            }
          )

        )}

      </section>

    </main>
  );
}