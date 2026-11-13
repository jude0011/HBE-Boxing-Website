"use client";

import {
  ClipboardEvent,
  FormEvent,
  KeyboardEvent,
  useMemo,
  useRef,
  useState,
} from "react";

import Link from "next/link";
import {
  useRouter,
  useSearchParams,
} from "next/navigation";

import { createClient } from "@/app/lib/supabase/client";

const CODE_LENGTH = 6;

export default function ResetPasswordPage() {
  const supabase =
    useMemo(
      () => createClient(),
      []
    );

  const router =
    useRouter();

  const searchParams =
    useSearchParams();

  const inputRefs =
    useRef<
      Array<HTMLInputElement | null>
    >([]);

  const initialEmail =
    (
      searchParams.get(
        "email"
      ) ||
      ""
    )
      .trim()
      .toLowerCase();

  const [
    email,
    setEmail,
  ] =
    useState(
      initialEmail
    );

  const [
    digits,
    setDigits,
  ] =
    useState<string[]>(
      Array(CODE_LENGTH).fill("")
    );

  const [
    verified,
    setVerified,
  ] =
    useState(false);

  const [
    verifying,
    setVerifying,
  ] =
    useState(false);

  const [
    saving,
    setSaving,
  ] =
    useState(false);

  const [
    newPassword,
    setNewPassword,
  ] =
    useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] =
    useState("");

  const [
    message,
    setMessage,
  ] =
    useState("");

  const [
    errorMessage,
    setErrorMessage,
  ] =
    useState("");

  const token =
    digits.join("");

  function focusBox(
    index: number
  ) {
    inputRefs.current[
      index
    ]?.focus();
  }

  function updateDigit(
    index: number,
    value: string
  ) {
    const number =
      value
        .replace(
          /\D/g,
          ""
        )
        .slice(-1);

    const next =
      [...digits];

    next[index] =
      number;

    setDigits(
      next
    );

    setErrorMessage("");
    setMessage("");

    if (
      number &&
      index <
        CODE_LENGTH - 1
    ) {
      focusBox(
        index + 1
      );
    }
  }

  function handleKeyDown(
    index: number,
    event:
      KeyboardEvent<HTMLInputElement>
  ) {
    if (
      event.key ===
        "Backspace" &&
      !digits[index] &&
      index > 0
    ) {
      focusBox(
        index - 1
      );
    }

    if (
      event.key ===
        "ArrowLeft" &&
      index > 0
    ) {
      event.preventDefault();
      focusBox(
        index - 1
      );
    }

    if (
      event.key ===
        "ArrowRight" &&
      index <
        CODE_LENGTH - 1
    ) {
      event.preventDefault();
      focusBox(
        index + 1
      );
    }
  }

  function handlePaste(
    event:
      ClipboardEvent<HTMLInputElement>
  ) {
    event.preventDefault();

    const pasted =
      event.clipboardData
        .getData("text")
        .replace(
          /\D/g,
          ""
        )
        .slice(
          0,
          CODE_LENGTH
        );

    if (!pasted) {
      return;
    }

    const next =
      Array(
        CODE_LENGTH
      ).fill("");

    pasted
      .split("")
      .forEach(
        (
          value,
          index
        ) => {
          next[index] =
            value;
        }
      );

    setDigits(
      next
    );

    const focusIndex =
      Math.min(
        pasted.length,
        CODE_LENGTH
      ) - 1;

    focusBox(
      Math.max(
        focusIndex,
        0
      )
    );
  }

  async function verifyCode(
    event:
      FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const cleanEmail =
      email
        .trim()
        .toLowerCase();

    if (!cleanEmail) {
      setErrorMessage(
        "Enter the administrator email address that received the code."
      );
      return;
    }

    if (
      token.length !==
      CODE_LENGTH
    ) {
      setErrorMessage(
        "Enter all 6 digits of the reset code."
      );
      return;
    }

    setVerifying(true);
    setErrorMessage("");
    setMessage("");

    const {
      data,
      error,
    } =
      await supabase.auth
        .verifyOtp({
          email:
            cleanEmail,
          token,
          type:
            "recovery",
        });

    if (
      error ||
      !data.user
    ) {
      console.error(
        "Recovery code verification error:",
        error
      );

      setErrorMessage(
        "That reset code is invalid or has expired. Request a new code and try again."
      );

      setVerifying(false);
      return;
    }

    /*
      ADMIN-ONLY SAFETY CHECK
    */
    const {
      data:
        adminUser,
      error:
        adminError,
    } =
      await supabase
        .from(
          "admin_users"
        )
        .select(
          "id, role"
        )
        .eq(
          "id",
          data.user.id
        )
        .maybeSingle();

    if (
      adminError ||
      !adminUser
    ) {
      await supabase.auth
        .signOut();

      setErrorMessage(
        "This account is not authorized for HBE administration."
      );

      setVerifying(false);
      return;
    }

    setVerified(true);

    setMessage(
      "Code verified. You can now create your new HBE admin password."
    );

    setVerifying(false);
  }

  async function updatePassword(
    event:
      FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setErrorMessage("");
    setMessage("");

    if (
      newPassword.length <
      8
    ) {
      setErrorMessage(
        "Your new password must be at least 8 characters."
      );
      return;
    }

    if (
      newPassword !==
      confirmPassword
    ) {
      setErrorMessage(
        "The two passwords do not match."
      );
      return;
    }

    setSaving(true);

    const {
      error,
    } =
      await supabase.auth
        .updateUser({
          password:
            newPassword,
        });

    if (error) {
      console.error(
        "Password update error:",
        error
      );

      setErrorMessage(
        error.message
      );

      setSaving(false);
      return;
    }

    /*
      Clear the recovery session so the
      admin signs in normally afterward.
    */
    await supabase.auth
      .signOut();

    sessionStorage.removeItem(
      "hbe_reset_email"
    );

    setMessage(
      "Password changed successfully. Returning to HBE Admin Login..."
    );

    setSaving(false);

    setTimeout(
      () => {
        router.replace(
          "/admin/login"
        );
      },
      1200
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f4ef] px-4 py-12 text-[#171717]">

      <section className="w-full max-w-[590px] overflow-hidden border border-[#e1ddd6] bg-white shadow-[0_22px_60px_rgba(0,0,0,0.12)]">

        {/* HBE HEADER */}
        <div className="relative overflow-hidden border-b-4 border-[#c6a24a] bg-[#941f25] px-8 py-9 sm:px-10">

          <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full border-[18px] border-white/5" />

          <div className="absolute -bottom-16 right-16 h-32 w-32 rounded-full border-[14px] border-[#c6a24a]/10" />

          <div className="relative">

            <p className="text-xs font-black uppercase tracking-[0.32em] text-[#c6a24a]">
              Heritage Boxing Entertainment
            </p>

            <h1 className="mt-2 text-3xl font-black uppercase text-white">
              Password Recovery
            </h1>

          </div>

        </div>

        <div className="px-8 py-10 sm:px-10">

          {!verified ? (
            <>

              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#941f25]">
                Security Check
              </p>

              <h2 className="mt-3 text-3xl font-black uppercase">
                Enter Your Code
              </h2>

              <div className="mt-4 h-1 w-16 bg-[#c6a24a]" />

              <p className="mt-5 leading-7 text-[#625d56]">
                Enter the 6-digit code sent to your administrator email.
              </p>

              <form
                onSubmit={
                  verifyCode
                }
                className="mt-8"
              >

                <label
                  htmlFor="recovery_email"
                  className="block text-xs font-black uppercase tracking-[0.12em] text-[#625d56]"
                >
                  Administrator Email
                </label>

                <input
                  id="recovery_email"
                  type="email"
                  required
                  value={email}
                  onChange={(
                    event
                  ) =>
                    setEmail(
                      event.target.value
                    )
                  }
                  className="mt-2 w-full border border-[#d8d2ca] bg-white px-4 py-4 outline-none transition focus:border-[#941f25]"
                />

                {/* FUN / INTERACTIVE 6-DIGIT CODE UI */}
                <div className="mt-8">

                  <p className="text-xs font-black uppercase tracking-[0.12em] text-[#625d56]">
                    6-Digit Reset Code
                  </p>

                  <div className="mt-3 grid grid-cols-6 gap-2 sm:gap-3">

                    {digits.map(
                      (
                        digit,
                        index
                      ) => (

                        <input
                          key={index}
                          ref={(
                            element
                          ) => {
                            inputRefs.current[
                              index
                            ] =
                              element;
                          }}
                          type="text"
                          inputMode="numeric"
                          autoComplete={
                            index === 0
                              ? "one-time-code"
                              : "off"
                          }
                          maxLength={1}
                          value={digit}
                          onChange={(
                            event
                          ) =>
                            updateDigit(
                              index,
                              event.target.value
                            )
                          }
                          onKeyDown={(
                            event
                          ) =>
                            handleKeyDown(
                              index,
                              event
                            )
                          }
                          onPaste={
                            handlePaste
                          }
                          aria-label={`Reset code digit ${
                            index + 1
                          }`}
                          className={`aspect-square w-full border-2 text-center text-2xl font-black outline-none transition-all duration-200 sm:text-3xl ${
                            digit
                              ? "scale-[1.04] border-[#c6a24a] bg-[#fffaf0] text-[#941f25] shadow-[0_5px_16px_rgba(198,162,74,0.20)]"
                              : "border-[#d8d2ca] bg-white text-[#171717] focus:-translate-y-1 focus:border-[#941f25] focus:shadow-[0_7px_18px_rgba(148,31,37,0.14)]"
                          }`}
                        />

                      )
                    )}

                  </div>

                  <div className="mt-4 flex items-center gap-3">

                    <div
                      className={`h-2 flex-1 overflow-hidden rounded-full bg-[#eee9e2]`}
                    >
                      <div
                        className="h-full bg-[#c6a24a] transition-all duration-300"
                        style={{
                          width:
                            `${(
                              token.length /
                              CODE_LENGTH
                            ) *
                              100}%`,
                        }}
                      />
                    </div>

                    <span className="text-xs font-black text-[#817a73]">
                      {token.length}/6
                    </span>

                  </div>

                </div>

                <button
                  type="submit"
                  disabled={
                    verifying ||
                    token.length !==
                      CODE_LENGTH
                  }
                  className="mt-8 flex min-h-[58px] w-full items-center justify-center bg-[#941f25] px-6 py-4 text-sm font-black uppercase tracking-[0.12em] text-white transition hover:bg-[#74181d] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {verifying
                    ? "Verifying Code..."
                    : "Verify Reset Code"}
                </button>

              </form>

            </>
          ) : (
            <>

              {/* SMALL CELEBRATION / SUCCESS ANIMATION */}
              <div className="flex justify-center">

                <div className="relative flex h-24 w-24 items-center justify-center">

                  <div className="absolute inset-0 animate-ping rounded-full border-2 border-[#c6a24a]/30" />

                  <div className="absolute inset-2 rounded-full border-4 border-[#c6a24a]" />

                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#941f25] text-3xl font-black text-white shadow-lg">
                    ✓
                  </div>

                </div>

              </div>

              <p className="mt-6 text-center text-xs font-black uppercase tracking-[0.22em] text-[#941f25]">
                Identity Verified
              </p>

              <h2 className="mt-3 text-center text-3xl font-black uppercase">
                Create New Password
              </h2>

              <p className="mx-auto mt-4 max-w-md text-center leading-7 text-[#625d56]">
                Your verification code was accepted. Choose a new password for your HBE administrator account.
              </p>

              <form
                onSubmit={
                  updatePassword
                }
                className="mt-8"
              >

                <label
                  htmlFor="new_password"
                  className="block text-xs font-black uppercase tracking-[0.12em] text-[#625d56]"
                >
                  New Password
                </label>

                <input
                  id="new_password"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={8}
                  value={
                    newPassword
                  }
                  onChange={(
                    event
                  ) =>
                    setNewPassword(
                      event.target.value
                    )
                  }
                  className="mt-2 w-full border border-[#d8d2ca] bg-white px-4 py-4 text-lg outline-none transition focus:border-[#941f25]"
                />

                <label
                  htmlFor="confirm_password"
                  className="mt-6 block text-xs font-black uppercase tracking-[0.12em] text-[#625d56]"
                >
                  Confirm New Password
                </label>

                <input
                  id="confirm_password"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={8}
                  value={
                    confirmPassword
                  }
                  onChange={(
                    event
                  ) =>
                    setConfirmPassword(
                      event.target.value
                    )
                  }
                  className="mt-2 w-full border border-[#d8d2ca] bg-white px-4 py-4 text-lg outline-none transition focus:border-[#941f25]"
                />

                <button
                  type="submit"
                  disabled={saving}
                  className="mt-8 flex min-h-[58px] w-full items-center justify-center bg-[#941f25] px-6 py-4 text-sm font-black uppercase tracking-[0.12em] text-white transition hover:bg-[#74181d] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving
                    ? "Saving Password..."
                    : "Save New Password"}
                </button>

              </form>

            </>
          )}

          {message && (

            <div className="mt-6 border border-green-200 bg-green-50 p-5 text-sm font-semibold leading-6 text-green-800">
              {message}
            </div>

          )}

          {errorMessage && (

            <div className="mt-6 border border-red-200 bg-red-50 p-5 text-sm font-semibold leading-6 text-red-800">
              {errorMessage}
            </div>

          )}

          {!verified && (

            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-[#e5e0d8] pt-6">

              <Link
                href="/admin/forgot-password"
                className="text-sm font-black uppercase tracking-wide text-[#941f25] hover:text-[#74181d]"
              >
                Send New Code
              </Link>

              <Link
                href="/admin/login"
                className="text-sm font-black uppercase tracking-wide text-[#625d56] hover:text-[#171717]"
              >
                Back To Login
              </Link>

            </div>

          )}

        </div>

      </section>

    </main>
  );
}
