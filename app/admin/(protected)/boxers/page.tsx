import Image from "next/image";
import Link from "next/link";

import { createClient } from "@/app/lib/supabase/server";

export const dynamic = "force-dynamic";

type BoxerRow = {
  id: string;

  first_name?: string | null;
  last_name?: string | null;
  nickname?: string | null;

  profile_slug?: string | null;
  photo_url?: string | null;

  wins?: number | null;
  losses?: number | null;
  draws?: number | null;

  knockout_wins?: number | null;
  knockout_losses?: number | null;

  division_id?: string | null;

  nationality_code?: string | null;

  boxrec_world_rank?: number | null;
  boxrec_country_rank?: number | null;

  boxrec_rating_stars?: number | null;

  created_at?: string | null;
};

type DivisionRow = {
  id: string;
  name: string;
};

function countryFlag(
  code?: string | null
) {
  if (!code) {
    return "🌍";
  }

  return code
    .toUpperCase()
    .replace(
      /./g,
      (character) =>
        String.fromCodePoint(
          127397 +
            character.charCodeAt(0)
        )
    );
}

function formatDivision(
  division: string
) {
  const divisionBreaks: Record<
    string,
    [string, string]
  > = {
    Cruiserweight: [
      "Cruiser",
      "Weight",
    ],

    Featherweight: [
      "Feather",
      "Weight",
    ],

    Middleweight: [
      "Middle",
      "Weight",
    ],

    Heavyweight: [
      "Heavy",
      "Weight",
    ],

    "Light Heavyweight": [
      "Light",
      "Heavyweight",
    ],

    "Super Middleweight": [
      "Super",
      "Middleweight",
    ],

    "Super Welterweight": [
      "Super",
      "Welterweight",
    ],

    "Super Bantamweight": [
      "Super",
      "Bantamweight",
    ],

    "Super Lightweight": [
      "Super",
      "Lightweight",
    ],

    "Super Featherweight": [
      "Super",
      "Featherweight",
    ],

    "Super Flyweight": [
      "Super",
      "Flyweight",
    ],
  };

  const formatted =
    divisionBreaks[division];

  if (!formatted) {
    return <>{division}</>;
  }

  return (
    <>
      <span className="block">
        {formatted[0]}
      </span>

      <span className="block">
        {formatted[1]}
      </span>
    </>
  );
}

