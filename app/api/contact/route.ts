import { NextResponse } from "next/server";
import { Resend } from "resend";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export async function POST(request: Request) {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.HBE_FROM_EMAIL;
    const contactEmail =
      process.env.HBE_CONTACT_EMAIL ||
      "hbeboxing@gmail.com";

    if (!apiKey || !fromEmail) {
      console.error(
        "Missing RESEND_API_KEY or HBE_FROM_EMAIL"
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "Email service is not configured.",
        },
        { status: 500 }
      );
    }

    const resend = new Resend(apiKey);

    const body = await request.json();

    const fullName =
      typeof body.full_name === "string"
        ? body.full_name.trim()
        : "";

    const email =
      typeof body.email === "string"
        ? body.email.trim()
        : "";

    const phone =
      typeof body.phone === "string"
        ? body.phone.trim()
        : "";

    const country =
      typeof body.country === "string"
        ? body.country.trim()
        : "";

    const organization =
      typeof body.organization === "string"
        ? body.organization.trim()
        : "";

    const inquiryType =
      typeof body.inquiry_type === "string"
        ? body.inquiry_type.trim()
        : "";

    const message =
      typeof body.message === "string"
        ? body.message.trim()
        : "";

    if (
      !fullName ||
      !email ||
      !inquiryType ||
      !message
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please complete all required fields.",
        },
        { status: 400 }
      );
    }

    const safeName = escapeHtml(fullName);
    const safeEmail = escapeHtml(email);
    const safePhone = escapeHtml(phone);
    const safeCountry = escapeHtml(country);
    const safeOrganization =
      escapeHtml(organization);
    const safeInquiryType =
      escapeHtml(inquiryType);
    const safeMessage = escapeHtml(message);

    /*
      EMAIL #1:
      SEND CONTACT INQUIRY TO HBE
    */
    const hbeEmail = await resend.emails.send({
      from: fromEmail,
      to: contactEmail,
      subject: `New HBE Contact Inquiry - ${fullName}`,
      replyTo: email,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:700px;margin:auto;color:#171717;">
          <h1 style="color:#941f25;">
            New HBE Contact Inquiry
          </h1>

          <p>
            A new message has been submitted through the
            Heritage Boxing Entertainment website.
          </p>

          <hr style="border:none;border-top:1px solid #ddd;margin:25px 0;" />

          <p><strong>Name:</strong> ${safeName}</p>

          <p><strong>Email:</strong> ${safeEmail}</p>

          <p>
            <strong>Phone:</strong>
            ${safePhone || "Not provided"}
          </p>

          <p>
            <strong>Country:</strong>
            ${safeCountry || "Not provided"}
          </p>

          <p>
            <strong>Organization / Company:</strong>
            ${safeOrganization || "Not provided"}
          </p>

          <p>
            <strong>Inquiry Type:</strong>
            ${safeInquiryType}
          </p>

          <hr style="border:none;border-top:1px solid #ddd;margin:25px 0;" />

          <p><strong>Message:</strong></p>

          <p style="white-space:pre-wrap;line-height:1.7;">
            ${safeMessage}
          </p>

          <hr style="border:none;border-top:1px solid #ddd;margin:25px 0;" />

          <p style="font-size:13px;color:#666;">
            Heritage Boxing Entertainment Website
          </p>
        </div>
      `,
    });

    if (hbeEmail.error) {
      console.error(
        "HBE contact email error:",
        hbeEmail.error
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "Unable to send contact notification.",
        },
        { status: 500 }
      );
    }

    /*
      EMAIL #2:
      CONFIRMATION TO PERSON WHO CONTACTED HBE
    */
    const confirmationEmail =
      await resend.emails.send({
        from: fromEmail,
        to: email,
        subject:
          "Heritage Boxing Entertainment - Message Received",
        html: `
          <div style="font-family:Arial,sans-serif;max-width:700px;margin:auto;color:#171717;">
            <h1 style="color:#941f25;">
              Heritage Boxing Entertainment
            </h1>

            <p>Dear ${safeName},</p>

            <p>
              Thank you for contacting Heritage Boxing
              Entertainment.
            </p>

            <p>
              Your message has been received by the HBE
              team and is currently under review.
            </p>

            <p>
              If your inquiry requires a response, a member
              of the HBE team will contact you using the
              information you provided.
            </p>

            <p style="margin-top:30px;">
              Heritage Boxing Entertainment
              <br />
              Africa To The World
            </p>

            <hr style="border:none;border-top:1px solid #ddd;margin:25px 0;" />

            <p style="font-size:13px;color:#666;">
              This is an automated confirmation that your
              website inquiry was received.
            </p>
          </div>
        `,
      });

    if (confirmationEmail.error) {
      console.error(
        "Contact confirmation email error:",
        confirmationEmail.error
      );
    }

    return NextResponse.json(
      {
        success: true,
        message:
          "Your message has been sent successfully.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "Contact form API error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to process your message.",
      },
      { status: 500 }
    );
  }
}