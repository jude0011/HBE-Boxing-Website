"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { createClient } from "@/app/lib/supabase/client";

type RankingRow = {
  id: string;
  boxer_id: string;
  division_id: string | null;
  ranking_position: number;
  published: boolean | null;
};

type BoxerRow = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  wins: number | null;
  losses: number | null;
  draws: number | null;
  boxrec_rating_stars: number | null;
};

type DivisionRow = {
  id: string;
  name: string;
};

type EditableRanking = {
  id: string;
  boxer_id: string;
  division_id: string | null;
  ranking_position: number;
  published: boolean;
};

function RatingStars({
  rating,
}: {
  rating: number;
}) {
  return (
    <div className="flex gap-1">
      {Array.from({
        length: 5,
      }).map(
        (_, index) => {
          const star =
            index + 1;

          if (
            rating >= star
          ) {
            return (
              <span
                key={index}
                className="text-xl text-[#f2a900]"
              >
                ★
              </span>
            );
          }

          if (
            rating >=
            star - 0.5
          ) {
            return (
              <span
                key={index}
                className="relative inline-block text-xl text-[#d7d9dd]"
              >
                ★

                <span
                  className="absolute left-0 top-0 w-1/2 overflow-hidden text-[#f2a900]"
                  aria-hidden="true"
                >
                  ★
                </span>
              </span>
            );
          }

          return (
            <span
              key={index}
              className="text-xl text-[#d7d9dd]"
            >
              ★
            </span>
          );
        }
      )}
    </div>
  );
}