export default async function AdminBoxersPage() {
  const supabase =
    await createClient();

  /*
    GET BOXERS
  */
  const {
    data: boxerData,
    error: boxerError,
  } = await supabase
    .from("boxers")
    .select("*")
    .order("first_name", {
      ascending: true,
    });

  if (boxerError) {
    console.error(
      "Admin boxers error:",
      boxerError
    );
  }

  const boxers =
    (boxerData as BoxerRow[]) ||
    [];

  /*
    GET DIVISIONS
  */
  const {
    data: divisionData,
    error: divisionError,
  } = await supabase
    .from("divisions")
    .select("id, name");

  if (divisionError) {
    console.error(
      "Admin divisions error:",
      divisionError
    );
  }

  const divisions =
    (divisionData as DivisionRow[]) ||
    [];

  return (
    <main className="mx-auto w-full min-w-0 max-w-7xl p-4 sm:p-6 lg:p-10">

      {/* HEADER */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">

        <div>

          <p className="text-xs font-black uppercase tracking-[0.25em] text-[#941f25]">
            Fighter Management
          </p>

          <h1 className="mt-3 text-3xl font-black uppercase text-[#171717] sm:text-4xl">
            HBE Boxers
          </h1>

          <div className="mt-5 h-1 w-16 bg-[#c6a24a]" />

          <p className="mt-5 max-w-3xl leading-7 text-[#625d56]">
            Manage fighter profiles,
            records, photos, divisions
            and professional boxing
            information.
          </p>

        </div>

        <Link
          href="/admin/boxers/new"
          className="inline-flex items-center justify-center bg-[#941f25] px-6 py-4 text-sm font-black uppercase tracking-wide text-white transition hover:bg-[#74181d]"
        >
          + Add Boxer
        </Link>

      </div>

      {/* COUNT */}
      <div className="mt-8 border border-[#e2ddd5] bg-white p-5">

        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#8a847c]">
          Total Fighters
        </p>

        <p className="mt-1 text-3xl font-black text-[#171717]">
          {boxers.length}
        </p>

      </div>

      {/* BOXERS */}
      <div className="mt-8 space-y-4">

        {boxers.length > 0 ? (

          boxers.map((boxer) => {
            const fullName =
              `${boxer.first_name || ""} ${
                boxer.last_name || ""
              }`.trim();

            const division =
              divisions.find(
                (item) =>
                  item.id ===
                  boxer.division_id
              )?.name ||
              "Not Assigned";

            return (

              <article
                key={boxer.id}
                className="overflow-hidden border border-[#e2ddd5] bg-white shadow-sm"
              >

                <div className="grid min-w-0 sm:grid-cols-[160px_minmax(0,1fr)] lg:grid-cols-[170px_minmax(0,1fr)_250px]">

                  {/* PHOTO */}
                  <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#ece8e2] sm:aspect-auto sm:min-h-[220px] lg:min-h-[210px]">

                    {boxer.photo_url ? (

                      <Image
                        src={
                          boxer.photo_url
                        }
                        alt={
                          fullName ||
                          "HBE Boxer"
                        }
                        fill
                        sizes="(max-width: 639px) 100vw, (max-width: 1023px) 160px, 170px"
                        className="object-contain object-center sm:object-cover"
                      />

                    ) : (

                      <div className="flex h-full min-h-[320px] items-center justify-center sm:min-h-[220px] lg:min-h-[210px]">

                        <span className="text-xs font-black uppercase tracking-wider text-[#8a847c]">
                          No Photo
                        </span>

                      </div>

                    )}

                  </div>

                  {/* INFORMATION */}
                  <div className="min-w-0 p-5 sm:p-6 lg:p-7">

                    {/* NAME */}
                    <div className="flex items-start gap-3">

                      <span className="shrink-0 text-2xl">
                        {countryFlag(
                          boxer.nationality_code
                        )}
                      </span>

                      <div className="min-w-0">

                        <h2 className="text-xl font-black uppercase leading-tight text-[#171717] sm:text-2xl">
                          {fullName ||
                            "Unnamed Boxer"}
                        </h2>

                        {boxer.nickname && (

                          <p className="mt-1 italic text-[#6c675f]">
                            &ldquo;
                            {boxer.nickname}
                            &rdquo;
                          </p>

                        )}

                      </div>

                    </div>

                    {/* STATISTICS */}
                    <div className="mt-7 grid grid-cols-2 gap-x-5 gap-y-5 sm:grid-cols-2 lg:grid-cols-[1.35fr_1fr_0.9fr_1fr_1fr]">

                      {/* DIVISION */}
                      <div className="min-w-0">

                        <p className="text-[11px] font-black uppercase tracking-wide text-[#8a847c]">
                          Division
                        </p>

                        <p className="mt-1 text-base font-bold leading-6 text-[#171717]">
                          {formatDivision(
                            division
                          )}
                        </p>

                      </div>

                      {/* RECORD */}
                      <div className="min-w-0">

                        <p className="text-[11px] font-black uppercase tracking-wide text-[#8a847c]">
                          Record
                        </p>

                        <p className="mt-1 whitespace-nowrap text-base font-black text-[#171717]">
                          {boxer.wins ?? 0}-
                          {boxer.losses ?? 0}-
                          {boxer.draws ?? 0}
                        </p>

                      </div>

                      {/* KO WINS */}
                      <div className="min-w-0">

                        <p className="text-[11px] font-black uppercase tracking-wide text-[#8a847c]">
                          KO Wins
                        </p>

                        <p className="mt-1 text-base font-black text-[#171717]">
                          {boxer.knockout_wins ??
                            0}
                        </p>

                      </div>

                      {/* WORLD RANK */}
                      <div className="min-w-0">

                        <p className="text-[11px] font-black uppercase tracking-wide text-[#8a847c]">
                          World Rank
                        </p>

                        <p className="mt-1 whitespace-nowrap text-base font-black text-[#171717]">
                          {boxer.boxrec_world_rank
                            ? `#${boxer.boxrec_world_rank.toLocaleString()}`
                            : "—"}
                        </p>

                      </div>

                      {/* NATIONAL RANK */}
                      <div className="min-w-0">

                        <p className="text-[11px] font-black uppercase tracking-wide text-[#8a847c]">
                          National Rank
                        </p>

                        <p className="mt-1 whitespace-nowrap text-base font-black text-[#171717]">
                          {boxer.boxrec_country_rank
                            ? `#${boxer.boxrec_country_rank}`
                            : "—"}
                        </p>

                      </div>

                    </div>

                  </div>

                  {/* ACTIONS */}
                  <div className="flex items-center border-t border-[#eee9e2] p-5 sm:col-span-2 lg:col-span-1 lg:border-l lg:border-t-0 lg:p-6">

                    <div className="w-full space-y-3">

                      {/* EDIT BOXER */}
                      <Link
                        href={`/admin/boxers/${boxer.id}`}
                        className="inline-flex w-full items-center justify-center bg-[#c6a24a] px-6 py-4 text-xs font-black uppercase tracking-wide text-[#171717] transition hover:bg-[#b08d39]"
                      >
                        Edit Boxer
                      </Link>

                      {/* VIEW PROFILE */}
                      {boxer.profile_slug && (

                        <Link
                          href={`/boxers/${boxer.profile_slug}`}
                          className="inline-flex w-full items-center justify-center border border-[#d8d3cb] bg-white px-6 py-4 text-xs font-black uppercase tracking-wide text-[#171717] transition hover:border-[#c6a24a] hover:bg-[#f7f4ef]"
                        >
                          View Profile
                        </Link>

                      )}

                    </div>

                  </div>

                </div>

              </article>

            );
          })

        ) : (

          <div className="border border-[#e2ddd5] bg-white p-8">

            <p className="font-bold text-[#625d56]">
              No boxer records found.
            </p>

          </div>

        )}

      </div>

    </main>
  );
}