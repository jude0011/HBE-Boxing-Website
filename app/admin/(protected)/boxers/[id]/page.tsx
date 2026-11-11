"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import type {
  ChangeEvent,
  FormEvent,
} from "react";

import {
  useParams,
  useRouter,
} from "next/navigation";

import { createClient } from "@/app/lib/supabase/client";

type Division = {
  id: string;
  name: string;
};

type Boxer = {
  id: string;

  first_name: string | null;
  last_name: string | null;
  nickname: string | null;

  profile_slug: string | null;
  photo_url: string | null;

  division_id: string | null;
  nationality_code: string | null;

  hometown: string | null;
  state_region: string | null;
  career_highlights: string | null;
  active: boolean | null;

  birth_name: string | null;
  date_of_birth: string | null;
  gender: string | null;

  residence: string | null;
  birthplace: string | null;

  career_start_year: number | null;
  career_end_year: number | null;
  debut_date: string | null;

  facebook_url: string | null;
  instagram_url: string | null;

  wins: number | null;
  losses: number | null;
  draws: number | null;

  knockout_wins: number | null;
  knockout_losses: number | null;

  bouts: number | null;
  rounds: number | null;
  ko_percentage: number | null;

  stance: string | null;

  boxrec_id: string | null;
  boxrec_rating_stars: number | null;

  boxrec_world_rank: number | null;
  boxrec_world_total: number | null;

  boxrec_country_rank: number | null;
  boxrec_country_total: number | null;
};

