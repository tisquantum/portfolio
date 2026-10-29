import Image from "next/image"
import type { Metadata } from "next"

import { ProjectList, type Project } from "@/components/project-list"
import { TopoBackground } from "@/components/topo-background"
import type { Hill } from "@/lib/terrain"
import { traceContours } from "@/lib/terrain"

export const metadata: Metadata = {
  title: "tisquantum",
  description: "Portfolio — GitHub and live projects.",
}

const GITHUB = "https://github.com/tisquantum"

const projects: Project[] = [
  {
    label: "sectors.gg",
    href: "https://sectors.gg/",
    description:
      "A multiplayer stock-market game. Players place market, limit, and short orders, then the companies operate, vote on revenue, and share prices move.",
  },
  {
    label: "The Money Game",
    href: "https://wageryourtrust.money/",
    description: "A game of wagers, played under one motto: wager your trust.",
  },
  {
    label: "Jeopardy Fun Times",
    href: "https://jeopardy-fun-times.onrender.com/",
    description:
      "A Jeopardy board for an evening with friends. Pick a category, name your price, and answer in the form of a question.",
  },
  {
    label: "Sunday Mondays",
    href: "https://sundaymondays.games/",
    description:
      "A game studio focused on interactivity, game feel, and skill expression.",
  },
  {
    label: "Nordic",
    href: "https://nordicgame.ski/",
    description:
      "A cross-country skiing game. You control each limb and keep a rhythm, online or on your own.",
  },
  {
    label: "playtheory",
    href: "https://playtheory.gg/",
    description:
      "A book club for games. One game at a time, played together, then talked over.",
  },
]

const hills: Hill[] = [
  { x: 180, y: 460, height: 280, spread: 90 },
  { x: 340, y: 200, height: 420, spread: 100 },
  { x: 520, y: 500, height: 520, spread: 110 },
  { x: 640, y: 260, height: 640, spread: 120 },
  { x: 860, y: 470, height: 760, spread: 100 },
  { x: 820, y: 150, height: 1000, spread: 120 },
  { x: 80, y: 140, height: 200, spread: 80 },
  { x: 960, y: 600, height: 180, spread: 70 },
]

const contours = traceContours(hills, 48)

export default function Page() {
  return (
    <main className="relative flex min-h-svh flex-col items-center justify-center gap-10 px-6 py-16 font-sans">
      <TopoBackground contours={contours} />

      <a
        href={GITHUB}
        target="_blank"
        rel="noopener noreferrer"
        className="group rounded-full ring-offset-2 ring-offset-background transition focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:outline-none"
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
        <p className="text-sm tracking-wide text-muted-foreground uppercase">
          Portfolio
        </p>
        <a
          href={GITHUB}
          target="_blank"
          rel="noopener noreferrer"
          className="text-lg font-medium text-primary underline-offset-4 hover:text-primary/80 hover:underline"
        >
          github.com/tisquantum
        </a>
      </div>

      <ProjectList projects={projects} />
    </main>
  )
}
