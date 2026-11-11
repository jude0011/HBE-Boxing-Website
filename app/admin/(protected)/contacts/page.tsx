"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { createClient } from "@/app/lib/supabase/client";

type ContactInquiry = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  country: string | null;
  organization: string | null;
  inquiry_type: string;
  message: string;
  status: string;
  created_at: string;
  admin_notes: string | null;
  handled_at: string | null;
};

function formatDate(
  value: string | null
) {
  if (!value) {
    return "—";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "—";
  }

  return date.toLocaleString(
    "en-US",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }
  );
}

function statusClasses(
  status: string
) {
  if (
    status === "completed"
  ) {
    return "bg-green-100 text-green-700";
  }

  if (
    status === "in_progress"
  ) {
    return "bg-[#fff4d6] text-[#8a6919]";
  }

  return "bg-red-100 text-[#941f25]";
}

function statusLabel(
  status: string
) {
  if (
    status === "completed"
  ) {
    return "Completed";
  }

  if (
    status === "in_progress"
  ) {
    return "In Progress";
  }

  return "New";
}

export default function ContactInquiriesPage() {
  const supabase =
    useMemo(
      () => createClient(),
      []
    );

  const [
    inquiries,
    setInquiries,
  ] = useState<ContactInquiry[]>(
    []
  );

  const [
    isSuperAdmin,
    setIsSuperAdmin,
  ] = useState(false);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    savingId,
    setSavingId,
  ] = useState("");

  const [
    message,
    setMessage,
  ] = useState("");

  async function loadData() {
    const {
      data: { user },
    } =
      await supabase.auth.getUser();

    if (user) {
      const {
        data: admin,
      } = await supabase
        .from("admin_users")
        .select("role")
        .eq("id", user.id)
        .single();

      setIsSuperAdmin(
        admin?.role ===
          "super_admin"
      );
    }

    const {
      data,
      error,
    } = await supabase
      .from("contact_inquiries")
      .select(`
        id,
        full_name,
        email,
        phone,
        country,
        organization,
        inquiry_type,
        message,
        status,
        created_at,
        admin_notes,
        handled_at
      `)
      .order(
        "created_at",
        {
          ascending: false,
        }
      );

    if (error) {
      console.error(
        "Contact inquiries error:",
        error
      );

      setMessage(
        error.message
      );
    }

    setInquiries(
      (data as ContactInquiry[]) ||
        []
    );

    setLoading(false);
  }

  useEffect(() => {
    const initialize =
      async () => {
        await loadData();
      };

    void initialize();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function updateLocalInquiry(
    id: string,
    field:
      | "status"
      | "admin_notes",
    value: string
  ) {
    setInquiries(
      (current) =>
        current.map(
          (inquiry) =>
            inquiry.id === id
              ? {
                  ...inquiry,
                  [field]:
                    value,
                }
              : inquiry
        )
    );
  }

  async function saveInquiry(
    inquiry: ContactInquiry
  ) {
    setSavingId(
      inquiry.id
    );

    setMessage("");

    const handledAt =
      inquiry.status ===
      "completed"
        ? inquiry.handled_at ||
          new Date().toISOString()
        : null;

    const {
      error,
    } = await supabase
      .from("contact_inquiries")
      .update({
        status:
          inquiry.status,

        admin_notes:
          inquiry.admin_notes?.trim() ||
          null,

        handled_at:
          handledAt,
      })
      .eq(
        "id",
        inquiry.id
      );

    if (error) {
      console.error(
        "Update inquiry error:",
        error
      );

      setMessage(
        error.message
      );

      setSavingId("");

      return;
    }

    setInquiries(
      (current) =>
        current.map(
          (item) =>
            item.id ===
            inquiry.id
              ? {
                  ...item,
                  handled_at:
                    handledAt,
                }
              : item
        )
    );

    setMessage(
      "Contact inquiry updated."
    );

    setSavingId("");
  }

  async function deleteInquiry(
    inquiry: ContactInquiry
  ) {
    if (!isSuperAdmin) {
      return;
    }

    const confirmed =
      window.confirm(
        `PERMANENTLY delete the inquiry from "${inquiry.full_name}"? This cannot be undone.`
      );

    if (!confirmed) {
      return;
    }

    const {
      error,
    } = await supabase
      .from("contact_inquiries")
      .delete()
      .eq(
        "id",
        inquiry.id
      );

    if (error) {
      setMessage(
        error.message
      );

      return;
    }

    setInquiries(
      (current) =>
        current.filter(
          (item) =>
            item.id !==
            inquiry.id
        )
    );

    setMessage(
      "Contact inquiry permanently deleted."
    );
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl p-10">

        <p className="font-black uppercase text-[#625d56]">
          Loading Contact Inquiries...
        </p>

      </main>
    );
  }

  const newCount =
    inquiries.filter(
      (item) =>
        item.status === "new"
    ).length;

  const progressCount =
    inquiries.filter(
      (item) =>
        item.status ===
        "in_progress"
    ).length;

  const completedCount =
    inquiries.filter(
      (item) =>
        item.status ===
        "completed"
    ).length;

  return (
    <main className="mx-auto max-w-7xl p-5 sm:p-8 lg:p-10">

      {/* HEADER */}
      <div>

        <p className="text-xs font-black uppercase tracking-[0.25em] text-[#941f25]">
          Lead Management
        </p>

        <h1 className="mt-3 text-3xl font-black uppercase text-[#171717] sm:text-4xl">
          Contact Inquiries
        </h1>

        <div className="mt-5 h-1 w-16 bg-[#c6a24a]" />

        <p className="mt-5 max-w-3xl leading-7 text-[#625d56]">
          Review incoming HBE inquiries,
          track follow-up activity and
          document each contact through
          completion.
        </p>

      </div>

      {/* COUNTS */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

        <div className="border border-[#e2ddd5] bg-white p-5">

          <p className="text-xs font-black uppercase tracking-[0.15em] text-[#8a847c]">
            Total
          </p>

          <p className="mt-1 text-3xl font-black">
            {inquiries.length}
          </p>

        </div>

        <div className="border border-[#e2ddd5] bg-white p-5">

          <p className="text-xs font-black uppercase tracking-[0.15em] text-[#941f25]">
            New
          </p>

          <p className="mt-1 text-3xl font-black">
            {newCount}
          </p>

        </div>

        <div className="border border-[#e2ddd5] bg-white p-5">

          <p className="text-xs font-black uppercase tracking-[0.15em] text-[#8a6919]">
            In Progress
          </p>

          <p className="mt-1 text-3xl font-black">
            {progressCount}
          </p>

        </div>

        <div className="border border-[#e2ddd5] bg-white p-5">

          <p className="text-xs font-black uppercase tracking-[0.15em] text-green-700">
            Completed
          </p>

          <p className="mt-1 text-3xl font-black">
            {completedCount}
          </p>

        </div>

      </div>

      {message && (
        <div className="mt-6 border border-[#d8d3cb] bg-white p-4 text-sm font-semibold text-[#171717]">
          {message}
        </div>
      )}

      {/* INQUIRIES */}
      <div className="mt-8 space-y-6">

        {inquiries.length > 0 ? (

          inquiries.map(
            (inquiry) => (

              <article
                key={inquiry.id}
                className="border border-[#e2ddd5] bg-white shadow-sm"
              >

                {/* TOP */}
                <div className="border-b border-[#eee9e2] p-6">

                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">

                    <div>

                      <div className="flex flex-wrap items-center gap-3">

                        <h2 className="text-xl font-black uppercase text-[#171717]">
                          {inquiry.full_name}
                        </h2>

                        <span
                          className={`px-3 py-1 text-xs font-black uppercase tracking-wide ${statusClasses(
                            inquiry.status
                          )}`}
                        >
                          {statusLabel(
                            inquiry.status
                          )}
                        </span>

                      </div>

                      <p className="mt-2 text-sm text-[#625d56]">
                        Received{" "}
                        {formatDate(
                          inquiry.created_at
                        )}
                      </p>

                    </div>

                    <div className="text-sm lg:text-right">

                      <a
                        href={`mailto:${inquiry.email}`}
                        className="font-bold text-[#941f25] hover:underline"
                      >
                        {inquiry.email}
                      </a>

                      {inquiry.phone && (
                        <p className="mt-1">
                          <a
                            href={`tel:${inquiry.phone}`}
                            className="text-[#625d56] hover:text-[#941f25]"
                          >
                            {inquiry.phone}
                          </a>
                        </p>
                      )}

                    </div>

                  </div>

                </div>

                {/* DETAILS */}
                <div className="grid gap-8 p-6 lg:grid-cols-[1fr_0.85fr]">

                  <div>

                    <div className="grid gap-5 sm:grid-cols-2">

                      <div>

                        <p className="text-xs font-black uppercase tracking-wide text-[#8a847c]">
                          Inquiry Type
                        </p>

                        <p className="mt-1 font-bold text-[#171717]">
                          {inquiry.inquiry_type}
                        </p>

                      </div>

                      <div>

                        <p className="text-xs font-black uppercase tracking-wide text-[#8a847c]">
                          Organization
                        </p>

                        <p className="mt-1 font-bold text-[#171717]">
                          {inquiry.organization ||
                            "—"}
                        </p>

                      </div>

                      <div>

                        <p className="text-xs font-black uppercase tracking-wide text-[#8a847c]">
                          Country
                        </p>

                        <p className="mt-1 font-bold text-[#171717]">
                          {inquiry.country ||
                            "—"}
                        </p>

                      </div>

                      <div>

                        <p className="text-xs font-black uppercase tracking-wide text-[#8a847c]">
                          Handled
                        </p>

                        <p className="mt-1 font-bold text-[#171717]">
                          {formatDate(
                            inquiry.handled_at
                          )}
                        </p>

                      </div>

                    </div>

                    <div className="mt-6">

                      <p className="text-xs font-black uppercase tracking-wide text-[#8a847c]">
                        Message
                      </p>

                      <div className="mt-2 border-l-4 border-[#c6a24a] bg-[#f7f4ef] p-5 leading-7 text-[#625d56]">
                        {inquiry.message}
                      </div>

                    </div>

                  </div>

                  {/* WORKFLOW */}
                  <div className="border border-[#e2ddd5] bg-[#faf8f4] p-5">

                    <p className="text-xs font-black uppercase tracking-[0.16em] text-[#941f25]">
                      Admin Workflow
                    </p>

                    <div className="mt-5">

                      <label className="text-xs font-black uppercase tracking-wide text-[#625d56]">
                        Status
                      </label>

                      <select
                        value={
                          inquiry.status
                        }
                        onChange={(event) =>
                          updateLocalInquiry(
                            inquiry.id,
                            "status",
                            event.target.value
                          )
                        }
                        className="mt-2 w-full border border-[#d8d3cb] bg-white px-4 py-3 font-semibold outline-none focus:border-[#941f25]"
                      >

                        <option value="new">
                          New
                        </option>

                        <option value="in_progress">
                          In Progress
                        </option>

                        <option value="completed">
                          Completed
                        </option>

                      </select>

                    </div>

                    <div className="mt-5">

                      <label className="text-xs font-black uppercase tracking-wide text-[#625d56]">
                        Admin Notes
                      </label>

                      <textarea
                        rows={6}
                        value={
                          inquiry.admin_notes ||
                          ""
                        }
                        onChange={(event) =>
                          updateLocalInquiry(
                            inquiry.id,
                            "admin_notes",
                            event.target.value
                          )
                        }
                        placeholder="Add internal follow-up notes..."
                        className="mt-2 w-full border border-[#d8d3cb] bg-white px-4 py-3 leading-6 outline-none focus:border-[#941f25]"
                      />

                    </div>

                    <button
                      type="button"
                      disabled={
                        savingId ===
                        inquiry.id
                      }
                      onClick={() =>
                        saveInquiry(
                          inquiry
                        )
                      }
                      className="mt-5 w-full bg-[#c6a24a] px-5 py-3 text-xs font-black uppercase tracking-wide text-[#171717] transition hover:bg-[#b08d39] disabled:opacity-60"
                    >
                      {savingId ===
                      inquiry.id
                        ? "Saving..."
                        : "Save Inquiry"}
                    </button>

                    {isSuperAdmin && (
                      <button
                        type="button"
                        onClick={() =>
                          deleteInquiry(
                            inquiry
                          )
                        }
                        className="mt-3 w-full border border-red-300 bg-red-50 px-5 py-3 text-xs font-black uppercase tracking-wide text-red-700 transition hover:bg-red-700 hover:text-white"
                      >
                        Permanent Delete
                      </button>
                    )}

                  </div>

                </div>

              </article>

            )
          )

        ) : (

          <div className="border border-[#e2ddd5] bg-white p-8">

            <p className="font-bold text-[#625d56]">
              No contact inquiries found.
            </p>

          </div>

        )}

      </div>

    </main>
  );
}