import Image from "next/image"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "tisquantum",
  description: "Portfolio — GitHub and live projects.",
}

const GITHUB = "https://github.com/tisquantum"

const projects = [
  {
    label: "sectors.gg",
    href: "https://sectors.gg/",
  },
  {
    label: "The Money Game",
    href: "https://wageryourtrust.money/",
  },
  {
    label: "Jeopardy Fun Times",
    href: "https://jeopardy-fun-times.onrender.com/",
  },
] as const

export default function Page() {
  return (
    <main className="font-sans flex min-h-svh flex-col items-center justify-center gap-10 px-6 py-16">
      <a
        href={GITHUB}
        target="_blank"
        rel="noopener noreferrer"
        className="group focus-visible:ring-ring/60 rounded-full ring-offset-2 ring-offset-background transition focus-visible:ring-2 focus-visible:outline-none"
        aria-label="tisquantum on GitHub"
      >
        <Image
          src="/images/tisquantum.png"
          alt="tisquantum"
          width={244}
          height={244}
          priority
          className="size-40 rounded-full border border-border bg-card shadow-sm transition group-hover:border-primary/40 group-hover:shadow-md sm:size-52 md:size-56"
        />
      </a>

      <div className="flex flex-col items-center gap-1 text-center">
        <p className="text-muted-foreground text-sm tracking-wide uppercase">
          Portfolio
        </p>
        <a
          href={GITHUB}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:text-primary/80 text-lg font-medium underline-offset-4 hover:underline"
        >
          github.com/tisquantum
        </a>
      </div>

      <nav aria-label="Projects" className="flex w-full max-w-sm flex-col gap-2">
        {projects.map((p) => (
          <a
            key={p.href}
            href={p.href}
            target="_blank"
            rel="noopener noreferrer"
            className="border-border bg-card text-card-foreground hover:border-primary/30 hover:bg-muted/50 focus-visible:ring-ring/60 flex items-center justify-between gap-3 rounded-lg border px-4 py-3 text-sm font-medium transition focus-visible:ring-2 focus-visible:outline-none"
          >
            <span>{p.label}</span>
            <span className="text-muted-foreground font-mono text-xs font-normal truncate">
              {new URL(p.href).host}
            </span>
          </a>
        ))}
      </nav>
    </main>
  )
}
