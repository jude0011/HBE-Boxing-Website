import { NextResponse } from "next/server";
import { Resend } from "resend";

function escapeHtml(value: unknown) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function POST(request: Request) {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    const hbeEmail = process.env.HBE_APPLICATION_EMAIL;
    const fromEmail = process.env.HBE_FROM_EMAIL;

    if (!apiKey || !hbeEmail || !fromEmail) {
      console.error("Missing email environment variables.");

      return NextResponse.json(
        {
          success: false,
          message: "Email configuration is incomplete.",
        },
        { status: 500 }
      );
    }

    const resend = new Resend(apiKey);

    const body = await request.json();

    const {
      first_name,
      last_name,
      nickname,
      date_of_birth,
      gender,
      email,
      phone,
      country,
      state_region,
      hometown,
      division,
      boxer_level,
      wins,
      losses,
      draws,
      knockouts,
      gym,
      trainer,
      instagram_url,
      facebook_url,
      boxing_bio,
      why_hbe,
    } = body;

    if (!first_name || !last_name || !email) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required applicant information.",
        },
        { status: 400 }
      );
    }

    const safeFirstName = escapeHtml(first_name);
    const safeLastName = escapeHtml(last_name);
    const safeNickname = escapeHtml(nickname);
    const safeDateOfBirth = escapeHtml(date_of_birth);
    const safeGender = escapeHtml(gender);
    const safeEmail = escapeHtml(email);
    const safePhone = escapeHtml(phone);
    const safeCountry = escapeHtml(country);
    const safeStateRegion = escapeHtml(state_region);
    const safeHometown = escapeHtml(hometown);
    const safeDivision = escapeHtml(division);
    const safeBoxerLevel = escapeHtml(boxer_level);
    const safeGym = escapeHtml(gym);
    const safeTrainer = escapeHtml(trainer);
    const safeInstagram = escapeHtml(instagram_url);
    const safeFacebook = escapeHtml(facebook_url);
    const safeBoxingBio = escapeHtml(boxing_bio);
    const safeWhyHbe = escapeHtml(why_hbe);

    const safeWins = Number(wins ?? 0);
    const safeLosses = Number(losses ?? 0);
    const safeDraws = Number(draws ?? 0);
    const safeKnockouts = Number(knockouts ?? 0);

    const fullName = `${safeFirstName} ${safeLastName}`;

    /*
      EMAIL 1:
      NOTIFICATION TO HBE
    */
    const { error: hbeEmailError } = await resend.emails.send({
      from: `Heritage Boxing Entertainment <${fromEmail}>`,
      to: [hbeEmail],
      subject: `New HBE Boxer Application — ${fullName}`,
      html: `
        <div style="font-family: Arial, Helvetica, sans-serif; color: #171717; max-width: 700px; margin: 0 auto;">

          <div style="border-top: 5px solid #941f25; padding-top: 24px;">
            <p style="font-size: 12px; text-transform: uppercase; letter-spacing: 2px; font-weight: bold; color: #941f25;">
              Heritage Boxing Entertainment
            </p>

            <h1 style="font-size: 28px; margin-bottom: 8px;">
              New Boxer Application
            </h1>

            <p style="color: #666; line-height: 1.7;">
              A new fighter has submitted an application to join Heritage Boxing Entertainment.
            </p>
          </div>

          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;" />

          <h2 style="font-size: 20px;">
            Applicant Information
          </h2>

          <p><strong>Name:</strong> ${fullName}</p>

          <p>
            <strong>Ring Name / Nickname:</strong>
            ${safeNickname || "Not provided"}
          </p>

          <p>
            <strong>Date of Birth:</strong>
            ${safeDateOfBirth || "Not provided"}
          </p>

          <p>
            <strong>Gender:</strong>
            ${safeGender || "Not provided"}
          </p>

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
            <strong>State / Region:</strong>
            ${safeStateRegion || "Not provided"}
          </p>

          <p>
            <strong>Hometown:</strong>
            ${safeHometown || "Not provided"}
          </p>

          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;" />

          <h2 style="font-size: 20px;">
            Boxing Information
          </h2>

          <p>
            <strong>Division:</strong>
            ${safeDivision || "Not provided"}
          </p>

          <p>
            <strong>Level:</strong>
            ${safeBoxerLevel || "Not provided"}
          </p>

          <p>
            <strong>Record:</strong>
            ${safeWins} Wins /
            ${safeLosses} Losses /
            ${safeDraws} Draws
          </p>

          <p>
            <strong>Knockouts:</strong>
            ${safeKnockouts}
          </p>

          <p>
            <strong>Gym:</strong>
            ${safeGym || "Not provided"}
          </p>

          <p>
            <strong>Trainer:</strong>
            ${safeTrainer || "Not provided"}
          </p>

          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;" />

          <h2 style="font-size: 20px;">
            Boxing Career
          </h2>

          <p style="line-height: 1.7; white-space: pre-line;">
            ${safeBoxingBio || "Not provided"}
          </p>

          <h2 style="font-size: 20px; margin-top: 30px;">
            Why They Want To Join HBE
          </h2>

          <p style="line-height: 1.7; white-space: pre-line;">
            ${safeWhyHbe || "Not provided"}
          </p>

          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;" />

          <h2 style="font-size: 20px;">
            Social Media
          </h2>

          <p>
            <strong>Instagram:</strong>
            ${safeInstagram || "Not provided"}
          </p>

          <p>
            <strong>Facebook:</strong>
            ${safeFacebook || "Not provided"}
          </p>

          <div style="margin-top: 35px; background: #f7f4ef; border-left: 4px solid #c6a24a; padding: 20px;">
            <strong>Status:</strong> Pending Review
          </div>

        </div>
      `,
    });

    if (hbeEmailError) {
      console.error(
        "HBE notification email error:",
        hbeEmailError
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "Application was received, but the HBE notification email could not be sent.",
        },
        { status: 500 }
      );
    }

    /*
      EMAIL 2:
      CONFIRMATION TO APPLICANT
    */
    const { error: applicantEmailError } =
      await resend.emails.send({
        from: `Heritage Boxing Entertainment <${fromEmail}>`,
        to: [email],
        subject:
          "Your HBE Boxer Application Has Been Received",
        html: `
          <div style="font-family: Arial, Helvetica, sans-serif; color: #171717; max-width: 650px; margin: 0 auto;">

            <div style="border-top: 5px solid #941f25; padding-top: 24px;">

              <p style="font-size: 12px; text-transform: uppercase; letter-spacing: 2px; font-weight: bold; color: #941f25;">
                Heritage Boxing Entertainment
              </p>

              <h1 style="font-size: 28px; line-height: 1.2;">
                Thank You For Applying To HBE
              </h1>

            </div>

            <p style="font-size: 16px; line-height: 1.8;">
              Hello ${safeFirstName},
            </p>

            <p style="font-size: 16px; line-height: 1.8;">
              Thank you for applying to Heritage Boxing Entertainment.
              Your application has been received and is currently under review.
            </p>

            <p style="font-size: 16px; line-height: 1.8;">
              Our team will review the information you submitted.
              If additional information is needed, a member of the HBE team
              may contact you using the information provided in your application.
            </p>

            <div style="margin: 30px 0; background: #f7f4ef; border-left: 4px solid #c6a24a; padding: 20px;">
              <p style="margin: 0;">
                <strong>Application Status:</strong>
                Pending Review
              </p>
            </div>

            <p style="font-size: 14px; line-height: 1.7; color: #666;">
              Please note that submitting an application does not guarantee
              acceptance or publication as an official HBE boxer.
            </p>

            <p style="font-size: 16px; line-height: 1.8; margin-top: 30px;">
              Heritage Boxing Entertainment
            </p>

          </div>
        `,
      });

    if (applicantEmailError) {
      console.error(
        "Applicant confirmation email error:",
        applicantEmailError
      );

      return NextResponse.json({
        success: true,
        confirmationEmailSent: false,
        message:
          "HBE received the application, but the applicant confirmation email could not be sent.",
      });
    }

    return NextResponse.json({
      success: true,
      confirmationEmailSent: true,
      message:
        "HBE notification and applicant confirmation emails were sent successfully.",
    });
  } catch (error) {
    console.error(
      "Boxer application API error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Something went wrong while processing the email notification.",
      },
      { status: 500 }
    );
  }
}