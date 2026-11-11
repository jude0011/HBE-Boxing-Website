import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="relative z-50 bg-white text-[#171717]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* LOGO / HOME */}
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <Image
            src="/images/hbe-logo.jpg"
            alt="Heritage Boxing Entertainment"
            width={96}
            height={96}
            priority
            className="h-14 w-14 shrink-0 rounded-full border border-[#c6a24a]/30 object-cover sm:h-16 sm:w-16 lg:h-20 lg:w-20"
          />

          <div className="min-w-0">
            <div className="text-lg font-black tracking-[0.08em] text-[#171717] sm:text-xl lg:text-2xl">
              HBE BOXING
            </div>

            <div className="hidden text-[10px] uppercase tracking-[0.26em] text-[#6f6962] sm:block lg:text-xs">
              Heritage Boxing Entertainment
            </div>
          </div>
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden items-center gap-5 text-sm font-bold text-[#171717] lg:flex xl:gap-7">
          <Link
            href="/"
            className="transition hover:text-[#941f25]"
          >
            Home
          </Link>

          <Link
            href="/hbe"
            className="transition hover:text-[#941f25]"
          >
            HBE
          </Link>

          <Link
            href="/champions"
            className="transition hover:text-[#941f25]"
          >
            Champions
          </Link>

          <Link
            href="/rankings"
            className="transition hover:text-[#941f25]"
          >
            Rankings
          </Link>

          <Link
            href="/boxers"
            className="transition hover:text-[#941f25]"
          >
            Boxers
          </Link>

          <Link
            href="/events"
            className="transition hover:text-[#941f25]"
          >
            Events
          </Link>

          <Link
            href="/media"
            className="transition hover:text-[#941f25]"
          >
            Media
          </Link>

          <Link
            href="/partners"
            className="transition hover:text-[#941f25]"
          >
            Partners
          </Link>
        </nav>

        {/* MOBILE MENU */}
        <details className="relative lg:hidden">
          <summary className="group flex h-11 w-11 cursor-pointer list-none items-center justify-center border border-[#d8d2ca] bg-white transition hover:border-[#c6a24a]">
            <span className="sr-only">Open menu</span>

            <div className="flex flex-col items-end gap-[5px]">
              <span className="block h-[2px] w-6 bg-[#171717] transition group-hover:bg-[#941f25]" />
              <span className="block h-[2px] w-4 bg-[#c6a24a]" />
              <span className="block h-[2px] w-6 bg-[#171717] transition group-hover:bg-[#941f25]" />
            </div>
          </summary>

          <div className="absolute right-0 top-14 w-72 border-t-4 border-[#c6a24a] bg-white p-6 text-[#171717] shadow-2xl">
            <nav className="flex flex-col gap-5 text-sm font-bold text-[#171717]">

              <Link
                href="/"
                className="border-b border-[#eee9e2] pb-3 text-[#171717] transition hover:text-[#941f25]"
              >
                Home
              </Link>

              <Link
                href="/hbe"
                className="border-b border-[#eee9e2] pb-3 text-[#171717] transition hover:text-[#941f25]"
              >
                HBE
              </Link>

              <Link
                href="/champions"
                className="border-b border-[#eee9e2] pb-3 text-[#171717] transition hover:text-[#941f25]"
              >
                Champions
              </Link>

              <Link
                href="/rankings"
                className="border-b border-[#eee9e2] pb-3 text-[#171717] transition hover:text-[#941f25]"
              >
                Rankings
              </Link>

              <Link
                href="/boxers"
                className="border-b border-[#eee9e2] pb-3 text-[#171717] transition hover:text-[#941f25]"
              >
                Boxers
              </Link>

              <Link
                href="/events"
                className="border-b border-[#eee9e2] pb-3 text-[#171717] transition hover:text-[#941f25]"
              >
                Events
              </Link>

              <Link
                href="/media"
                className="border-b border-[#eee9e2] pb-3 text-[#171717] transition hover:text-[#941f25]"
              >
                Media
              </Link>

              <Link
                href="/partners"
                className="text-[#171717] transition hover:text-[#941f25]"
              >
                Partners
              </Link>

              <Link
                href="/partners"
                className="mt-2 bg-[#941f25] px-5 py-3 text-center font-black uppercase tracking-wide text-white transition hover:bg-[#74181d] hover:text-white"
              >
                Partner With HBE
              </Link>

            </nav>
          </div>
        </details>
      </div>
    </header>
  );
}