"use client";

import { FormEvent, useState } from "react";
import { supabase } from "@/app/lib/supabase";

export default function ContactForm() {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setSubmitting(true);
    setSuccess("");
    setErrorMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    const inquiry = {
      full_name: String(
        formData.get("full_name") || ""
      ).trim(),

      email: String(
        formData.get("email") || ""
      ).trim(),

      phone: String(
        formData.get("phone") || ""
      ).trim(),

      country: String(
        formData.get("country") || ""
      ).trim(),

      organization: String(
        formData.get("organization") || ""
      ).trim(),

      inquiry_type: String(
        formData.get("inquiry_type") || ""
      ).trim(),

      message: String(
        formData.get("message") || ""
      ).trim(),
    };

    try {
      /* SAVE TO SUPABASE */
      const { error } = await supabase
        .from("contact_inquiries")
        .insert(inquiry);

      if (error) {
        console.error(
          "Supabase contact error:",
          error
        );

        throw new Error(
          "Unable to save your inquiry."
        );
      }

      /* SEND EMAIL */
      const response = await fetch(
        "/api/contact",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(inquiry),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Unable to send your message."
        );
      }

      setSuccess(
        "Thank you. Your message has been sent to Heritage Boxing Entertainment."
      );

      form.reset();
    } catch (error) {
      console.error(
        "Contact submission error:",
        error
      );

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-10 space-y-6"
    >
      {/* FULL NAME */}
      <div>
        <label
          htmlFor="full_name"
          className="mb-2 block text-sm font-black uppercase tracking-wide"
        >
          Full Name
        </label>

        <input
          id="full_name"
          name="full_name"
          type="text"
          required
          className="w-full border border-[#d8d2ca] bg-white px-4 py-4 outline-none transition focus:border-[#941f25]"
        />
      </div>

      {/* EMAIL + PHONE */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-black uppercase tracking-wide"
          >
            Email
          </label>

          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full border border-[#d8d2ca] bg-white px-4 py-4 outline-none transition focus:border-[#941f25]"
          />
        </div>

        <div>
          <label
            htmlFor="phone"
            className="mb-2 block text-sm font-black uppercase tracking-wide"
          >
            Phone
          </label>

          <input
            id="phone"
            name="phone"
            type="tel"
            className="w-full border border-[#d8d2ca] bg-white px-4 py-4 outline-none transition focus:border-[#941f25]"
          />
        </div>
      </div>

      {/* COUNTRY + ORGANIZATION */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label
            htmlFor="country"
            className="mb-2 block text-sm font-black uppercase tracking-wide"
          >
            Country
          </label>

          <input
            id="country"
            name="country"
            type="text"
            className="w-full border border-[#d8d2ca] bg-white px-4 py-4 outline-none transition focus:border-[#941f25]"
          />
        </div>

        <div>
          <label
            htmlFor="organization"
            className="mb-2 block text-sm font-black uppercase tracking-wide"
          >
            Organization / Company
          </label>

          <input
            id="organization"
            name="organization"
            type="text"
            className="w-full border border-[#d8d2ca] bg-white px-4 py-4 outline-none transition focus:border-[#941f25]"
          />
        </div>
      </div>

      {/* INQUIRY TYPE */}
      <div>
        <label
          htmlFor="inquiry_type"
          className="mb-2 block text-sm font-black uppercase tracking-wide"
        >
          Inquiry Type
        </label>

        <select
          id="inquiry_type"
          name="inquiry_type"
          required
          defaultValue=""
          className="w-full border border-[#d8d2ca] bg-white px-4 py-4 outline-none transition focus:border-[#941f25]"
        >
          <option value="" disabled>
            Select Inquiry Type
          </option>

          <option value="General Inquiry">
            General Inquiry
          </option>

          <option value="Fighter / Boxer Inquiry">
            Fighter / Boxer Inquiry
          </option>

          <option value="Event Inquiry">
            Event Inquiry
          </option>

          <option value="Sponsorship">
            Sponsorship
          </option>

          <option value="Commercial Partnership">
            Commercial Partnership
          </option>

          <option value="Media / Press">
            Media / Press
          </option>

          <option value="Broadcast Opportunity">
            Broadcast Opportunity
          </option>

          <option value="Promoter / Boxing Organization">
            Promoter / Boxing Organization
          </option>

          <option value="Other">
            Other
          </option>
        </select>
      </div>

      {/* MESSAGE */}
      <div>
        <label
          htmlFor="message"
          className="mb-2 block text-sm font-black uppercase tracking-wide"
        >
          Message
        </label>

        <textarea
          id="message"
          name="message"
          rows={7}
          required
          className="w-full resize-none border border-[#d8d2ca] bg-white px-4 py-4 outline-none transition focus:border-[#941f25]"
        />
      </div>

      {/* SUCCESS */}
      {success && (
        <div className="border border-green-200 bg-green-50 p-4 text-sm font-semibold text-green-800">
          {success}
        </div>
      )}

      {/* ERROR */}
      {errorMessage && (
        <div className="border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-800">
          {errorMessage}
        </div>
      )}

      {/* BUTTON */}
      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-[#941f25] px-7 py-4 text-sm font-black uppercase tracking-wide text-white transition hover:bg-[#74181d] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {submitting
          ? "Sending..."
          : "Send Message"}
      </button>
    </form>
  );
}