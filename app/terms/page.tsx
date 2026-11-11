import Link from "next/link";

export const metadata = {
  title: "Terms & Conditions | Heritage Boxing Entertainment",
  description:
    "Terms and Conditions governing use of the Heritage Boxing Entertainment website.",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white text-[#171717]">
      {/* HERO */}
      <section className="border-b border-[#e5e0d8] bg-[#f7f4ef]">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[#941f25] sm:text-sm">
            Heritage Boxing Entertainment
          </p>

          <h1 className="mt-4 text-4xl font-black uppercase leading-tight sm:text-5xl lg:text-6xl">
            Terms &amp; Conditions
          </h1>

          <div className="mt-6 h-1 w-20 bg-[#c6a24a]" />

          <p className="mt-7 max-w-3xl text-base leading-8 text-[#5f5b55] sm:text-lg">
            These Terms &amp; Conditions govern your use of the Heritage
            Boxing Entertainment website and related HBE online services.
          </p>

          <p className="mt-4 text-sm font-semibold text-[#6f6962]">
            Last Updated: October 25, 2026
          </p>
        </div>
      </section>

      {/* TERMS */}
      <section className="bg-white">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">

          <div className="space-y-12">

            {/* ACCEPTANCE */}
            <section>
              <h2 className="text-2xl font-black uppercase sm:text-3xl">
                1. Acceptance of Terms
              </h2>

              <p className="mt-5 leading-8 text-[#5f5b55]">
                By accessing or using the Heritage Boxing Entertainment
                website, you agree to these Terms &amp; Conditions and our
                Privacy Policy.
              </p>

              <p className="mt-4 leading-8 text-[#5f5b55]">
                If you do not agree with these Terms, you should not use the
                website or submit information through HBE online forms.
              </p>
            </section>

            {/* ABOUT HBE */}
            <section>
              <h2 className="text-2xl font-black uppercase sm:text-3xl">
                2. About Heritage Boxing Entertainment
              </h2>

              <p className="mt-5 leading-8 text-[#5f5b55]">
                Heritage Boxing Entertainment is a professional boxing
                organization and platform involved in areas that may include
                boxer development, championship recognition, events,
                rankings, media, promotional opportunities, partnerships and
                the advancement of professional boxing.
              </p>

              <p className="mt-4 leading-8 text-[#5f5b55]">
                Information presented on the website is intended to provide
                information about HBE, its fighters, events, championships,
                programs and commercial opportunities.
              </p>
            </section>

            {/* USE */}
            <section>
              <h2 className="text-2xl font-black uppercase sm:text-3xl">
                3. Permitted Use of the Website
              </h2>

              <p className="mt-5 leading-8 text-[#5f5b55]">
                You may use the HBE website for lawful personal,
                informational, professional and business purposes consistent
                with these Terms.
              </p>

              <p className="mt-4 leading-8 text-[#5f5b55]">
                You may not attempt to interfere with the website, gain
                unauthorized access to HBE systems, introduce malicious code,
                scrape or harvest information in violation of law, misuse
                another person&apos;s identity, submit fraudulent
                information, infringe intellectual property rights or use the
                website in a manner that could damage HBE or other users.
              </p>
            </section>

            {/* APPLICATIONS */}
            <section>
              <h2 className="text-2xl font-black uppercase sm:text-3xl">
                4. Boxer Applications
              </h2>

              <p className="mt-5 leading-8 text-[#5f5b55]">
                HBE may provide an online application through which
                professional or debut fighters may submit information for
                consideration.
              </p>

              <p className="mt-4 font-bold leading-8 text-[#171717]">
                Submitting an application does not guarantee acceptance,
                ranking, championship eligibility, bout placement,
                promotional representation, sponsorship, compensation or any
                contractual relationship with Heritage Boxing Entertainment.
              </p>

              <p className="mt-4 leading-8 text-[#5f5b55]">
                HBE reserves the right to accept, decline, request additional
                information from or discontinue review of an application in
                its reasonable discretion, subject to applicable law.
              </p>
            </section>

            {/* ACCURACY */}
            <section>
              <h2 className="text-2xl font-black uppercase sm:text-3xl">
                5. Accuracy of Information Submitted
              </h2>

              <p className="mt-5 leading-8 text-[#5f5b55]">
                If you submit information to HBE, you represent that the
                information is accurate to the best of your knowledge and
                that you have the right to provide it.
              </p>

              <p className="mt-4 leading-8 text-[#5f5b55]">
                Fighters are responsible for providing accurate information
                concerning their identity, fight history, record, division,
                photographs, trainer, gym, championship status and other
                information submitted to HBE.
              </p>
            </section>

            {/* BOXING RECORDS */}
            <section>
              <h2 className="text-2xl font-black uppercase sm:text-3xl">
                6. Boxer Records, Rankings and Championship Information
              </h2>

              <p className="mt-5 leading-8 text-[#5f5b55]">
                HBE endeavors to present accurate fighter, championship,
                ranking and event information. However, professional boxing
                records and historical information may require verification
                from fighters, officials, commissions, sanctioning
                organizations, record services or other sources.
              </p>

              <p className="mt-4 leading-8 text-[#5f5b55]">
                HBE may update, correct, supplement or remove information
                when more accurate or complete records become available.
              </p>

              <p className="mt-4 leading-8 text-[#5f5b55]">
                Website publication alone does not create a contractual right
                to a ranking, title, championship opportunity, bout or
                promotional relationship.
              </p>
            </section>

            {/* EVENTS */}
            <section>
              <h2 className="text-2xl font-black uppercase sm:text-3xl">
                7. Events and Fight Information
              </h2>

              <p className="mt-5 leading-8 text-[#5f5b55]">
                Event dates, venues, opponents, fight cards, officials,
                broadcast arrangements and other event information may
                change due to circumstances outside HBE&apos;s control.
              </p>

              <p className="mt-4 leading-8 text-[#5f5b55]">
                HBE may update or correct event information without prior
                notice. Any ticketing, broadcast or event-specific terms
                presented at the time of a transaction will also apply.
              </p>
            </section>

            {/* CONTENT */}
            <section>
              <h2 className="text-2xl font-black uppercase sm:text-3xl">
                8. Intellectual Property
              </h2>

              <p className="mt-5 leading-8 text-[#5f5b55]">
                Unless otherwise stated, the HBE website and its original
                content, branding, logos, graphics, page designs, written
                materials, videos, promotional materials and other HBE-owned
                content are protected by applicable intellectual property
                laws.
              </p>

              <p className="mt-4 leading-8 text-[#5f5b55]">
                You may not reproduce, distribute, sell, license, modify,
                publish or commercially exploit HBE-owned content without
                appropriate authorization.
              </p>

              <p className="mt-4 leading-8 text-[#5f5b55]">
                Names, logos, photographs, trademarks and other materials
                belonging to fighters, partners, sponsors or third parties
                remain the property of their respective owners.
              </p>
            </section>

            {/* SUBMITTED CONTENT */}
            <section>
              <h2 className="text-2xl font-black uppercase sm:text-3xl">
                9. Content Submitted to HBE
              </h2>

              <p className="mt-5 leading-8 text-[#5f5b55]">
                When you submit photographs, biographies, fight information
                or other materials to HBE, you represent that you have the
                necessary rights or permissions to submit those materials.
              </p>

              <p className="mt-4 leading-8 text-[#5f5b55]">
                If HBE approves a fighter, event, partner or other profile
                for publication, you authorize HBE to display approved
                submitted materials on the HBE website and HBE promotional
                channels for legitimate organizational, promotional and
                informational purposes, subject to any separate agreement
                between you and HBE.
              </p>

              <p className="mt-4 leading-8 text-[#5f5b55]">
                Nothing in these Terms transfers ownership of your original
                intellectual property to HBE.
              </p>
            </section>

            {/* PARTNERSHIPS */}
            <section>
              <h2 className="text-2xl font-black uppercase sm:text-3xl">
                10. Sponsorships and Partnerships
              </h2>

              <p className="mt-5 leading-8 text-[#5f5b55]">
                Information regarding sponsorships, broadcast opportunities,
                media relationships, fighter opportunities and commercial
                partnerships is provided for informational and introductory
                purposes unless accompanied by a separate written agreement.
              </p>

              <p className="mt-4 leading-8 text-[#5f5b55]">
                No statement on the HBE website by itself creates a
                partnership, agency, joint venture, employment relationship
                or other binding commercial relationship.
              </p>
            </section>

            {/* THIRD PARTY LINKS */}
            <section>
              <h2 className="text-2xl font-black uppercase sm:text-3xl">
                11. Third-Party Websites and Social Media
              </h2>

              <p className="mt-5 leading-8 text-[#5f5b55]">
                The HBE website may contain links to external services such
                as Facebook, Instagram, YouTube, TikTok, BoxRec and other
                third-party websites.
              </p>

              <p className="mt-4 leading-8 text-[#5f5b55]">
                These services are operated independently from HBE. HBE is
                not responsible for third-party content, availability,
                security, privacy practices or terms.
              </p>
            </section>

            {/* AVAILABILITY */}
            <section>
              <h2 className="text-2xl font-black uppercase sm:text-3xl">
                12. Website Availability
              </h2>

              <p className="mt-5 leading-8 text-[#5f5b55]">
                HBE may modify, suspend, restrict or discontinue portions of
                the website at any time for maintenance, security,
                operational, legal or business reasons.
              </p>

              <p className="mt-4 leading-8 text-[#5f5b55]">
                HBE does not guarantee that the website will operate without
                interruption or that every feature will always be available.
              </p>
            </section>

            {/* DISCLAIMER */}
            <section>
              <h2 className="text-2xl font-black uppercase sm:text-3xl">
                13. Disclaimer
              </h2>

              <p className="mt-5 leading-8 text-[#5f5b55]">
                The website is provided on an &quot;as available&quot; basis
                to the extent permitted by applicable law.
              </p>

              <p className="mt-4 leading-8 text-[#5f5b55]">
                HBE does not warrant that every item of information on the
                website will always be complete, current, error-free or
                suitable for every purpose.
              </p>

              <p className="mt-4 leading-8 text-[#5f5b55]">
                Nothing on the website constitutes medical, legal, financial
                or other regulated professional advice.
              </p>
            </section>

            {/* LIABILITY */}
            <section>
              <h2 className="text-2xl font-black uppercase sm:text-3xl">
                14. Limitation of Liability
              </h2>

              <p className="mt-5 leading-8 text-[#5f5b55]">
                To the maximum extent permitted by applicable law, HBE and
                its officers, representatives, personnel and authorized
                service providers will not be liable for indirect,
                incidental, special, consequential or punitive damages
                arising solely from use of, inability to use or reliance on
                the website.
              </p>

              <p className="mt-4 leading-8 text-[#5f5b55]">
                Nothing in these Terms excludes or limits liability that
                cannot lawfully be excluded or limited.
              </p>
            </section>

            {/* INDEMNIFICATION */}
            <section>
              <h2 className="text-2xl font-black uppercase sm:text-3xl">
                15. Responsibility for Misuse
              </h2>

              <p className="mt-5 leading-8 text-[#5f5b55]">
                To the extent permitted by applicable law, you are
                responsible for losses or claims resulting from your unlawful
                misuse of the website, your fraudulent submissions, your
                infringement of another person&apos;s rights or your material
                violation of these Terms.
              </p>
            </section>

            {/* PRIVACY */}
            <section>
              <h2 className="text-2xl font-black uppercase sm:text-3xl">
                16. Privacy
              </h2>

              <p className="mt-5 leading-8 text-[#5f5b55]">
                HBE&apos;s collection and use of personal information through
                the website is described in our Privacy Policy.
              </p>

              <Link
                href="/privacy"
                className="mt-5 inline-flex font-black text-[#941f25] transition hover:text-[#74181d]"
              >
                Read the HBE Privacy Policy →
              </Link>
            </section>

            {/* CHANGES */}
            <section>
              <h2 className="text-2xl font-black uppercase sm:text-3xl">
                17. Changes to These Terms
              </h2>

              <p className="mt-5 leading-8 text-[#5f5b55]">
                HBE may update these Terms as our website, programs,
                technology or legal obligations change.
              </p>

              <p className="mt-4 leading-8 text-[#5f5b55]">
                Updated Terms become effective when posted unless a different
                effective date is stated. Continued use of the website after
                an update constitutes acceptance of the revised Terms to the
                extent permitted by applicable law.
              </p>
            </section>

            {/* GOVERNING LAW */}
            <section>
              <h2 className="text-2xl font-black uppercase sm:text-3xl">
                18. Applicable Law
              </h2>

              <p className="mt-5 leading-8 text-[#5f5b55]">
                These Terms are governed by the laws that apply to Heritage
                Boxing Entertainment and the particular activity,
                transaction or relationship involved, without limiting any
                mandatory consumer or privacy rights that may apply based on
                your location.
              </p>

              <p className="mt-4 leading-8 text-[#5f5b55]">
                Separate fighter agreements, event agreements, sponsorship
                agreements, promotional agreements or other written
                contracts may contain their own governing-law and
                dispute-resolution provisions. Where such an agreement
                applies, its provisions control that relationship.
              </p>
            </section>

            {/* SEVERABILITY */}
            <section>
              <h2 className="text-2xl font-black uppercase sm:text-3xl">
                19. Severability
              </h2>

              <p className="mt-5 leading-8 text-[#5f5b55]">
                If any provision of these Terms is found to be invalid or
                unenforceable, the remaining provisions will remain in
                effect to the fullest extent permitted by applicable law.
              </p>
            </section>

            {/* CONTACT */}
            <section className="border border-[#e5e0d8] bg-[#f7f4ef] p-7 sm:p-9">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#941f25]">
                Questions About These Terms
              </p>

              <h2 className="mt-3 text-2xl font-black uppercase sm:text-3xl">
                Contact Heritage Boxing Entertainment
              </h2>

              <p className="mt-4 max-w-3xl leading-8 text-[#5f5b55]">
                Questions regarding these Terms &amp; Conditions or use of
                the HBE website may be submitted through the official HBE
                Contact page.
              </p>

              <Link
                href="/contact"
                className="mt-7 inline-flex bg-[#941f25] px-7 py-4 text-sm font-black uppercase tracking-wide text-white transition hover:bg-[#74181d]"
              >
                Contact HBE
              </Link>
            </section>

          </div>
        </div>
      </section>
    </main>
  );
}