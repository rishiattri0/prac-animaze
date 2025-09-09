import Link from "next/link";

const links = [
  { title: "Airing", href: "#" },
  { title: "Top Anime", href: "#" },
  { title: "My List", href: "#" },
  { title: "Manga", href: "#" },
];

export default function FooterSection() {
  return (
    <footer className="relative bg-gradient-to-b from-indigo-900 via-indigo-950 to-black">
      {/* Faded overlay at the very bottom for smoothness */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80 pointer-events-none"></div>

      <div className="relative mx-auto max-w-5xl px-6 py-12 md:py-20 text-center">
        {/* Logo */}
        <Link href="/" aria-label="go home" className="mx-auto block w-fit">
          <h3
            className="font-extrabold text-2xl tracking-wide cursor-pointer 
              bg-gradient-to-r from-sky-400 via-indigo-400 to-blue-500 bg-clip-text text-transparent 
              hover:drop-shadow-[0_0_15px_rgba(56,189,248,0.9)] transition"
          >
            ANIMAZE
          </h3>
        </Link>

        {/* Nav Links */}
        <div className="mt-8 flex flex-wrap justify-center gap-8 text-sm font-medium">
          {links.map((link, index) => (
            <Link
              key={index}
              href={link.href}
              className="text-gray-400 hover:text-sky-400 hover:drop-shadow-[0_0_8px_rgba(56,189,248,0.8)] transition duration-200"
            >
              {link.title}
            </Link>
          ))}
        </div>

        {/* Social Icons */}
        <div className="mt-8 flex justify-center gap-6">
          {/* Put your icons here same as before */}
        </div>

        {/* Copyright */}
        <span className="mt-8 block text-center text-xs text-gray-500">
          © {new Date().getFullYear()} ANIMAZE, All rights reserved
        </span>
      </div>
    </footer>
  );
}
