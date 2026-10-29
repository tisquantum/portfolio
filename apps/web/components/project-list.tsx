"use client"

import * as React from "react"

import { cn } from "@workspace/ui/lib/utils"

export type Project = {
  label: string
  href: string
  description: string
}

export function ProjectList({ projects }: { projects: Project[] }) {
  const [openHref, setOpenHref] = React.useState<string | null>(null)
  const noteRef = React.useRef<HTMLParagraphElement>(null)
  const open = projects.find((p) => p.href === openHref) ?? null

  React.useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenHref(null)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  React.useEffect(() => {
    noteRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" })
  }, [openHref])

  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <nav aria-label="Projects" className="flex flex-col gap-2">
        {projects.map((p) => {
          const selected = p.href === openHref
          return (
            <div
              key={p.href}
              className={cn(
                "flex items-center justify-between gap-3 rounded-lg border border-border bg-card px-4 py-3 text-sm font-medium text-card-foreground transition",
                selected && "border-primary/30"
              )}
            >
              <button
                type="button"
                aria-expanded={selected}
                onClick={() => setOpenHref(selected ? null : p.href)}
                className="cursor-pointer rounded-sm text-left transition hover:text-primary focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:outline-none"
              >
                {p.label}
              </button>
              <a
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                className="truncate font-mono text-xs font-normal text-muted-foreground underline-offset-4 hover:text-primary hover:underline focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:outline-none"
              >
                {new URL(p.href).host}
              </a>
            </div>
          )
        })}
      </nav>

      {open && (
        <p
          ref={noteRef}
          key={open.href}
          className="animate-in scroll-mb-8 px-4 py-3 text-sm leading-relaxed text-muted-foreground duration-300 fade-in"
        >
          {open.description}
        </p>
      )}
    </div>
  )
}
