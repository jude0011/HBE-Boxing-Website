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

type Reign = {
  id: string;

  title_id: string | null;
  boxer_id: string | null;

  won_date: string | null;
  ended_date: string | null;

  current_champion: boolean | null;
  title_defenses: number | null;

  won_by: string | null;
  opponent_name: string | null;

  event_name: string | null;
  location: string | null;

  notes: string | null;
};

export default function EditChampionshipReignPage() {
  const params =
    useParams();

  const router =
    useRouter();

  const supabase =
    useMemo(
      () => createClient(),
      []
    );

  const reignId =
    typeof params.id ===
    "string"
      ? params.id
      : "";

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
    deleting,
    setDeleting,
  ] = useState(false);

  const [
    isSuperAdmin,
    setIsSuperAdmin,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const [
    message,
    setMessage,
  ] = useState("");

  const [
    boxerId,
    setBoxerId,
  ] = useState("");

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
    async function loadPage() {
      if (!reignId) {
        setError(
          "Championship reign ID not found."
        );

        setLoading(false);
        return;
      }

      /*
        ADMIN ROLE
      */
      const {
        data: { user },
      } =
        await supabase.auth.getUser();

      if (user) {
        const {
          data:
            adminData,
        } = await supabase
          .from(
            "admin_users"
          )
          .select("role")
          .eq(
            "id",
            user.id
          )
          .single();

        setIsSuperAdmin(
          adminData?.role ===
            "super_admin"
        );
      }

      const [
        reignResult,
        titleResult,
        boxerResult,
      ] = await Promise.all([
        supabase
          .from(
            "title_reigns"
          )
          .select("*")
          .eq(
            "id",
            reignId
          )
          .single(),

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
        reignResult.error
      ) {
        setError(
          reignResult.error.message
        );

        setLoading(false);
        return;
      }

      if (
        titleResult.error
      ) {
        console.error(
          titleResult.error
        );
      }

      if (
        boxerResult.error
      ) {
        console.error(
          boxerResult.error
        );
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

      const reign =
        reignResult.data as Reign;

      setBoxerId(
        reign.boxer_id || ""
      );

      setTitleId(
        reign.title_id || ""
      );

      setWonDate(
        reign.won_date || ""
      );

      setEndedDate(
        reign.ended_date || ""
      );

      setCurrentChampion(
        reign.current_champion ??
          false
      );

      setTitleDefenses(
        String(
          reign.title_defenses ??
            0
        )
      );

      setOpponentName(
        reign.opponent_name ||
          ""
      );

      setWonBy(
        reign.won_by ||
          ""
      );

      setEventName(
        reign.event_name ||
          ""
      );

      setLocation(
        reign.location ||
          ""
      );

      setNotes(
        reign.notes ||
          ""
      );

      setLoading(false);
    }

    void loadPage();
  }, [
    reignId,
    supabase,
  ]);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setSaving(true);
    setError("");
    setMessage("");

    /*
      If this record becomes
      current champion, clear
      other current champions
      for the same title.
    */
    if (
      currentChampion &&
      titleId
    ) {
      const {
        error:
          clearError,
      } = await supabase
        .from(
          "title_reigns"
        )
        .update({
          current_champion:
            false,
        })
        .eq(
          "title_id",
          titleId
        )
        .neq(
          "id",
          reignId
        );

      if (
        clearError
      ) {
        setError(
          clearError.message
        );

        setSaving(false);
        return;
      }
    }

    const {
      error:
        updateError,
    } = await supabase
      .from("title_reigns")
      .update({
        boxer_id:
          boxerId,

        title_id:
          titleId,

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
      })
      .eq(
        "id",
        reignId
      );

    if (
      updateError
    ) {
      setError(
        updateError.message
      );

      setSaving(false);
      return;
    }

    setMessage(
      "Championship history updated successfully."
    );

    setSaving(false);

    router.refresh();
  }

  async function deleteReign() {
    if (!isSuperAdmin) {
      return;
    }

    if (
      !window.confirm(
        "Permanently delete this championship history record?"
      )
    ) {
      return;
    }

    if (
      !window.confirm(
        "Final confirmation: this championship reign will be permanently deleted."
      )
    ) {
      return;
    }

    setDeleting(true);
    setError("");

    const {
      error:
        deleteError,
    } = await supabase
      .from("title_reigns")
      .delete()
      .eq(
        "id",
        reignId
      );

    if (
      deleteError
    ) {
      setError(
        deleteError.message
      );

      setDeleting(false);
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
          Loading Championship...
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
        Edit Championship History
      </h1>

      <div className="mt-5 h-1 w-16 bg-[#c6a24a]" />

      {message && (
        <div className="mt-6 border border-green-200 bg-green-50 p-4 font-semibold text-green-700">
          {message}
        </div>
      )}

      <form
        onSubmit={
          handleSubmit
        }
        className="mt-8 space-y-8"
      >

        {/* CHAMPIONSHIP */}
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
                className={`${inputClass} disabled:bg-[#efebe5] disabled:text-[#8a847c]`}
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

        {/* FIGHT */}
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
              saving ||
              deleting
            }
            className="bg-[#941f25] px-7 py-4 text-sm font-black uppercase text-white transition hover:bg-[#74181d]"
          >
            {saving
              ? "Saving..."
              : "Save Championship"}
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

      {/* SUPER ADMIN DELETE */}
      {isSuperAdmin && (

        <section className="mt-10 border border-red-200 bg-red-50 p-6 sm:p-8">

          <p className="text-xs font-black uppercase tracking-[0.18em] text-red-700">
            Super Admin Control
          </p>

          <h2 className="mt-3 text-xl font-black uppercase">
            Permanent Delete Championship Reign
          </h2>

          <p className="mt-3 text-sm leading-7 text-[#625d56]">
            This removes only this
            championship history record.
            It does not delete the boxer
            or championship title.
          </p>

          <button
            type="button"
            disabled={
              deleting ||
              saving
            }
            onClick={
              deleteReign
            }
            className="mt-6 border border-red-300 bg-red-100 px-7 py-4 text-sm font-black uppercase text-red-700 transition hover:bg-red-700 hover:text-white"
          >
            {deleting
              ? "Deleting..."
              : "Permanent Delete Reign"}
          </button>

        </section>

      )}

    </main>
  );
}