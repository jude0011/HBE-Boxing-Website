type PageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export default function PageHero({
  eyebrow,
  title,
  description,
}: PageHeroProps) {
  return (
    <section className="border-b border-white/10 bg-black">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:px-8">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-gray-500">
          {eyebrow}
        </p>

        <h1 className="mt-4 text-4xl font-black uppercase tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
          {title}
        </h1>

        <p className="mt-6 max-w-3xl text-lg leading-8 text-gray-400">
          {description}
        </p>
      </div>
    </section>
  );
}