export default function EditBoxerPage() {
  const params = useParams();
  const router = useRouter();

  const supabase = useMemo(
    () => createClient(),
    []
  );

  const boxerId =
    typeof params.id === "string"
      ? params.id
      : "";

  const [
    divisions,
    setDivisions,
  ] = useState<Division[]>([]);

  const [
    isSuperAdmin,
    setIsSuperAdmin,
  ] = useState(false);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    uploadingPhoto,
    setUploadingPhoto,
  ] = useState(false);

  const [
    deleting,
    setDeleting,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const [
    message,
    setMessage,
  ] = useState("");

  /*
    BASIC
  */
  const [
    firstName,
    setFirstName,
  ] = useState("");

  const [
    lastName,
    setLastName,
  ] = useState("");

  const [
    nickname,
    setNickname,
  ] = useState("");

  const [
    profileSlug,
    setProfileSlug,
  ] = useState("");

  const [
    photoUrl,
    setPhotoUrl,
  ] = useState("");

  const [
    divisionId,
    setDivisionId,
  ] = useState("");

  const [
    nationalityCode,
    setNationalityCode,
  ] = useState("NG");

  const [
    active,
    setActive,
  ] = useState(true);

  /*
    LOCATION
  */
  const [
    hometown,
    setHometown,
  ] = useState("");

  const [
    stateRegion,
    setStateRegion,
  ] = useState("");

  /*
    PERSONAL
  */
  const [
    birthName,
    setBirthName,
  ] = useState("");

  const [
    dateOfBirth,
    setDateOfBirth,
  ] = useState("");

  const [
    gender,
    setGender,
  ] = useState("");

  const [
    residence,
    setResidence,
  ] = useState("");

  const [
    birthplace,
    setBirthplace,
  ] = useState("");

  const [
    careerStartYear,
    setCareerStartYear,
  ] = useState("");

  const [
    careerEndYear,
    setCareerEndYear,
  ] = useState("");

  const [
    debutDate,
    setDebutDate,
  ] = useState("");

  const [
    careerHighlights,
    setCareerHighlights,
  ] = useState("");

  /*
    SOCIAL
  */
  const [
    facebookUrl,
    setFacebookUrl,
  ] = useState("");

  const [
    instagramUrl,
    setInstagramUrl,
  ] = useState("");

  /*
    RECORD
  */
  const [wins, setWins] =
    useState("0");

  const [losses, setLosses] =
    useState("0");

  const [draws, setDraws] =
    useState("0");

  const [
    knockoutWins,
    setKnockoutWins,
  ] = useState("0");

  const [
    knockoutLosses,
    setKnockoutLosses,
  ] = useState("0");

  const [bouts, setBouts] =
    useState("0");

  const [rounds, setRounds] =
    useState("0");

  const [
    koPercentage,
    setKoPercentage,
  ] = useState("0");

  const [stance, setStance] =
    useState("Orthodox");

  /*
    BOXREC
  */
  const [
    boxrecId,
    setBoxrecId,
  ] = useState("");

  const [
    boxrecRatingStars,
    setBoxrecRatingStars,
  ] = useState("0");

  const [
    boxrecWorldRank,
    setBoxrecWorldRank,
  ] = useState("");

  const [
    boxrecWorldTotal,
    setBoxrecWorldTotal,
  ] = useState("");

  const [
    boxrecCountryRank,
    setBoxrecCountryRank,
  ] = useState("");

  const [
    boxrecCountryTotal,
    setBoxrecCountryTotal,
  ] = useState("");

  useEffect(() => {
    async function loadPage() {
      if (!boxerId) {
        setError(
          "Boxer ID not found."
        );

        setLoading(false);
        return;
      }

      const {
        data: { user },
      } =
        await supabase.auth.getUser();

      if (user) {
        const {
          data: adminData,
        } = await supabase
          .from("admin_users")
          .select("role")
          .eq("id", user.id)
          .single();

        setIsSuperAdmin(
          adminData?.role ===
            "super_admin"
        );
      }

      const [
        boxerResult,
        divisionResult,
      ] = await Promise.all([
        supabase
          .from("boxers")
          .select("*")
          .eq("id", boxerId)
          .single(),

        supabase
          .from("divisions")
          .select("id, name")
          .order("name"),
      ]);

      if (boxerResult.error) {
        setError(
          boxerResult.error.message
        );

        setLoading(false);
        return;
      }

      const boxer =
        boxerResult.data as Boxer;

      setDivisions(
        (divisionResult.data as Division[]) ||
          []
      );

      setFirstName(
        boxer.first_name || ""
      );

      setLastName(
        boxer.last_name || ""
      );

      setNickname(
        boxer.nickname || ""
      );

      setProfileSlug(
        boxer.profile_slug || ""
      );

      setPhotoUrl(
        boxer.photo_url || ""
      );

      setDivisionId(
        boxer.division_id || ""
      );

      setNationalityCode(
        boxer.nationality_code || "NG"
      );

      setActive(
        boxer.active ?? true
      );

      setHometown(
        boxer.hometown || ""
      );

      setStateRegion(
        boxer.state_region || ""
      );

      setBirthName(
        boxer.birth_name || ""
      );

      setDateOfBirth(
        boxer.date_of_birth || ""
      );

      setGender(
        boxer.gender || ""
      );

      setResidence(
        boxer.residence || ""
      );

      setBirthplace(
        boxer.birthplace || ""
      );

      setCareerStartYear(
        boxer.career_start_year !== null
          ? String(
              boxer.career_start_year
            )
          : ""
      );

      setCareerEndYear(
        boxer.career_end_year !== null
          ? String(
              boxer.career_end_year
            )
          : ""
      );

      setDebutDate(
        boxer.debut_date || ""
      );

      setCareerHighlights(
        boxer.career_highlights || ""
      );

      setFacebookUrl(
        boxer.facebook_url || ""
      );

      setInstagramUrl(
        boxer.instagram_url || ""
      );

      setWins(
        String(boxer.wins ?? 0)
      );

      setLosses(
        String(boxer.losses ?? 0)
      );

      setDraws(
        String(boxer.draws ?? 0)
      );

      setKnockoutWins(
        String(
          boxer.knockout_wins ?? 0
        )
      );

      setKnockoutLosses(
        String(
          boxer.knockout_losses ?? 0
        )
      );

      setBouts(
        String(boxer.bouts ?? 0)
      );

      setRounds(
        String(boxer.rounds ?? 0)
      );

      setKoPercentage(
        String(
          boxer.ko_percentage ?? 0
        )
      );

      setStance(
        boxer.stance || "Orthodox"
      );

      setBoxrecId(
        boxer.boxrec_id || ""
      );

      setBoxrecRatingStars(
        String(
          boxer.boxrec_rating_stars ??
            0
        )
      );

      setBoxrecWorldRank(
        boxer.boxrec_world_rank !== null
          ? String(
              boxer.boxrec_world_rank
            )
          : ""
      );

      setBoxrecWorldTotal(
        boxer.boxrec_world_total !== null
          ? String(
              boxer.boxrec_world_total
            )
          : ""
      );

      setBoxrecCountryRank(
        boxer.boxrec_country_rank !== null
          ? String(
              boxer.boxrec_country_rank
            )
          : ""
      );

      setBoxrecCountryTotal(
        boxer.boxrec_country_total !== null
          ? String(
              boxer.boxrec_country_total
            )
          : ""
      );

      setLoading(false);
    }

    void loadPage();
  }, [
    boxerId,
    supabase,
  ]);

  function generateSlug() {
    setProfileSlug(
      `${firstName}-${lastName}`
        .toLowerCase()
        .trim()
        .replace(
          /[^a-z0-9]+/g,
          "-"
        )
        .replace(
          /^-|-$/g,
          ""
        )
    );
  }

  function getStoragePathFromUrl(
    url: string
  ) {
    const marker =
      "/storage/v1/object/public/boxers/";

    const index =
      url.indexOf(marker);

    if (index === -1) {
      return null;
    }

    return decodeURIComponent(
      url.substring(
        index + marker.length
      )
    );
  }

  async function uploadPhoto(
    file: File
  ) {
    setError("");
    setMessage("");

    if (
      !file.type.startsWith(
        "image/"
      )
    ) {
      setError(
        "Please select an image file."
      );
      return;
    }

    if (
      file.size >
      5 * 1024 * 1024
    ) {
      setError(
        "The boxer photo must be 5 MB or smaller."
      );
      return;
    }

    setUploadingPhoto(true);

    const extension =
      file.name
        .split(".")
        .pop()
        ?.toLowerCase() ||
      "jpg";

    const safeName =
      `${firstName}-${lastName}`
        .toLowerCase()
        .trim()
        .replace(
          /[^a-z0-9]+/g,
          "-"
        )
        .replace(
          /^-|-$/g,
          ""
        ) || "boxer";

    const filePath =
      `${boxerId}/${safeName}-${Date.now()}.${extension}`;

    const {
      error: uploadError,
    } = await supabase.storage
      .from("boxers")
      .upload(
        filePath,
        file,
        {
          cacheControl:
            "3600",
          upsert: false,
        }
      );

    if (uploadError) {
      setError(
        uploadError.message
      );

      setUploadingPhoto(false);
      return;
    }

    const {
      data: publicUrlData,
    } = supabase.storage
      .from("boxers")
      .getPublicUrl(
        filePath
      );

    setPhotoUrl(
      publicUrlData.publicUrl
    );

    setMessage(
      "Photo uploaded. Click Save Changes to update the boxer profile."
    );

    setUploadingPhoto(false);
  }

  async function handlePhotoChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    await uploadPhoto(file);

    event.target.value = "";
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setSaving(true);
    setError("");
    setMessage("");

    const {
      error: updateError,
    } = await supabase
      .from("boxers")
      .update({
        first_name:
          firstName.trim(),

        last_name:
          lastName.trim(),

        nickname:
          nickname.trim() ||
          null,

        profile_slug:
          profileSlug.trim(),

        photo_url:
          photoUrl.trim() ||
          null,

        division_id:
          divisionId ||
          null,

        nationality_code:
          nationalityCode
            .trim()
            .toUpperCase(),

        active,

        hometown:
          hometown.trim() ||
          null,

        state_region:
          stateRegion.trim() ||
          null,

        birth_name:
          birthName.trim() ||
          null,

        date_of_birth:
          dateOfBirth ||
          null,

        gender:
          gender ||
          null,

        residence:
          residence.trim() ||
          null,

        birthplace:
          birthplace.trim() ||
          null,

        career_start_year:
          careerStartYear
            ? Number(
                careerStartYear
              )
            : null,

        career_end_year:
          careerEndYear
            ? Number(
                careerEndYear
              )
            : null,

        debut_date:
          debutDate ||
          null,

        career_highlights:
          careerHighlights.trim() ||
          null,

        facebook_url:
          facebookUrl.trim() ||
          null,

        instagram_url:
          instagramUrl.trim() ||
          null,

        wins:
          Number(wins),

        losses:
          Number(losses),

        draws:
          Number(draws),

        knockout_wins:
          Number(
            knockoutWins
          ),

        knockout_losses:
          Number(
            knockoutLosses
          ),

        bouts:
          Number(bouts),

        rounds:
          Number(rounds),

        ko_percentage:
          Number(
            koPercentage
          ),

        stance:
          stance ||
          null,

        boxrec_id:
          boxrecId.trim() ||
          null,

        boxrec_rating_stars:
          Number(
            boxrecRatingStars
          ),

        boxrec_world_rank:
          boxrecWorldRank
            ? Number(
                boxrecWorldRank
              )
            : null,

        boxrec_world_total:
          boxrecWorldTotal
            ? Number(
                boxrecWorldTotal
              )
            : null,

        boxrec_country_rank:
          boxrecCountryRank
            ? Number(
                boxrecCountryRank
              )
            : null,

        boxrec_country_total:
          boxrecCountryTotal
            ? Number(
                boxrecCountryTotal
              )
            : null,

        boxrec_last_checked:
          boxrecId
            ? new Date()
                .toISOString()
                .slice(0, 10)
            : null,
      })
      .eq(
        "id",
        boxerId
      );

    if (updateError) {
      setError(
        updateError.message
      );

      setSaving(false);
      return;
    }

    router.push(
      "/admin/boxers"
    );

    router.refresh();
  }

  async function deleteBoxer() {
    if (!isSuperAdmin) {
      return;
    }

    const name =
      `${firstName} ${lastName}`.trim();

    if (
      !window.confirm(
        `PERMANENTLY delete "${name}"?`
      )
    ) {
      return;
    }

    if (
      !window.confirm(
        `Final confirmation: permanently delete ${name}?`
      )
    ) {
      return;
    }

    setDeleting(true);

    const existingPhoto =
      photoUrl;

    const {
      error: deleteError,
    } = await supabase
      .from("boxers")
      .delete()
      .eq(
        "id",
        boxerId
      );

    if (deleteError) {
      setError(
        deleteError.message
      );

      setDeleting(false);
      return;
    }

    if (existingPhoto) {
      const path =
        getStoragePathFromUrl(
          existingPhoto
        );

      if (path) {
        await supabase.storage
          .from("boxers")
          .remove([path]);
      }
    }

    router.push(
      "/admin/boxers"
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
        <p className="font-black uppercase">
          Loading Boxer...
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl p-5 sm:p-8 lg:p-10">

      <p className="text-xs font-black uppercase tracking-[0.25em] text-[#941f25]">
        Fighter Management
      </p>

      <h1 className="mt-3 text-3xl font-black uppercase sm:text-4xl">
        Edit Boxer
      </h1>

      <div className="mt-5 h-1 w-16 bg-[#c6a24a]" />

      {message && (
        <div className="mt-6 border border-green-200 bg-green-50 p-4 text-sm font-semibold text-green-700">
          {message}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-8"
      >

        {/* BASIC */}
        <section className="border border-[#e2ddd5] bg-white p-6 sm:p-8">

          <h2 className="text-xl font-black uppercase">
            Fighter Information
          </h2>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">

            <div>
              <label className={labelClass}>
                First Name
              </label>

              <input
                required
                value={firstName}
                onChange={(e) =>
                  setFirstName(
                    e.target.value
                  )
                }
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                Last Name
              </label>

              <input
                required
                value={lastName}
                onChange={(e) =>
                  setLastName(
                    e.target.value
                  )
                }
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                Nickname
              </label>

              <input
                value={nickname}
                onChange={(e) =>
                  setNickname(
                    e.target.value
                  )
                }
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                Division
              </label>

              <select
                value={divisionId}
                onChange={(e) =>
                  setDivisionId(
                    e.target.value
                  )
                }
                className={inputClass}
              >
                <option value="">
                  Select Division
                </option>

                {divisions.map(
                  (division) => (
                    <option
                      key={division.id}
                      value={division.id}
                    >
                      {division.name}
                    </option>
                  )
                )}
              </select>
            </div>

            <div>
              <label className={labelClass}>
                Nationality Code
              </label>

              <input
                value={
                  nationalityCode
                }
                onChange={(e) =>
                  setNationalityCode(
                    e.target.value
                  )
                }
                maxLength={2}
                placeholder="NG"
                className={inputClass}
              />
            </div>

            <div className="flex items-center gap-3 pt-7">
              <input
                id="active"
                type="checkbox"
                checked={active}
                onChange={(e) =>
                  setActive(
                    e.target.checked
                  )
                }
                className="h-5 w-5"
              />

              <label
                htmlFor="active"
                className={labelClass}
              >
                Active / Public Profile
              </label>
            </div>

          </div>

          <div className="mt-6">

            <label className={labelClass}>
              Profile Slug
            </label>

            <div className="mt-2 flex gap-3">

              <input
                required
                value={profileSlug}
                onChange={(e) =>
                  setProfileSlug(
                    e.target.value
                  )
                }
                className="w-full border border-[#d8d3cb] px-4 py-3"
              />

              <button
                type="button"
                onClick={generateSlug}
                className="bg-[#c6a24a] px-5 py-3 text-xs font-black uppercase"
              >
                Generate
              </button>

            </div>

          </div>

        </section>

        {/* PHOTO */}
        <section className="border border-[#e2ddd5] bg-white p-6 sm:p-8">

          <h2 className="text-xl font-black uppercase">
            Boxer Photo
          </h2>

          <div className="mt-6 grid gap-6 md:grid-cols-[220px_1fr]">

            <div className="flex min-h-[260px] items-center justify-center overflow-hidden bg-[#f7f4ef]">

              {photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={photoUrl}
                  alt={`${firstName} ${lastName}`}
                  className="h-[260px] w-full object-cover"
                />
              ) : (
                <p>No Boxer Photo</p>
              )}

            </div>

            <div>

              <label className={labelClass}>
                Upload / Replace Photo
              </label>

              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={
                  handlePhotoChange
                }
                disabled={
                  uploadingPhoto
                }
                className={inputClass}
              />

              <div className="mt-5">

                <label className={labelClass}>
                  Photo URL
                </label>

                <input
                  value={photoUrl}
                  onChange={(e) =>
                    setPhotoUrl(
                      e.target.value
                    )
                  }
                  className={inputClass}
                />

              </div>

            </div>

          </div>

        </section>

        {/* PERSONAL */}
        <section className="border border-[#e2ddd5] bg-white p-6 sm:p-8">

          <h2 className="text-xl font-black uppercase">
            Personal & Career Details
          </h2>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">

            <div>
              <label className={labelClass}>
                Birth Name
              </label>

              <input
                value={birthName}
                onChange={(e) =>
                  setBirthName(
                    e.target.value
                  )
                }
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                Date of Birth
              </label>

              <input
                type="date"
                value={dateOfBirth}
                onChange={(e) =>
                  setDateOfBirth(
                    e.target.value
                  )
                }
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                Gender
              </label>

              <select
                value={gender}
                onChange={(e) =>
                  setGender(
                    e.target.value
                  )
                }
                className={inputClass}
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
              <label className={labelClass}>
                Hometown
              </label>

              <input
                value={hometown}
                onChange={(e) =>
                  setHometown(
                    e.target.value
                  )
                }
                placeholder="London"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                State / Region
              </label>

              <input
                value={stateRegion}
                onChange={(e) =>
                  setStateRegion(
                    e.target.value
                  )
                }
                placeholder="England"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                Residence
              </label>

              <input
                value={residence}
                onChange={(e) =>
                  setResidence(
                    e.target.value
                  )
                }
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                Birthplace
              </label>

              <input
                value={birthplace}
                onChange={(e) =>
                  setBirthplace(
                    e.target.value
                  )
                }
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                Professional Debut
              </label>

              <input
                type="date"
                value={debutDate}
                onChange={(e) =>
                  setDebutDate(
                    e.target.value
                  )
                }
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                Career Start Year
              </label>

              <input
                type="number"
                value={careerStartYear}
                onChange={(e) =>
                  setCareerStartYear(
                    e.target.value
                  )
                }
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                Career End Year
              </label>

              <input
                type="number"
                value={careerEndYear}
                onChange={(e) =>
                  setCareerEndYear(
                    e.target.value
                  )
                }
                placeholder="Blank if active"
                className={inputClass}
              />
            </div>

          </div>

          <div className="mt-6">

            <label className={labelClass}>
              Career Highlights
            </label>

            <textarea
              rows={6}
              value={careerHighlights}
              onChange={(e) =>
                setCareerHighlights(
                  e.target.value
                )
              }
              placeholder="Championships, major wins, career achievements..."
              className={inputClass}
            />

          </div>

        </section>

        {/* SOCIAL */}
        <section className="border border-[#e2ddd5] bg-white p-6 sm:p-8">

          <h2 className="text-xl font-black uppercase">
            Fighter Social Handles
          </h2>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">

            <div>
              <label className={labelClass}>
                Facebook URL
              </label>

              <input
                type="url"
                value={facebookUrl}
                onChange={(e) =>
                  setFacebookUrl(
                    e.target.value
                  )
                }
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                Instagram URL
              </label>

              <input
                type="url"
                value={instagramUrl}
                onChange={(e) =>
                  setInstagramUrl(
                    e.target.value
                  )
                }
                className={inputClass}
              />
            </div>

          </div>

        </section>

        {/* RECORD */}
        <section className="border border-[#e2ddd5] bg-white p-6 sm:p-8">

          <h2 className="text-xl font-black uppercase">
            Professional Record
          </h2>

          <div className="mt-6 grid gap-5 sm:grid-cols-3">

            {[
              ["Wins", wins, setWins],
              ["Losses", losses, setLosses],
              ["Draws", draws, setDraws],
              [
                "KO Wins",
                knockoutWins,
                setKnockoutWins,
              ],
              [
                "KO Losses",
                knockoutLosses,
                setKnockoutLosses,
              ],
              ["Bouts", bouts, setBouts],
              ["Rounds", rounds, setRounds],
              [
                "KO %",
                koPercentage,
                setKoPercentage,
              ],
            ].map(
              ([label, value, setter]) => (
                <div key={String(label)}>
                  <label className={labelClass}>
                    {String(label)}
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={String(value)}
                    onChange={(e) =>
                      (
                        setter as React.Dispatch<
                          React.SetStateAction<string>
                        >
                      )(
                        e.target.value
                      )
                    }
                    className={inputClass}
                  />
                </div>
              )
            )}

            <div>
              <label className={labelClass}>
                Stance
              </label>

              <select
                value={stance}
                onChange={(e) =>
                  setStance(
                    e.target.value
                  )
                }
                className={inputClass}
              >
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

          </div>

        </section>

        {/* BOXREC */}
        <section className="border border-[#e2ddd5] bg-white p-6 sm:p-8">

          <h2 className="text-xl font-black uppercase">
            BoxRec Information
          </h2>

          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

            <div>
              <label className={labelClass}>
                BoxRec ID
              </label>
              <input
                value={boxrecId}
                onChange={(e) =>
                  setBoxrecId(
                    e.target.value
                  )
                }
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                Star Rating
              </label>
              <input
                type="number"
                step="0.5"
                value={boxrecRatingStars}
                onChange={(e) =>
                  setBoxrecRatingStars(
                    e.target.value
                  )
                }
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                World Rank
              </label>
              <input
                type="number"
                value={boxrecWorldRank}
                onChange={(e) =>
                  setBoxrecWorldRank(
                    e.target.value
                  )
                }
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                World Total
              </label>
              <input
                type="number"
                value={boxrecWorldTotal}
                onChange={(e) =>
                  setBoxrecWorldTotal(
                    e.target.value
                  )
                }
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                National Rank
              </label>
              <input
                type="number"
                value={boxrecCountryRank}
                onChange={(e) =>
                  setBoxrecCountryRank(
                    e.target.value
                  )
                }
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                National Total
              </label>
              <input
                type="number"
                value={boxrecCountryTotal}
                onChange={(e) =>
                  setBoxrecCountryTotal(
                    e.target.value
                  )
                }
                className={inputClass}
              />
            </div>

          </div>

        </section>

        {error && (
          <div className="border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        <div className="flex gap-3">

          <button
            type="submit"
            disabled={saving}
            className="bg-[#941f25] px-7 py-4 text-sm font-black uppercase text-white"
          >
            {saving
              ? "Saving..."
              : "Save Changes"}
          </button>

          <button
            type="button"
            onClick={() =>
              router.push(
                "/admin/boxers"
              )
            }
            className="border px-7 py-4 text-sm font-black uppercase"
          >
            Cancel
          </button>

        </div>

      </form>

      {isSuperAdmin && (
        <section className="mt-10 border border-red-200 bg-red-50 p-6">

          <h2 className="font-black uppercase">
            Permanent Delete Boxer
          </h2>

          <button
            type="button"
            onClick={
              deleteBoxer
            }
            disabled={deleting}
            className="mt-5 border border-red-300 bg-red-100 px-7 py-4 font-black uppercase text-red-700"
          >
            {deleting
              ? "Deleting..."
              : "Permanent Delete Boxer"}
          </button>

        </section>
      )}

    </main>
  );
}