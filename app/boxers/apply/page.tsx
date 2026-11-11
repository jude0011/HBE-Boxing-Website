"use client";

import {
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";

import Link from "next/link";

import { createClient } from "@/app/lib/supabase/client";

type Division = {
  id: string;
  name: string;
};

function numberOrNull(
  value: FormDataEntryValue | null
) {
  const text =
    String(
      value || ""
    ).trim();

  if (!text) {
    return null;
  }

  const number =
    Number(text);

  return Number.isFinite(
    number
  )
    ? number
    : null;
}

function textOrNull(
  value: FormDataEntryValue | null
) {
  const text =
    String(
      value || ""
    ).trim();

  return text || null;
}

function safeFileName(
  value: string
) {
  return value
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

export default function BoxerApplicationPage() {
  const supabase =
    useMemo(
      () => createClient(),
      []
    );

  const [
    divisions,
    setDivisions,
  ] =
    useState<Division[]>(
      []
    );

  const [
    loadingDivisions,
    setLoadingDivisions,
  ] =
    useState(true);

  const [
    submitting,
    setSubmitting,
  ] =
    useState(false);

  const [
    success,
    setSuccess,
  ] =
    useState("");

  const [
    errorMessage,
    setErrorMessage,
  ] =
    useState("");

  const [
    photoFile,
    setPhotoFile,
  ] =
    useState<File | null>(
      null
    );

  /*
    LOAD HBE DIVISIONS
  */
  useEffect(() => {
    async function loadDivisions() {
      const {
        data,
        error,
      } =
        await supabase
          .from(
            "divisions"
          )
          .select(
            "id, name"
          )
          .order(
            "name"
          );

      if (error) {
        console.error(
          "Division loading error:",
          error
        );
      }

      setDivisions(
        (
          data as Division[]
        ) || []
      );

      setLoadingDivisions(
        false
      );
    }

    void loadDivisions();
  }, [supabase]);

  /*
    UPLOAD FIGHTER PHOTO
  */
  async function uploadPhoto(
    file: File,
    firstName: string,
    lastName: string
  ) {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (
      !allowedTypes.includes(
        file.type
      )
    ) {
      throw new Error(
        "Please upload a JPG, PNG or WEBP image."
      );
    }

    const maxSize =
      10 *
      1024 *
      1024;

    if (
      file.size >
      maxSize
    ) {
      throw new Error(
        "The fighter photo must be 10 MB or smaller."
      );
    }

    const extension =
      file.name
        .split(".")
        .pop()
        ?.toLowerCase() ||
      "jpg";

    const fighterName =
      safeFileName(
        `${firstName}-${lastName}`
      ) ||
      "fighter";

    const applicationFolder =
      crypto.randomUUID();

    const storagePath =
      `${applicationFolder}/${fighterName}-${Date.now()}.${extension}`;

    const {
      error:
        uploadError,
    } =
      await supabase.storage
        .from(
          "boxer-applications"
        )
        .upload(
          storagePath,
          file,
          {
            cacheControl:
              "3600",

            upsert:
              false,
          }
        );

    if (
      uploadError
    ) {
      console.error(
        "Boxer photo upload error:",
        uploadError
      );

      throw new Error(
        uploadError.message
      );
    }

    /*
      IMPORTANT:
      We save the STORAGE PATH,
      not a public URL.

      Your Admin application page
      creates a signed URL from
      this path.
    */
    return storagePath;
  }

  /*
    SUBMIT APPLICATION
  */
  async function handleSubmit(
    event:
      FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setSubmitting(
      true
    );

    setSuccess(
      ""
    );

    setErrorMessage(
      ""
    );

    const form =
      event.currentTarget;

    const formData =
      new FormData(
        form
      );

    const firstName =
      String(
        formData.get(
          "first_name"
        ) || ""
      ).trim();

    const lastName =
      String(
        formData.get(
          "last_name"
        ) || ""
      ).trim();

    const email =
      String(
        formData.get(
          "email"
        ) || ""
      ).trim();

    if (
      !firstName ||
      !lastName ||
      !email
    ) {
      setErrorMessage(
        "First name, last name and email are required."
      );

      setSubmitting(
        false
      );

      return;
    }

    let uploadedPhotoPath:
      | string
      | null =
      null;

    try {
      /*
        UPLOAD PHOTO FIRST
      */
      if (
        photoFile
      ) {
        uploadedPhotoPath =
          await uploadPhoto(
            photoFile,
            firstName,
            lastName
          );
      }

      /*
        BUILD APPLICATION
      */
      const application = {
        status:
          "pending",

        first_name:
          firstName,

        last_name:
          lastName,

        birth_name:
          textOrNull(
            formData.get(
              "birth_name"
            )
          ),

        nickname:
          textOrNull(
            formData.get(
              "nickname"
            )
          ),

        date_of_birth:
          textOrNull(
            formData.get(
              "date_of_birth"
            )
          ),

        gender:
          textOrNull(
            formData.get(
              "gender"
            )
          ),

        country:
          textOrNull(
            formData.get(
              "country"
            )
          ),

        state_region:
          textOrNull(
            formData.get(
              "state_region"
            )
          ),

        hometown:
          textOrNull(
            formData.get(
              "hometown"
            )
          ),

        residence:
          textOrNull(
            formData.get(
              "residence"
            )
          ),

        birthplace:
          textOrNull(
            formData.get(
              "birthplace"
            )
          ),

        email,

        phone:
          textOrNull(
            formData.get(
              "phone"
            )
          ),

        division:
          textOrNull(
            formData.get(
              "division"
            )
          ),

        boxer_level:
          textOrNull(
            formData.get(
              "boxer_level"
            )
          ),

        stance:
          textOrNull(
            formData.get(
              "stance"
            )
          ),

        debut_date:
          textOrNull(
            formData.get(
              "debut_date"
            )
          ),

        career_start_year:
          numberOrNull(
            formData.get(
              "career_start_year"
            )
          ),

        career_end_year:
          numberOrNull(
            formData.get(
              "career_end_year"
            )
          ),

        wins:
          numberOrNull(
            formData.get(
              "wins"
            )
          ),

        losses:
          numberOrNull(
            formData.get(
              "losses"
            )
          ),

        draws:
          numberOrNull(
            formData.get(
              "draws"
            )
          ),

        knockouts:
          numberOrNull(
            formData.get(
              "knockouts"
            )
          ),

        knockout_losses:
          numberOrNull(
            formData.get(
              "knockout_losses"
            )
          ),

        bouts:
          numberOrNull(
            formData.get(
              "bouts"
            )
          ),

        rounds:
          numberOrNull(
            formData.get(
              "rounds"
            )
          ),

        gym:
          textOrNull(
            formData.get(
              "gym"
            )
          ),

        trainer:
          textOrNull(
            formData.get(
              "trainer"
            )
          ),

        boxrec_id:
          textOrNull(
            formData.get(
              "boxrec_id"
            )
          ),

        boxrec_world_rank:
          numberOrNull(
            formData.get(
              "boxrec_world_rank"
            )
          ),

        boxrec_country_rank:
          numberOrNull(
            formData.get(
              "boxrec_country_rank"
            )
          ),

        instagram_url:
          textOrNull(
            formData.get(
              "instagram_url"
            )
          ),

        facebook_url:
          textOrNull(
            formData.get(
              "facebook_url"
            )
          ),

        boxing_bio:
          textOrNull(
            formData.get(
              "boxing_bio"
            )
          ),

        why_hbe:
          textOrNull(
            formData.get(
              "why_hbe"
            )
          ),

        photo_url:
          uploadedPhotoPath,

        /*
          NEW ADMIN NOTIFICATION SYSTEM
        */
        is_read:
          false,

        read_at:
          null,
      };

      /*
        SAVE APPLICATION
      */
      const {
        error:
          insertError,
      } =
        await supabase
          .from(
            "boxer_applications"
          )
          .insert(
            application
          );

      if (
        insertError
      ) {
        console.error(
          "Boxer application insert error:",
          insertError
        );

        /*
          REMOVE PHOTO IF DATABASE
          INSERT FAILED
        */
        if (
          uploadedPhotoPath
        ) {
          await supabase.storage
            .from(
              "boxer-applications"
            )
            .remove([
              uploadedPhotoPath,
            ]);
        }

        throw new Error(
          insertError.message
        );
      }

      /*
        SUCCESS
      */
      setSuccess(
        "Thank you. Your HBE boxer application has been submitted successfully. The Heritage Boxing Entertainment team will review your application."
      );

      setPhotoFile(
        null
      );

      form.reset();

      window.scrollTo({
        top: 0,
        behavior:
          "smooth",
      });

    } catch (
      submissionError
    ) {
      console.error(
        "Boxer application error:",
        submissionError
      );

      setErrorMessage(
        submissionError instanceof
          Error
          ? submissionError.message
          : "Something went wrong. Please try again."
      );

    } finally {
      setSubmitting(
        false
      );
    }
  }

  const inputClass =
    "mt-2 w-full border border-[#d8d2ca] bg-white px-4 py-4 text-[#171717] outline-none transition focus:border-[#941f25]";

  const labelClass =
    "block text-xs font-black uppercase tracking-[0.14em] text-[#625d56]";

  const sectionTitleClass =
    "text-2xl font-black uppercase text-[#171717] sm:text-3xl";

  return (
    <main className="min-h-screen bg-white text-[#171717]">

      {/* =====================================
          HERO
          ===================================== */}
      <section
        className="relative overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('/images/boxers-hero.png')",
        }}
      >

        <div className="absolute inset-0 bg-black/55" />

        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/15 to-transparent" />

        <div className="relative mx-auto flex min-h-[520px] max-w-7xl items-start px-4 pb-14 pt-12 sm:min-h-[560px] sm:items-center sm:px-6 sm:py-16 lg:px-8">

          <div className="max-w-4xl">

            <p className="text-xs font-black uppercase tracking-[0.32em] text-[#e0c273] sm:text-sm">
              Heritage Boxing Entertainment
            </p>

            <h1 className="mt-4 max-w-4xl text-4xl font-black uppercase leading-[1.05] tracking-[-0.02em] text-white drop-shadow-[0_3px_10px_rgba(0,0,0,0.65)] sm:text-6xl lg:text-7xl">
              Apply To HBE
            </h1>

            <p className="mt-7 max-w-3xl text-lg font-medium leading-8 text-white/95 sm:text-xl">
              Professional and debut fighters can
              submit their boxing profile for
              consideration by Heritage Boxing
              Entertainment.
            </p>

            <div className="mt-7">

              <Link
                href="/boxers"
                className="inline-flex min-h-[52px] w-full items-center justify-center border-2 border-white bg-white px-7 py-3 text-sm font-black uppercase tracking-wide text-[#171717] transition hover:border-[#c6a24a] hover:bg-[#c6a24a] sm:w-auto"
              >
                View HBE Boxers
              </Link>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================
          INTRO
          ===================================== */}
      <section className="border-b border-[#e5e0d8] bg-[#f7f4ef]">

        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

          <div className="max-w-4xl">

            <p className="text-xs font-black uppercase tracking-[0.25em] text-[#941f25]">
              Fighter Recruitment
            </p>

            <h2 className="mt-3 text-3xl font-black uppercase sm:text-4xl">
              Official Boxer Application
            </h2>

            <div className="mt-5 h-1 w-20 bg-[#c6a24a]" />

            <p className="mt-6 leading-8 text-[#5f5b55]">
              Complete the application as accurately
              as possible. HBE will review your
              personal information, boxing
              experience, professional record,
              ranking information and career
              background.
            </p>

            <p className="mt-4 leading-8 text-[#5f5b55]">
              Submission of an application does not
              guarantee acceptance or an HBE boxer
              profile. Approved applicants can be
              added to the official HBE boxer
              database by the HBE administration
              team.
            </p>

          </div>

        </div>

      </section>

      {/* =====================================
          APPLICATION FORM
          ===================================== */}
      <section className="bg-white">

        <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">

          {/* SUCCESS */}
          {success && (

            <div className="mb-8 border border-green-200 bg-green-50 p-6 text-green-800">

              <p className="font-black uppercase">
                Application Submitted
              </p>

              <p className="mt-2 leading-7">
                {success}
              </p>

            </div>

          )}

          {/* ERROR */}
          {errorMessage && (

            <div className="mb-8 border border-red-200 bg-red-50 p-6 text-red-800">

              <p className="font-black uppercase">
                Unable To Submit Application
              </p>

              <p className="mt-2 leading-7">
                {errorMessage}
              </p>

            </div>

          )}

          <form
            onSubmit={
              handleSubmit
            }
            className="space-y-10"
          >

            {/* =================================
                PERSONAL INFORMATION
                ================================= */}
            <section className="border border-[#e5e0d8] bg-[#f7f4ef] p-6 sm:p-8">

              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#941f25]">
                Section 1
              </p>

              <h2 className={`mt-3 ${sectionTitleClass}`}>
                Personal Information
              </h2>

              <div className="mt-5 h-1 w-16 bg-[#c6a24a]" />

              <div className="mt-8 grid gap-6 sm:grid-cols-2">

                <div>

                  <label
                    htmlFor="first_name"
                    className={
                      labelClass
                    }
                  >
                    First Name *
                  </label>

                  <input
                    id="first_name"
                    name="first_name"
                    type="text"
                    required
                    className={
                      inputClass
                    }
                  />

                </div>

                <div>

                  <label
                    htmlFor="last_name"
                    className={
                      labelClass
                    }
                  >
                    Last Name *
                  </label>

                  <input
                    id="last_name"
                    name="last_name"
                    type="text"
                    required
                    className={
                      inputClass
                    }
                  />

                </div>

                <div>

                  <label
                    htmlFor="birth_name"
                    className={
                      labelClass
                    }
                  >
                    Birth Name
                  </label>

                  <input
                    id="birth_name"
                    name="birth_name"
                    type="text"
                    className={
                      inputClass
                    }
                  />

                </div>

                <div>

                  <label
                    htmlFor="nickname"
                    className={
                      labelClass
                    }
                  >
                    Boxing Nickname
                  </label>

                  <input
                    id="nickname"
                    name="nickname"
                    type="text"
                    className={
                      inputClass
                    }
                  />

                </div>

                <div>

                  <label
                    htmlFor="date_of_birth"
                    className={
                      labelClass
                    }
                  >
                    Date Of Birth
                  </label>

                  <input
                    id="date_of_birth"
                    name="date_of_birth"
                    type="date"
                    className={
                      inputClass
                    }
                  />

                </div>

                <div>

                  <label
                    htmlFor="gender"
                    className={
                      labelClass
                    }
                  >
                    Gender
                  </label>

                  <select
                    id="gender"
                    name="gender"
                    defaultValue=""
                    className={
                      inputClass
                    }
                  >

                    <option value="">
                      Select Gender
                    </option>

                    <option value="Male">
                      Male
                    </option>

                    <option value="Female">
                      Female
                    </option>

                  </select>

                </div>

                <div>

                  <label
                    htmlFor="country"
                    className={
                      labelClass
                    }
                  >
                    Country / Nationality *
                  </label>

                  <input
                    id="country"
                    name="country"
                    type="text"
                    required
                    placeholder="Example: Nigeria"
                    className={
                      inputClass
                    }
                  />

                </div>

                <div>

                  <label
                    htmlFor="state_region"
                    className={
                      labelClass
                    }
                  >
                    State / Region
                  </label>

                  <input
                    id="state_region"
                    name="state_region"
                    type="text"
                    className={
                      inputClass
                    }
                  />

                </div>

                <div>

                  <label
                    htmlFor="hometown"
                    className={
                      labelClass
                    }
                  >
                    Hometown
                  </label>

                  <input
                    id="hometown"
                    name="hometown"
                    type="text"
                    className={
                      inputClass
                    }
                  />

                </div>

                <div>

                  <label
                    htmlFor="residence"
                    className={
                      labelClass
                    }
                  >
                    Current Residence
                  </label>

                  <input
                    id="residence"
                    name="residence"
                    type="text"
                    className={
                      inputClass
                    }
                  />

                </div>

                <div className="sm:col-span-2">

                  <label
                    htmlFor="birthplace"
                    className={
                      labelClass
                    }
                  >
                    Birthplace
                  </label>

                  <input
                    id="birthplace"
                    name="birthplace"
                    type="text"
                    className={
                      inputClass
                    }
                  />

                </div>

              </div>

            </section>

            {/* =================================
                CONTACT INFORMATION
                ================================= */}
            <section className="border border-[#e5e0d8] bg-white p-6 sm:p-8">

              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#941f25]">
                Section 2
              </p>

              <h2 className={`mt-3 ${sectionTitleClass}`}>
                Contact Information
              </h2>

              <div className="mt-5 h-1 w-16 bg-[#c6a24a]" />

              <div className="mt-8 grid gap-6 sm:grid-cols-2">

                <div>

                  <label
                    htmlFor="email"
                    className={
                      labelClass
                    }
                  >
                    Email Address *
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className={
                      inputClass
                    }
                  />

                </div>

                <div>

                  <label
                    htmlFor="phone"
                    className={
                      labelClass
                    }
                  >
                    Phone / WhatsApp
                  </label>

                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    className={
                      inputClass
                    }
                  />

                </div>

              </div>

            </section>

            {/* =================================
                FIGHTER PROFILE
                ================================= */}
            <section className="border border-[#e5e0d8] bg-[#f7f4ef] p-6 sm:p-8">

              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#941f25]">
                Section 3
              </p>

              <h2 className={`mt-3 ${sectionTitleClass}`}>
                Professional Fighter Profile
              </h2>

              <div className="mt-5 h-1 w-16 bg-[#c6a24a]" />

              <div className="mt-8 grid gap-6 sm:grid-cols-2">

                <div>

                  <label
                    htmlFor="division"
                    className={
                      labelClass
                    }
                  >
                    Weight Division
                  </label>

                  <select
                    id="division"
                    name="division"
                    defaultValue=""
                    className={
                      inputClass
                    }
                  >

                    <option value="">
                      {loadingDivisions
                        ? "Loading Divisions..."
                        : "Select Division"}
                    </option>

                    {divisions.map(
                      (
                        division
                      ) => (

                        <option
                          key={
                            division.id
                          }
                          value={
                            division.name
                          }
                        >
                          {
                            division.name
                          }
                        </option>

                      )
                    )}

                  </select>

                </div>

                <div>

                  <label
                    htmlFor="boxer_level"
                    className={
                      labelClass
                    }
                  >
                    Boxer Level
                  </label>

                  <select
                    id="boxer_level"
                    name="boxer_level"
                    defaultValue=""
                    className={
                      inputClass
                    }
                  >

                    <option value="">
                      Select Boxer Level
                    </option>

                    <option value="Professional">
                      Professional
                    </option>

                    <option value="Debut">
                      Professional Debut
                    </option>

                    <option value="Amateur Transition">
                      Amateur Transition
                    </option>

                  </select>

                </div>

                <div>

                  <label
                    htmlFor="stance"
                    className={
                      labelClass
                    }
                  >
                    Stance
                  </label>

                  <select
                    id="stance"
                    name="stance"
                    defaultValue=""
                    className={
                      inputClass
                    }
                  >

                    <option value="">
                      Select Stance
                    </option>

                    <option value="Orthodox">
                      Orthodox
                    </option>

                    <option value="Southpaw">
                      Southpaw
                    </option>

                    <option value="Switch">
                      Switch
                    </option>

                  </select>

                </div>

                <div>

                  <label
                    htmlFor="debut_date"
                    className={
                      labelClass
                    }
                  >
                    Professional Debut Date
                  </label>

                  <input
                    id="debut_date"
                    name="debut_date"
                    type="date"
                    className={
                      inputClass
                    }
                  />

                </div>

                <div>

                  <label
                    htmlFor="career_start_year"
                    className={
                      labelClass
                    }
                  >
                    Career Start Year
                  </label>

                  <input
                    id="career_start_year"
                    name="career_start_year"
                    type="number"
                    min="1900"
                    max="2100"
                    className={
                      inputClass
                    }
                  />

                </div>

                <div>

                  <label
                    htmlFor="career_end_year"
                    className={
                      labelClass
                    }
                  >
                    Career End Year
                  </label>

                  <input
                    id="career_end_year"
                    name="career_end_year"
                    type="number"
                    min="1900"
                    max="2100"
                    className={
                      inputClass
                    }
                  />

                </div>

                <div>

                  <label
                    htmlFor="gym"
                    className={
                      labelClass
                    }
                  >
                    Gym
                  </label>

                  <input
                    id="gym"
                    name="gym"
                    type="text"
                    className={
                      inputClass
                    }
                  />

                </div>

                <div>

                  <label
                    htmlFor="trainer"
                    className={
                      labelClass
                    }
                  >
                    Trainer
                  </label>

                  <input
                    id="trainer"
                    name="trainer"
                    type="text"
                    className={
                      inputClass
                    }
                  />

                </div>

              </div>

            </section>

            {/* =================================
                PROFESSIONAL RECORD
                ================================= */}
            <section className="border border-[#e5e0d8] bg-white p-6 sm:p-8">

              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#941f25]">
                Section 4
              </p>

              <h2 className={`mt-3 ${sectionTitleClass}`}>
                Professional Record
              </h2>

              <div className="mt-5 h-1 w-16 bg-[#c6a24a]" />

              <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

                <div>

                  <label
                    htmlFor="wins"
                    className={
                      labelClass
                    }
                  >
                    Wins
                  </label>

                  <input
                    id="wins"
                    name="wins"
                    type="number"
                    min="0"
                    defaultValue="0"
                    className={
                      inputClass
                    }
                  />

                </div>

                <div>

                  <label
                    htmlFor="losses"
                    className={
                      labelClass
                    }
                  >
                    Losses
                  </label>

                  <input
                    id="losses"
                    name="losses"
                    type="number"
                    min="0"
                    defaultValue="0"
                    className={
                      inputClass
                    }
                  />

                </div>

                <div>

                  <label
                    htmlFor="draws"
                    className={
                      labelClass
                    }
                  >
                    Draws
                  </label>

                  <input
                    id="draws"
                    name="draws"
                    type="number"
                    min="0"
                    defaultValue="0"
                    className={
                      inputClass
                    }
                  />

                </div>

                <div>

                  <label
                    htmlFor="knockouts"
                    className={
                      labelClass
                    }
                  >
                    KO Wins
                  </label>

                  <input
                    id="knockouts"
                    name="knockouts"
                    type="number"
                    min="0"
                    defaultValue="0"
                    className={
                      inputClass
                    }
                  />

                </div>

                <div>

                  <label
                    htmlFor="knockout_losses"
                    className={
                      labelClass
                    }
                  >
                    KO Losses
                  </label>

                  <input
                    id="knockout_losses"
                    name="knockout_losses"
                    type="number"
                    min="0"
                    defaultValue="0"
                    className={
                      inputClass
                    }
                  />

                </div>

                <div>

                  <label
                    htmlFor="bouts"
                    className={
                      labelClass
                    }
                  >
                    Total Bouts
                  </label>

                  <input
                    id="bouts"
                    name="bouts"
                    type="number"
                    min="0"
                    className={
                      inputClass
                    }
                  />

                </div>

                <div>

                  <label
                    htmlFor="rounds"
                    className={
                      labelClass
                    }
                  >
                    Total Rounds
                  </label>

                  <input
                    id="rounds"
                    name="rounds"
                    type="number"
                    min="0"
                    className={
                      inputClass
                    }
                  />

                </div>

              </div>

            </section>

            {/* =================================
                BOXREC
                ================================= */}
            <section className="border border-[#e5e0d8] bg-[#f7f4ef] p-6 sm:p-8">

              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#941f25]">
                Section 5
              </p>

              <h2 className={`mt-3 ${sectionTitleClass}`}>
                BoxRec Information
              </h2>

              <div className="mt-5 h-1 w-16 bg-[#c6a24a]" />

              <p className="mt-5 max-w-3xl leading-7 text-[#625d56]">
                If you have a BoxRec profile, provide
                the information below. Leave these
                fields blank if they do not apply.
              </p>

              <div className="mt-8 grid gap-6 sm:grid-cols-3">

                <div>

                  <label
                    htmlFor="boxrec_id"
                    className={
                      labelClass
                    }
                  >
                    BoxRec ID
                  </label>

                  <input
                    id="boxrec_id"
                    name="boxrec_id"
                    type="text"
                    className={
                      inputClass
                    }
                  />

                </div>

                <div>

                  <label
                    htmlFor="boxrec_world_rank"
                    className={
                      labelClass
                    }
                  >
                    World Rank
                  </label>

                  <input
                    id="boxrec_world_rank"
                    name="boxrec_world_rank"
                    type="number"
                    min="1"
                    className={
                      inputClass
                    }
                  />

                </div>

                <div>

                  <label
                    htmlFor="boxrec_country_rank"
                    className={
                      labelClass
                    }
                  >
                    Country Rank
                  </label>

                  <input
                    id="boxrec_country_rank"
                    name="boxrec_country_rank"
                    type="number"
                    min="1"
                    className={
                      inputClass
                    }
                  />

                </div>

              </div>

            </section>

            {/* =================================
                SOCIAL MEDIA
                ================================= */}
            <section className="border border-[#e5e0d8] bg-white p-6 sm:p-8">

              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#941f25]">
                Section 6
              </p>

              <h2 className={`mt-3 ${sectionTitleClass}`}>
                Social Media
              </h2>

              <div className="mt-5 h-1 w-16 bg-[#c6a24a]" />

              <div className="mt-8 grid gap-6 sm:grid-cols-2">

                <div>

                  <label
                    htmlFor="instagram_url"
                    className={
                      labelClass
                    }
                  >
                    Instagram URL
                  </label>

                  <input
                    id="instagram_url"
                    name="instagram_url"
                    type="url"
                    placeholder="https://instagram.com/..."
                    className={
                      inputClass
                    }
                  />

                </div>

                <div>

                  <label
                    htmlFor="facebook_url"
                    className={
                      labelClass
                    }
                  >
                    Facebook URL
                  </label>

                  <input
                    id="facebook_url"
                    name="facebook_url"
                    type="url"
                    placeholder="https://facebook.com/..."
                    className={
                      inputClass
                    }
                  />

                </div>

              </div>

            </section>

            {/* =================================
                CAREER & WHY HBE
                ================================= */}
            <section className="border border-[#e5e0d8] bg-[#f7f4ef] p-6 sm:p-8">

              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#941f25]">
                Section 7
              </p>

              <h2 className={`mt-3 ${sectionTitleClass}`}>
                Boxing Career & HBE
              </h2>

              <div className="mt-5 h-1 w-16 bg-[#c6a24a]" />

              <div className="mt-8 space-y-6">

                <div>

                  <label
                    htmlFor="boxing_bio"
                    className={
                      labelClass
                    }
                  >
                    Boxing Career / Biography
                  </label>

                  <textarea
                    id="boxing_bio"
                    name="boxing_bio"
                    rows={7}
                    placeholder="Tell HBE about your boxing career, accomplishments, championships, amateur experience and professional goals."
                    className={`${inputClass} resize-none leading-7`}
                  />

                </div>

                <div>

                  <label
                    htmlFor="why_hbe"
                    className={
                      labelClass
                    }
                  >
                    Why Do You Want To Join HBE?
                  </label>

                  <textarea
                    id="why_hbe"
                    name="why_hbe"
                    rows={6}
                    placeholder="Tell us why you would like to become part of Heritage Boxing Entertainment."
                    className={`${inputClass} resize-none leading-7`}
                  />

                </div>

              </div>

            </section>

            {/* =================================
                FIGHTER PHOTO
                ================================= */}
            <section className="border border-[#e5e0d8] bg-white p-6 sm:p-8">

              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#941f25]">
                Section 8
              </p>

              <h2 className={`mt-3 ${sectionTitleClass}`}>
                Fighter Photo
              </h2>

              <div className="mt-5 h-1 w-16 bg-[#c6a24a]" />

              <p className="mt-5 max-w-3xl leading-7 text-[#625d56]">
                Upload a clear current photo of the
                fighter. JPG, PNG and WEBP images are
                accepted up to 10 MB.
              </p>

              <div className="mt-7">

                <label
                  htmlFor="photo"
                  className={
                    labelClass
                  }
                >
                  Fighter Photo
                </label>

                <input
                  id="photo"
                  name="photo"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(
                    event
                  ) =>
                    setPhotoFile(
                      event.target
                        .files?.[0] ||
                        null
                    )
                  }
                  className="mt-2 block w-full border border-[#d8d2ca] bg-[#f7f4ef] px-4 py-4 text-sm file:mr-4 file:border-0 file:bg-[#171717] file:px-4 file:py-2 file:text-xs file:font-black file:uppercase file:text-white"
                />

                {photoFile && (

                  <p className="mt-3 text-sm font-semibold text-[#625d56]">
                    Selected:{" "}
                    {
                      photoFile.name
                    }
                  </p>

                )}

              </div>

            </section>

            {/* =================================
                DECLARATION
                ================================= */}
            <section className="border border-[#c6a24a] bg-[#fffaf0] p-6 sm:p-8">

              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#941f25]">
                Declaration
              </p>

              <label className="mt-5 flex items-start gap-4">

                <input
                  type="checkbox"
                  required
                  className="mt-1 h-5 w-5 shrink-0 accent-[#941f25]"
                />

                <span className="leading-7 text-[#5f5b55]">
                  I confirm that the information
                  provided in this application is
                  accurate to the best of my
                  knowledge, and I understand that
                  submission does not guarantee
                  acceptance by Heritage Boxing
                  Entertainment.
                </span>

              </label>

            </section>

            {/* =================================
                SUBMIT
                ================================= */}
            <div className="border-t border-[#e5e0d8] pt-8">

              <button
                type="submit"
                disabled={
                  submitting
                }
                className="inline-flex min-h-[56px] w-full items-center justify-center bg-[#941f25] px-8 py-4 text-sm font-black uppercase tracking-wide text-white transition hover:bg-[#74181d] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                {submitting
                  ? "Submitting Application..."
                  : "Submit Boxer Application"}
              </button>

              <p className="mt-5 max-w-3xl text-sm leading-7 text-[#817a73]">
                Your application will be sent
                directly to the HBE administration
                team for review.
              </p>

            </div>

          </form>

        </div>

      </section>

    </main>
  );
}