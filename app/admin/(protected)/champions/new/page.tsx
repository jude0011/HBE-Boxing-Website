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
  useRouter,
  useSearchParams,
} from "next/navigation";

import { createClient } from "@/app/lib/supabase/client";

type Boxer = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  nickname: string | null;
};

type Title = {
  id: string;
  name: string;
};

export default function NewChampionshipReignPage() {
  const router =
    useRouter();

  const searchParams =
    useSearchParams();

  const supabase =
    useMemo(
      () => createClient(),
      []
    );

  const preselectedBoxer =
    searchParams.get(
      "boxer_id"
    ) || "";

  const [
    boxers,
    setBoxers,
  ] = useState<Boxer[]>([]);

  const [
    titles,
    setTitles,
  ] = useState<Title[]>([]);

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
    boxerId,
    setBoxerId,
  ] = useState(
    preselectedBoxer
  );

  const [
    titleId,
    setTitleId,
  ] = useState("");

  const [
    wonDate,
    setWonDate,
  ] = useState("");

  const [
    endedDate,
    setEndedDate,
  ] = useState("");

  const [
    currentChampion,
    setCurrentChampion,
  ] = useState(false);

  const [
    titleDefenses,
    setTitleDefenses,
  ] = useState("0");

  const [
    opponentName,
    setOpponentName,
  ] = useState("");

  const [
    wonBy,
    setWonBy,
  ] = useState("");

  const [
    eventName,
    setEventName,
  ] = useState("");

  const [
    location,
    setLocation,
  ] = useState("");

  const [
    notes,
    setNotes,
  ] = useState("");

  useEffect(() => {
    async function loadData() {
      const [
        titleResult,
        boxerResult,
      ] = await Promise.all([
        supabase
          .from("titles")
          .select(
            "id, name"
          )
          .order("name"),

        supabase
          .from("boxers")
          .select(
            "id, first_name, last_name, nickname"
          )
          .order(
            "last_name"
          ),
      ]);

      if (
        titleResult.error
      ) {
        setError(
          titleResult.error.message
        );

        setLoading(false);
        return;
      }

      if (
        boxerResult.error
      ) {
        setError(
          boxerResult.error.message
        );

        setLoading(false);
        return;
      }

      setTitles(
        (
          titleResult.data as Title[]
        ) || []
      );

      setBoxers(
        (
          boxerResult.data as Boxer[]
        ) || []
      );

      setLoading(false);
    }

    void loadData();
  }, [supabase]);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setSaving(true);
    setError("");

    /*
      If this is the new CURRENT
      champion for the title,
      clear the previous current
      champion first.
    */
    if (
      currentChampion &&
      titleId
    ) {
      const {
        error:
          clearCurrentError,
      } = await supabase
        .from("title_reigns")
        .update({
          current_champion:
            false,
        })
        .eq(
          "title_id",
          titleId
        )
        .eq(
          "current_champion",
          true
        );

      if (
        clearCurrentError
      ) {
        setError(
          clearCurrentError.message
        );

        setSaving(false);
        return;
      }
    }

    const {
      error:
        insertError,
    } = await supabase
      .from("title_reigns")
      .insert({
        title_id:
          titleId,

        boxer_id:
          boxerId,

        won_date:
          wonDate ||
          null,

        ended_date:
          currentChampion
            ? null
            : endedDate ||
              null,

        current_champion:
          currentChampion,

        title_defenses:
          Number(
            titleDefenses
          ),

        opponent_name:
          opponentName.trim() ||
          null,

        won_by:
          wonBy.trim() ||
          null,

        event_name:
          eventName.trim() ||
          null,

        location:
          location.trim() ||
          null,

        notes:
          notes.trim() ||
          null,
      });

    if (
      insertError
    ) {
      setError(
        insertError.message
      );

      setSaving(false);
      return;
    }

    router.push(
      "/admin/champions"
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
          Loading...
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl p-5 sm:p-8 lg:p-10">

      <p className="text-xs font-black uppercase tracking-[0.25em] text-[#941f25]">
        Championship Management
      </p>

      <h1 className="mt-3 text-3xl font-black uppercase sm:text-4xl">
        Add Championship History
      </h1>

      <div className="mt-5 h-1 w-16 bg-[#c6a24a]" />

      <p className="mt-5 max-w-3xl leading-7 text-[#625d56]">
        Add a championship reign to
        a boxer. The same boxer can
        have multiple championship
        history records.
      </p>

      <form
        onSubmit={
          handleSubmit
        }
        className="mt-8 space-y-8"
      >

        {/* BOXER + TITLE */}
        <section className="border border-[#e2ddd5] bg-white p-6 sm:p-8">

          <h2 className="text-xl font-black uppercase">
            Championship
          </h2>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">

            <div>

              <label className={labelClass}>
                Boxer
              </label>

              <select
                required
                value={
                  boxerId
                }
                onChange={(event) =>
                  setBoxerId(
                    event.target.value
                  )
                }
                className={
                  inputClass
                }
              >
                <option value="">
                  Select Boxer
                </option>

                {boxers.map(
                  (boxer) => {
                    const fullName =
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
                        {fullName}
                        {boxer.nickname
                          ? ` "${boxer.nickname}"`
                          : ""}
                      </option>
                    );
                  }
                )}

              </select>

            </div>

            <div>

              <label className={labelClass}>
                Championship Title
              </label>

              <select
                required
                value={
                  titleId
                }
                onChange={(event) =>
                  setTitleId(
                    event.target.value
                  )
                }
                className={
                  inputClass
                }
              >
                <option value="">
                  Select Championship
                </option>

                {titles.map(
                  (title) => (
                    <option
                      key={
                        title.id
                      }
                      value={
                        title.id
                      }
                    >
                      {title.name}
                    </option>
                  )
                )}

              </select>

            </div>

          </div>

        </section>

        {/* REIGN */}
        <section className="border border-[#e2ddd5] bg-white p-6 sm:p-8">

          <h2 className="text-xl font-black uppercase">
            Championship Reign
          </h2>

          <div className="mt-6 grid gap-5 sm:grid-cols-3">

            <div>

              <label className={labelClass}>
                Date Title Was Won
              </label>

              <input
                type="date"
                value={
                  wonDate
                }
                onChange={(event) =>
                  setWonDate(
                    event.target.value
                  )
                }
                className={
                  inputClass
                }
              />

            </div>

            <div>

              <label className={labelClass}>
                Reign Ended Date
              </label>

              <input
                type="date"
                disabled={
                  currentChampion
                }
                value={
                  endedDate
                }
                onChange={(event) =>
                  setEndedDate(
                    event.target.value
                  )
                }
                className={`${inputClass} disabled:bg-[#efebe5]`}
              />

            </div>

            <div>

              <label className={labelClass}>
                Title Defenses
              </label>

              <input
                type="number"
                min="0"
                value={
                  titleDefenses
                }
                onChange={(event) =>
                  setTitleDefenses(
                    event.target.value
                  )
                }
                className={
                  inputClass
                }
              />

            </div>

          </div>

          <div className="mt-6 flex items-start gap-3 border border-[#e2ddd5] bg-[#f7f4ef] p-5">

            <input
              id="currentChampion"
              type="checkbox"
              checked={
                currentChampion
              }
              onChange={(event) => {
                const checked =
                  event.target.checked;

                setCurrentChampion(
                  checked
                );

                if (checked) {
                  setEndedDate("");
                }
              }}
              className="mt-1 h-5 w-5"
            />

            <div>

              <label
                htmlFor="currentChampion"
                className="font-black uppercase"
              >
                Current Champion
              </label>

              <p className="mt-1 text-sm text-[#625d56]">
                Turn this on only if
                this boxer currently
                holds this championship.
              </p>

            </div>

          </div>

        </section>

        {/* FIGHT DETAILS */}
        <section className="border border-[#e2ddd5] bg-white p-6 sm:p-8">

          <h2 className="text-xl font-black uppercase">
            Championship Fight
          </h2>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">

            <div>

              <label className={labelClass}>
                Opponent Defeated
              </label>

              <input
                value={
                  opponentName
                }
                onChange={(event) =>
                  setOpponentName(
                    event.target.value
                  )
                }
                className={
                  inputClass
                }
              />

            </div>

            <div>

              <label className={labelClass}>
                How They Won
              </label>

              <input
                value={
                  wonBy
                }
                onChange={(event) =>
                  setWonBy(
                    event.target.value
                  )
                }
                placeholder="KO, TKO, UD, SD..."
                className={
                  inputClass
                }
              />

            </div>

            <div>

              <label className={labelClass}>
                Event Name
              </label>

              <input
                value={
                  eventName
                }
                onChange={(event) =>
                  setEventName(
                    event.target.value
                  )
                }
                className={
                  inputClass
                }
              />

            </div>

            <div>

              <label className={labelClass}>
                Event Location
              </label>

              <input
                value={
                  location
                }
                onChange={(event) =>
                  setLocation(
                    event.target.value
                  )
                }
                className={
                  inputClass
                }
              />

            </div>

          </div>

        </section>

        {/* NOTES */}
        <section className="border border-[#e2ddd5] bg-white p-6 sm:p-8">

          <h2 className="text-xl font-black uppercase">
            Championship Notes
          </h2>

          <textarea
            rows={7}
            value={
              notes
            }
            onChange={(event) =>
              setNotes(
                event.target.value
              )
            }
            placeholder="Additional championship information..."
            className={
              inputClass
            }
          />

        </section>

        {error && (
          <div className="border border-red-200 bg-red-50 p-4 font-semibold text-red-700">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row">

          <button
            type="submit"
            disabled={
              saving
            }
            className="bg-[#941f25] px-7 py-4 text-sm font-black uppercase text-white transition hover:bg-[#74181d]"
          >
            {saving
              ? "Saving..."
              : "Add Championship History"}
          </button>

          <button
            type="button"
            onClick={() =>
              router.push(
                "/admin/champions"
              )
            }
            className="border border-[#d8d3cb] bg-white px-7 py-4 text-sm font-black uppercase"
          >
            Cancel
          </button>

        </div>

      </form>

    </main>
  );
}