export default function AdminRankingsPage() {
  const supabase =
    useMemo(
      () => createClient(),
      []
    );

  const [
    rankings,
    setRankings,
  ] =
    useState<
      EditableRanking[]
    >([]);

  const [
    boxers,
    setBoxers,
  ] =
    useState<BoxerRow[]>(
      []
    );

  const [
    divisions,
    setDivisions,
  ] =
    useState<
      DivisionRow[]
    >([]);

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    savingId,
    setSavingId,
  ] =
    useState<
      string | null
    >(null);

  const [
    deletingId,
    setDeletingId,
  ] =
    useState<
      string | null
    >(null);

  const [
    adding,
    setAdding,
  ] =
    useState(false);

  const [
    message,
    setMessage,
  ] =
    useState("");

  /*
    ADD RANKING FORM
  */
  const [
    newBoxerId,
    setNewBoxerId,
  ] =
    useState("");

  const [
    newDivisionId,
    setNewDivisionId,
  ] =
    useState("");

  const [
    newRankingPosition,
    setNewRankingPosition,
  ] =
    useState("1");

  const [
    newPublished,
    setNewPublished,
  ] =
    useState(false);

  useEffect(() => {
    async function loadData() {
      setLoading(true);

      const [
        rankingsResult,
        boxersResult,
        divisionsResult,
      ] =
        await Promise.all([
          supabase
            .from(
              "rankings"
            )
            .select(`
              id,
              boxer_id,
              division_id,
              ranking_position,
              published
            `)
            .order(
              "ranking_position",
              {
                ascending:
                  true,
              }
            ),

          supabase
            .from(
              "boxers"
            )
            .select(`
              id,
              first_name,
              last_name,
              wins,
              losses,
              draws,
              boxrec_rating_stars
            `)
            .order(
              "last_name",
              {
                ascending:
                  true,
              }
            ),

          supabase
            .from(
              "divisions"
            )
            .select(`
              id,
              name
            `)
            .order(
              "name"
            ),
        ]);

      if (
        rankingsResult.error
      ) {
        console.error(
          "Rankings error:",
          rankingsResult.error
        );

        setMessage(
          `Error loading rankings: ${rankingsResult.error.message}`
        );
      }

      if (
        boxersResult.error
      ) {
        console.error(
          "Boxers error:",
          boxersResult.error
        );
      }

      if (
        divisionsResult.error
      ) {
        console.error(
          "Divisions error:",
          divisionsResult.error
        );
      }

      const loadedRankings =
        (
          rankingsResult.data as RankingRow[]
        ) || [];

      setRankings(
        loadedRankings.map(
          (ranking) => ({
            id:
              ranking.id,

            boxer_id:
              ranking.boxer_id,

            division_id:
              ranking.division_id,

            ranking_position:
              ranking.ranking_position,

            published:
              ranking.published ??
              false,
          })
        )
      );

      setBoxers(
        (
          boxersResult.data as BoxerRow[]
        ) || []
      );

      setDivisions(
        (
          divisionsResult.data as DivisionRow[]
        ) || []
      );

      setLoading(false);
    }

    void loadData();
  }, [supabase]);

  function updateRanking(
    id: string,
    field:
      | "ranking_position"
      | "published",
    value:
      | number
      | boolean
  ) {
    setRankings(
      (current) =>
        current.map(
          (ranking) =>
            ranking.id ===
            id
              ? {
                  ...ranking,
                  [field]:
                    value,
                }
              : ranking
        )
    );
  }

  function updateBoxerRating(
    boxerId: string,
    value: number
  ) {
    setBoxers(
      (current) =>
        current.map(
          (boxer) =>
            boxer.id ===
            boxerId
              ? {
                  ...boxer,
                  boxrec_rating_stars:
                    value,
                }
              : boxer
        )
    );
  }

  async function saveRanking(
    ranking:
      EditableRanking
  ) {
    setSavingId(
      ranking.id
    );

    setMessage("");

    const boxer =
      boxers.find(
        (item) =>
          item.id ===
          ranking.boxer_id
      );

    /*
      SAVE HBE RANKING
    */
    const rankingResult =
      await supabase
        .from(
          "rankings"
        )
        .update({
          ranking_position:
            ranking.ranking_position,

          published:
            ranking.published,

          updated_at:
            new Date()
              .toISOString(),
        })
        .eq(
          "id",
          ranking.id
        );

    if (
      rankingResult.error
    ) {
      console.error(
        "Save ranking error:",
        rankingResult.error
      );

      setMessage(
        `Error: ${rankingResult.error.message}`
      );

      setSavingId(
        null
      );

      return;
    }

    /*
      SAVE STAR RATING
    */
    if (boxer) {
      const boxerResult =
        await supabase
          .from(
            "boxers"
          )
          .update({
            boxrec_rating_stars:
              boxer.boxrec_rating_stars ??
              0,
          })
          .eq(
            "id",
            boxer.id
          );

      if (
        boxerResult.error
      ) {
        console.error(
          "Save star rating error:",
          boxerResult.error
        );

        setMessage(
          `Ranking saved, but star rating failed: ${boxerResult.error.message}`
        );

        setSavingId(
          null
        );

        return;
      }
    }

    setMessage(
      "Ranking and star rating updated successfully."
    );

    setSavingId(
      null
    );
  }

  /*
    ADD BOXER TO RANKINGS
  */
  async function addRanking() {
    setMessage("");

    if (!newBoxerId) {
      setMessage(
        "Please select a boxer."
      );

      return;
    }

    if (!newDivisionId) {
      setMessage(
        "Please select a division."
      );

      return;
    }

    const rankingNumber =
      Number(
        newRankingPosition
      );

    if (
      !rankingNumber ||
      rankingNumber < 1
    ) {
      setMessage(
        "Ranking position must be 1 or higher."
      );

      return;
    }

    /*
      Prevent duplicate fighter
      in the same division.
    */
    const duplicate =
      rankings.find(
        (ranking) =>
          ranking.boxer_id ===
            newBoxerId &&
          ranking.division_id ===
            newDivisionId
      );

    if (duplicate) {
      setMessage(
        "This boxer is already ranked in this division."
      );

      return;
    }

    setAdding(true);

    const {
      data,
      error,
    } =
      await supabase
        .from(
          "rankings"
        )
        .insert({
          boxer_id:
            newBoxerId,

          division_id:
            newDivisionId,

          ranking_position:
            rankingNumber,

          published:
            newPublished,

          updated_at:
            new Date()
              .toISOString(),
        })
        .select(`
          id,
          boxer_id,
          division_id,
          ranking_position,
          published
        `)
        .single();

    if (error) {
      console.error(
        "Add ranking error:",
        error
      );

      setMessage(
        `Unable to add ranking: ${error.message}`
      );

      setAdding(false);
      return;
    }

    const newRanking =
      data as RankingRow;

    setRankings(
      (current) =>
        [
          ...current,
          {
            id:
              newRanking.id,

            boxer_id:
              newRanking.boxer_id,

            division_id:
              newRanking.division_id,

            ranking_position:
              newRanking.ranking_position,

            published:
              newRanking.published ??
              false,
          },
        ].sort(
          (
            a,
            b
          ) =>
            a.ranking_position -
            b.ranking_position
        )
    );

    setNewBoxerId("");
    setNewDivisionId("");
    setNewRankingPosition(
      "1"
    );
    setNewPublished(
      false
    );

    setMessage(
      "Boxer added to HBE rankings successfully."
    );

    setAdding(false);
  }

  /*
    REMOVE BOXER FROM RANKINGS
  */
  async function removeRanking(
    ranking:
      EditableRanking
  ) {
    const boxer =
      boxers.find(
        (item) =>
          item.id ===
          ranking.boxer_id
      );

    const fullName =
      `${boxer?.first_name || ""} ${
        boxer?.last_name || ""
      }`.trim() ||
      "this boxer";

    const confirmed =
      window.confirm(
        `Remove ${fullName} from the HBE rankings? This will not delete the boxer.`
      );

    if (!confirmed) {
      return;
    }

    setDeletingId(
      ranking.id
    );

    setMessage("");

    const {
      error,
    } =
      await supabase
        .from(
          "rankings"
        )
        .delete()
        .eq(
          "id",
          ranking.id
        );

    if (error) {
      console.error(
        "Remove ranking error:",
        error
      );

      setMessage(
        `Unable to remove ranking: ${error.message}`
      );

      setDeletingId(
        null
      );

      return;
    }

    setRankings(
      (current) =>
        current.filter(
          (item) =>
            item.id !==
            ranking.id
        )
    );

    setMessage(
      `${fullName} was removed from the rankings.`
    );

    setDeletingId(
      null
    );
  }

  /*
    BOXERS NOT CURRENTLY
    RANKED IN SELECTED DIVISION
  */
  const availableBoxers =
    boxers.filter(
      (boxer) => {
        if (
          !newDivisionId
        ) {
          return true;
        }

        return !rankings.some(
          (ranking) =>
            ranking.boxer_id ===
              boxer.id &&
            ranking.division_id ===
              newDivisionId
        );
      }
    );

  /*
    DISPLAY SORT:
    division name then rank.
  */
  const sortedRankings =
    [...rankings].sort(
      (a, b) => {
        const divisionA =
          divisions.find(
            (division) =>
              division.id ===
              a.division_id
          )?.name || "";

        const divisionB =
          divisions.find(
            (division) =>
              division.id ===
              b.division_id
          )?.name || "";

        const divisionCompare =
          divisionA.localeCompare(
            divisionB
          );

        if (
          divisionCompare !==
          0
        ) {
          return divisionCompare;
        }

        return (
          a.ranking_position -
          b.ranking_position
        );
      }
    );

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl p-10">

        <p className="font-black uppercase text-[#625d56]">
          Loading Rankings...
        </p>

      </main>
    );
  }

  return (
    <main className="mx-auto w-full min-w-0 max-w-full p-5 sm:p-8 lg:p-8">

      {/* HEADER */}
      <div>

        <p className="text-xs font-black uppercase tracking-[0.25em] text-[#941f25]">
          Ranking Management
        </p>

        <h1 className="mt-3 text-3xl font-black uppercase text-[#171717] sm:text-4xl">
          HBE Rankings
        </h1>

        <div className="mt-5 h-1 w-16 bg-[#c6a24a]" />

        <p className="mt-5 max-w-3xl leading-7 text-[#625d56]">
          Add and remove ranked
          fighters, manage official
          HBE ranking positions,
          star ratings and publication
          status.
        </p>

      </div>

      {/* MESSAGE */}
      {message && (

        <div className="mt-6 border border-[#d8d3cb] bg-white p-4 text-sm font-semibold text-[#171717]">
          {message}
        </div>

      )}

      {/* SUMMARY */}
      <section className="mt-8 grid gap-4 sm:grid-cols-3">

        <div className="border border-[#e2ddd5] bg-white p-6">

          <p className="text-xs font-black uppercase tracking-[0.15em] text-[#817a73]">
            Ranked Fighters
          </p>

          <p className="mt-2 text-3xl font-black">
            {
              rankings.length
            }
          </p>

        </div>

        <div className="border border-[#e2ddd5] bg-white p-6">

          <p className="text-xs font-black uppercase tracking-[0.15em] text-[#817a73]">
            Published
          </p>

          <p className="mt-2 text-3xl font-black text-green-700">
            {
              rankings.filter(
                (ranking) =>
                  ranking.published
              ).length
            }
          </p>

        </div>

        <div className="border border-[#e2ddd5] bg-white p-6">

          <p className="text-xs font-black uppercase tracking-[0.15em] text-[#817a73]">
            Divisions
          </p>

          <p className="mt-2 text-3xl font-black">
            {
              divisions.length
            }
          </p>

        </div>

      </section>

      {/* ADD RANKING */}
      <section className="mt-10 w-full min-w-0 overflow-hidden border border-[#e2ddd5] bg-white p-6 shadow-sm sm:p-8">

        <p className="text-xs font-black uppercase tracking-[0.2em] text-[#941f25]">
          Add Ranking
        </p>

        <h2 className="mt-2 text-2xl font-black uppercase">
          Add Boxer To Rankings
        </h2>

        <p className="mt-3 max-w-3xl text-sm leading-7 text-[#625d56]">
          Select the division first,
          then choose a boxer and
          assign their initial HBE
          ranking position.
        </p>

        <div className="mt-6 grid min-w-0 gap-5 md:grid-cols-2 xl:grid-cols-[minmax(180px,1fr)_minmax(180px,1fr)_100px_110px_130px] xl:items-end">

          {/* DIVISION */}
          <div>

            <label className="text-xs font-black uppercase tracking-wide text-[#8a847c]">
              Division
            </label>

            <select
              value={
                newDivisionId
              }
              onChange={(
                event
              ) => {
                setNewDivisionId(
                  event.target.value
                );

                setNewBoxerId(
                  ""
                );
              }}
              className="mt-2 w-full border border-[#d8d3cb] bg-white px-4 py-3 font-bold text-[#171717] outline-none focus:border-[#941f25]"
            >
              <option value="">
                Select Division
              </option>

              {divisions.map(
                (division) => (

                  <option
                    key={
                      division.id
                    }
                    value={
                      division.id
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

          {/* BOXER */}
          <div>

            <label className="text-xs font-black uppercase tracking-wide text-[#8a847c]">
              Boxer
            </label>

            <select
              value={
                newBoxerId
              }
              onChange={(
                event
              ) =>
                setNewBoxerId(
                  event.target.value
                )
              }
              className="mt-2 w-full border border-[#d8d3cb] bg-white px-4 py-3 font-bold text-[#171717] outline-none focus:border-[#941f25]"
            >
              <option value="">
                Select Boxer
              </option>

              {availableBoxers.map(
                (boxer) => {
                  const name =
                    `${boxer.first_name || ""} ${
                      boxer.last_name || ""
                    }`.trim();

                  return (
                    <option
                      key={
                        boxer.id
                      }
                      value={
                        boxer.id
                      }
                    >
                      {name}
                    </option>
                  );
                }
              )}

            </select>

          </div>

          {/* RANK */}
          <div>

            <label className="text-xs font-black uppercase tracking-wide text-[#8a847c]">
              HBE Rank
            </label>

            <input
              type="number"
              min="1"
              value={
                newRankingPosition
              }
              onChange={(
                event
              ) =>
                setNewRankingPosition(
                  event.target.value
                )
              }
              className="mt-2 w-full border border-[#d8d3cb] bg-white px-4 py-3 font-bold text-[#171717] outline-none focus:border-[#941f25]"
            />

          </div>

          {/* PUBLISH */}
          <div>

            <label className="text-xs font-black uppercase tracking-wide text-[#8a847c]">
              Publish
            </label>

            <label className="mt-4 flex items-center gap-3">

              <input
                type="checkbox"
                checked={
                  newPublished
                }
                onChange={(
                  event
                ) =>
                  setNewPublished(
                    event.target.checked
                  )
                }
                className="h-5 w-5 accent-[#941f25]"
              />

              <span className="text-sm font-bold">
                {newPublished
                  ? "Yes"
                  : "No"}
              </span>

            </label>

          </div>

          {/* ADD */}
          <div>

            <button
              type="button"
              onClick={
                addRanking
              }
              disabled={
                adding
              }
              className="w-full bg-[#941f25] px-5 py-4 text-xs font-black uppercase tracking-wide text-white transition hover:bg-[#74181d] disabled:opacity-60"
            >
              {adding
                ? "Adding..."
                : "Add Ranking"}
            </button>

          </div>

        </div>

      </section>

      {/* EXISTING RANKINGS */}
      <section className="mt-10">

        <p className="text-xs font-black uppercase tracking-[0.2em] text-[#941f25]">
          Official Rankings
        </p>

        <h2 className="mt-2 text-2xl font-black uppercase">
          Ranked Fighters
        </h2>

        <div className="mt-6 space-y-4">

          {sortedRankings.length ===
          0 ? (

            <div className="border border-[#e2ddd5] bg-white p-8 text-[#625d56]">
              No fighters have been
              added to the rankings yet.
            </div>

          ) : (

            sortedRankings.map(
              (ranking) => {
                const boxer =
                  boxers.find(
                    (item) =>
                      item.id ===
                      ranking.boxer_id
                  );

                const division =
                  divisions.find(
                    (item) =>
                      item.id ===
                      ranking.division_id
                  );

                const fullName =
                  `${boxer?.first_name || ""} ${
                    boxer?.last_name || ""
                  }`.trim();

                const record =
                  `${boxer?.wins ?? 0}-${
                    boxer?.losses ?? 0
                  }-${boxer?.draws ?? 0}`;

                const rating =
                  Number(
                    boxer?.boxrec_rating_stars ??
                      0
                  );

                return (

                  <article
                    key={
                      ranking.id
                    }
                    className="w-full min-w-0 overflow-hidden border border-[#e2ddd5] bg-white p-5 shadow-sm sm:p-6"
                  >

                    <div className="grid min-w-0 gap-5 lg:grid-cols-2 xl:grid-cols-[minmax(170px,1fr)_90px_120px_105px_100px_110px] xl:items-center">

                      {/* FIGHTER */}
                      <div>

                        <p className="text-xs font-black uppercase tracking-[0.16em] text-[#941f25]">
                          {division?.name ||
                            "No Division"}
                        </p>

                        <h2 className="mt-2 text-xl font-black uppercase text-[#171717] sm:text-2xl">
                          {fullName ||
                            "Unknown Boxer"}
                        </h2>

                        <p className="mt-2 text-sm font-semibold text-[#625d56]">
                          Record:{" "}
                          {
                            record
                          }
                        </p>

                        <div className="mt-2">
                          <RatingStars
                            rating={
                              rating
                            }
                          />
                        </div>

                      </div>

                      {/* RANK */}
                      <div>

                        <label className="text-xs font-black uppercase tracking-wide text-[#8a847c]">
                          HBE Rank
                        </label>

                        <input
                          type="number"
                          min="1"
                          value={
                            ranking.ranking_position
                          }
                          onChange={(
                            event
                          ) =>
                            updateRanking(
                              ranking.id,
                              "ranking_position",
                              Number(
                                event.target.value
                              )
                            )
                          }
                          className="mt-2 w-full border border-[#d8d3cb] bg-white px-3 py-3 font-bold text-[#171717] outline-none focus:border-[#941f25]"
                        />

                      </div>

                      {/* STAR RATING */}
                      <div>

                        <label className="text-xs font-black uppercase tracking-wide text-[#8a847c]">
                          Star Rating
                        </label>

                        <input
                          type="number"
                          min="0"
                          max="5"
                          step="0.5"
                          value={
                            rating
                          }
                          onChange={(
                            event
                          ) =>
                            boxer &&
                            updateBoxerRating(
                              boxer.id,
                              Number(
                                event.target.value
                              )
                            )
                          }
                          className="mt-2 w-full border border-[#d8d3cb] bg-white px-3 py-3 font-bold text-[#171717] outline-none focus:border-[#941f25]"
                        />

                        <div className="mt-2">

                          <RatingStars
                            rating={
                              rating
                            }
                          />

                        </div>

                      </div>

                      {/* PUBLISHED */}
                      <div>

                        <label className="text-xs font-black uppercase tracking-wide text-[#8a847c]">
                          Published
                        </label>

                        <div className="mt-3">

                          <label className="flex items-center gap-3">

                            <input
                              type="checkbox"
                              checked={
                                ranking.published
                              }
                              onChange={(
                                event
                              ) =>
                                updateRanking(
                                  ranking.id,
                                  "published",
                                  event.target.checked
                                )
                              }
                              className="h-5 w-5 accent-[#941f25]"
                            />

                            <span className="text-sm font-bold text-[#171717]">
                              {ranking.published
                                ? "Yes"
                                : "No"}
                            </span>

                          </label>

                        </div>

                      </div>

                      {/* SAVE */}
                      <div>

                        <button
                          type="button"
                          onClick={() =>
                            saveRanking(
                              ranking
                            )
                          }
                          disabled={
                            savingId ===
                              ranking.id ||
                            deletingId ===
                              ranking.id
                          }
                          className="w-full min-w-0 whitespace-nowrap bg-[#941f25] px-4 py-3 text-xs font-black uppercase tracking-wide text-white transition hover:bg-[#74181d] disabled:opacity-60"
                        >
                          {savingId ===
                          ranking.id
                            ? "Saving..."
                            : "Save"}
                        </button>

                      </div>

                      {/* REMOVE */}
                      <div>

                        <button
                          type="button"
                          onClick={() =>
                            removeRanking(
                              ranking
                            )
                          }
                          disabled={
                            deletingId ===
                              ranking.id ||
                            savingId ===
                              ranking.id
                          }
                          className="w-full min-w-0 whitespace-nowrap border border-red-300 bg-red-50 px-4 py-3 text-xs font-black uppercase tracking-wide text-red-700 transition hover:bg-red-700 hover:text-white disabled:opacity-60"
                        >
                          {deletingId ===
                          ranking.id
                            ? "Removing..."
                            : "Remove"}
                        </button>

                      </div>

                    </div>

                  </article>

                );
              }
            )

          )}

        </div>

      </section>

    </main>
  );
}