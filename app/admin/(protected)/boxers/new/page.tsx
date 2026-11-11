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

import { useRouter } from "next/navigation";

import { createClient } from "@/app/lib/supabase/client";

type Division = {
  id: string;
  name: string;
};

export default function NewBoxerPage() {
  const router = useRouter();

  const supabase = useMemo(
    () => createClient(),
    []
  );

  const [
    divisions,
    setDivisions,
  ] = useState<Division[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

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

  const [
    hometown,
    setHometown,
  ] = useState("");

  const [
    stateRegion,
    setStateRegion,
  ] = useState("");

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

  const [
    facebookUrl,
    setFacebookUrl,
  ] = useState("");

  const [
    instagramUrl,
    setInstagramUrl,
  ] = useState("");

  const [
    photoFile,
    setPhotoFile,
  ] = useState<File | null>(
    null
  );

  const [
    photoPreview,
    setPhotoPreview,
  ] = useState("");

  const [
    manualPhotoUrl,
    setManualPhotoUrl,
  ] = useState("");

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
    async function loadDivisions() {
      const {
        data,
        error:
          divisionError,
      } = await supabase
        .from("divisions")
        .select("id, name")
        .order("name");

      if (divisionError) {
        setError(
          divisionError.message
        );
      }

      setDivisions(
        (data as Division[]) ||
          []
      );

      setLoading(false);
    }

    void loadDivisions();
  }, [supabase]);

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

  function handlePhotoSelection(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file =
      event.target.files?.[0];

    if (!file) {
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

    setPhotoFile(file);

    setPhotoPreview(
      URL.createObjectURL(
        file
      )
    );
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setSaving(true);
    setError("");

    const {
      data: createdBoxer,
      error: insertError,
    } = await supabase
      .from("boxers")
      .insert({
        first_name:
          firstName.trim(),

        last_name:
          lastName.trim(),

        nickname:
          nickname.trim() ||
          null,

        profile_slug:
          profileSlug.trim(),

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

        photo_url:
          manualPhotoUrl.trim() ||
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
      .select("id")
      .single();

    if (
      insertError ||
      !createdBoxer
    ) {
      setError(
        insertError?.message ||
          "Unable to create boxer."
      );

      setSaving(false);
      return;
    }

    if (photoFile) {
      const extension =
        photoFile.name
          .split(".")
          .pop()
          ?.toLowerCase() ||
        "jpg";

      const safeName =
        `${firstName}-${lastName}`
          .toLowerCase()
          .replace(
            /[^a-z0-9]+/g,
            "-"
          );

      const filePath =
        `${createdBoxer.id}/${safeName}-${Date.now()}.${extension}`;

      const {
        error: uploadError,
      } =
        await supabase.storage
          .from("boxers")
          .upload(
            filePath,
            photoFile
          );

      if (!uploadError) {
        const {
          data:
            publicUrlData,
        } =
          supabase.storage
            .from("boxers")
            .getPublicUrl(
              filePath
            );

        await supabase
          .from("boxers")
          .update({
            photo_url:
              publicUrlData.publicUrl,
          })
          .eq(
            "id",
            createdBoxer.id
          );
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
      <main className="p-10">
        Loading...
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl p-5 sm:p-8 lg:p-10">

      <p className="text-xs font-black uppercase tracking-[0.25em] text-[#941f25]">
        Fighter Management
      </p>

      <h1 className="mt-3 text-3xl font-black uppercase">
        Add New Boxer
      </h1>

      <div className="mt-5 h-1 w-16 bg-[#c6a24a]" />

      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-8"
      >

        {/* BASIC */}
        <section className="border bg-white p-6 sm:p-8">

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
                value={nationalityCode}
                maxLength={2}
                onChange={(e) =>
                  setNationalityCode(
                    e.target.value
                  )
                }
                className={inputClass}
              />
            </div>

            <div className="flex items-center gap-3 pt-7">
              <input
                type="checkbox"
                checked={active}
                onChange={(e) =>
                  setActive(
                    e.target.checked
                  )
                }
                className="h-5 w-5"
              />

              <span className={labelClass}>
                Active / Public Profile
              </span>
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
                className="w-full border px-4 py-3"
              />

              <button
                type="button"
                onClick={generateSlug}
                className="bg-[#c6a24a] px-5 font-black uppercase"
              >
                Generate
              </button>
            </div>

          </div>

        </section>

        {/* PHOTO */}
        <section className="border bg-white p-6 sm:p-8">

          <h2 className="text-xl font-black uppercase">
            Boxer Photo
          </h2>

          <div className="mt-6 grid gap-6 md:grid-cols-[220px_1fr]">

            <div className="flex h-[260px] items-center justify-center overflow-hidden bg-[#f7f4ef]">

              {photoPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={photoPreview}
                  alt="Preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <p>No Boxer Photo</p>
              )}

            </div>

            <div>

              <label className={labelClass}>
                Upload Photo
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={
                  handlePhotoSelection
                }
                className={inputClass}
              />

              <div className="mt-5">
                <label className={labelClass}>
                  Photo URL
                </label>

                <input
                  value={manualPhotoUrl}
                  onChange={(e) =>
                    setManualPhotoUrl(
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
        <section className="border bg-white p-6 sm:p-8">

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
              className={inputClass}
            />

          </div>

        </section>

        {/* SOCIAL */}
        <section className="border bg-white p-6 sm:p-8">

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
        <section className="border bg-white p-6 sm:p-8">

          <h2 className="text-xl font-black uppercase">
            Professional Record
          </h2>

          <div className="mt-6 grid gap-5 sm:grid-cols-3">

            <div>
              <label className={labelClass}>Wins</label>
              <input type="number" value={wins} onChange={(e) => setWins(e.target.value)} className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Losses</label>
              <input type="number" value={losses} onChange={(e) => setLosses(e.target.value)} className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Draws</label>
              <input type="number" value={draws} onChange={(e) => setDraws(e.target.value)} className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>KO Wins</label>
              <input type="number" value={knockoutWins} onChange={(e) => setKnockoutWins(e.target.value)} className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>KO Losses</label>
              <input type="number" value={knockoutLosses} onChange={(e) => setKnockoutLosses(e.target.value)} className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Bouts</label>
              <input type="number" value={bouts} onChange={(e) => setBouts(e.target.value)} className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Rounds</label>
              <input type="number" value={rounds} onChange={(e) => setRounds(e.target.value)} className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>KO %</label>
              <input type="number" value={koPercentage} onChange={(e) => setKoPercentage(e.target.value)} className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Stance</label>
              <select value={stance} onChange={(e) => setStance(e.target.value)} className={inputClass}>
                <option value="Orthodox">Orthodox</option>
                <option value="Southpaw">Southpaw</option>
                <option value="Switch">Switch</option>
              </select>
            </div>

          </div>

        </section>

        {/* BOXREC */}
        <section className="border bg-white p-6 sm:p-8">

          <h2 className="text-xl font-black uppercase">
            BoxRec Information
          </h2>

          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

            <input placeholder="BoxRec ID" value={boxrecId} onChange={(e) => setBoxrecId(e.target.value)} className={inputClass} />

            <input placeholder="Star Rating" type="number" step="0.5" value={boxrecRatingStars} onChange={(e) => setBoxrecRatingStars(e.target.value)} className={inputClass} />

            <input placeholder="World Rank" type="number" value={boxrecWorldRank} onChange={(e) => setBoxrecWorldRank(e.target.value)} className={inputClass} />

            <input placeholder="World Total" type="number" value={boxrecWorldTotal} onChange={(e) => setBoxrecWorldTotal(e.target.value)} className={inputClass} />

            <input placeholder="National Rank" type="number" value={boxrecCountryRank} onChange={(e) => setBoxrecCountryRank(e.target.value)} className={inputClass} />

            <input placeholder="National Total" type="number" value={boxrecCountryTotal} onChange={(e) => setBoxrecCountryTotal(e.target.value)} className={inputClass} />

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
            className="bg-[#941f25] px-7 py-4 font-black uppercase text-white"
          >
            {saving
              ? "Creating Boxer..."
              : "Create Boxer"}
          </button>

          <button
            type="button"
            onClick={() =>
              router.push(
                "/admin/boxers"
              )
            }
            className="border px-7 py-4 font-black uppercase"
          >
            Cancel
          </button>

        </div>

      </form>

    </main>
  );
}