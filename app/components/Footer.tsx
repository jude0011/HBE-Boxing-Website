import Image from "next/image";
import Link from "next/link";
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaTiktok,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer>
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">

          {/* BRAND */}
          <div>
            <Link
              href="/"
              className="flex items-center gap-4 transition hover:opacity-85"
            >
              <Image
                src="/images/hbe-logo.jpg"
                alt="Heritage Boxing Entertainment"
                width={96}
                height={96}
                className="h-16 w-16 rounded-full border border-[#c8a24a]/30 object-cover sm:h-20 sm:w-20"
              />

              <div>
                <div className="text-xl font-black tracking-[0.08em] text-white sm:text-2xl">
                  HBE BOXING
                </div>

                <div className="mt-1 text-[10px] uppercase leading-5 tracking-[0.24em] text-[#9c948a]">
                  Heritage Boxing
                  <br />
                  Entertainment
                </div>
              </div>
            </Link>

            <p className="mt-6 max-w-sm leading-8 text-[#aaa49b]">
              World-class professional boxing platform connecting
              champions, fighters, events, rankings, media and commercial
              opportunity from Africa to the world.
            </p>

            {/* SOCIAL MEDIA */}
            <div className="mt-8">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-white">
                Follow HBE
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                <a
                  href="https://www.facebook.com/share/1FrBP32M78/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="HBE Boxing on Facebook"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-[#c8a24a]/30 text-white transition hover:border-[#e0c273] hover:bg-[#e0c273] hover:text-black"
                >
                  <FaFacebookF size={20} />
                </a>

                <a
                  href="https://www.instagram.com/hbeboxing?vrfl=MXJ6NWx4bWdkcTAw"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="HBE Boxing on Instagram"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-[#c8a24a]/30 text-white transition hover:border-[#e0c273] hover:bg-[#e0c273] hover:text-black"
                >
                  <FaInstagram size={20} />
                </a>

                <a
                  href="https://youtube.com/@hbeboxing?si=Pefz_afKly26l9UN"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="HBE Boxing on YouTube"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-[#c8a24a]/30 text-white transition hover:border-[#e0c273] hover:bg-[#e0c273] hover:text-black"
                >
                  <FaYoutube size={20} />
                </a>

                <a
                  href="https://www.tiktok.com/@hbeboxingafrica?_r=1&_t=ZS-9Aqrk5kiLSO"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="HBE Boxing on TikTok"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-[#c8a24a]/30 text-white transition hover:border-[#e0c273] hover:bg-[#e0c273] hover:text-black"
                >
                  <FaTiktok size={20} />
                </a>
              </div>
            </div>
          </div>

          {/* BOXING */}
          <div>
            <h3 className="text-sm font-black uppercase tracking-[0.22em] text-white">
              Boxing
            </h3>

            <div className="mt-6 flex flex-col gap-4 text-base">
              <Link
                href="/champions"
                className="text-[#d8d2ca] transition hover:text-[#e0c273]"
              >
                Champions
              </Link>

              <Link
                href="/rankings"
                className="text-[#d8d2ca] transition hover:text-[#e0c273]"
              >
                Rankings
              </Link>

              <Link
                href="/boxers"
                className="text-[#d8d2ca] transition hover:text-[#e0c273]"
              >
                Boxers
              </Link>

              <Link
                href="/events"
                className="text-[#d8d2ca] transition hover:text-[#e0c273]"
              >
                Events
              </Link>
            </div>
          </div>

          {/* HBE */}
          <div>
            <h3 className="text-sm font-black uppercase tracking-[0.22em] text-white">
              HBE
            </h3>

            <div className="mt-6 flex flex-col gap-4 text-base">
              <Link
                href="/"
                className="text-[#d8d2ca] transition hover:text-[#e0c273]"
              >
                Home
              </Link>

              <Link
                href="/hbe"
                className="text-[#d8d2ca] transition hover:text-[#e0c273]"
              >
                About HBE
              </Link>

              <Link
                href="/media"
                className="text-[#d8d2ca] transition hover:text-[#e0c273]"
              >
                Media
              </Link>

              <Link
                href="/partners"
                className="text-[#d8d2ca] transition hover:text-[#e0c273]"
              >
                Partners
              </Link>

              <Link
                href="/contact"
                className="text-[#d8d2ca] transition hover:text-[#e0c273]"
              >
                Contact
              </Link>
            </div>
          </div>

          {/* PARTNERSHIPS */}
          <div>
            <h3 className="text-sm font-black uppercase tracking-[0.22em] text-white">
              Global Partnerships
            </h3>

            <p className="mt-6 leading-8 text-[#aaa49b]">
              Sponsorship, broadcast, media, fighter and commercial
              opportunities with Heritage Boxing Entertainment.
            </p>

            <Link
              href="/partners"
              className="hbe-button-primary mt-7 inline-flex"
            >
              Partner With HBE
            </Link>
          </div>
        </div>

        {/* BOTTOM FOOTER */}
        <div className="mt-16 flex flex-col gap-5 border-t border-[#c8a24a]/20 pt-7 text-sm text-[#9c948a] sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} Heritage Boxing Entertainment. All
            rights reserved.
          </p>

          <div className="flex flex-wrap gap-6">
            <Link
              href="/privacy"
              className="transition hover:text-[#e0c273]"
            >
              Privacy
            </Link>

            <Link
              href="/terms"
              className="transition hover:text-[#e0c273]"
            >
              Terms
            </Link>

            <Link
              href="/contact"
              className="transition hover:text-[#e0c273]"
            >
              Contact
            </Link>

            <Link
              href="/admin/login"
              className="text-[#7f796f] transition hover:text-[#e0c273]"
            >
              Admin Login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}