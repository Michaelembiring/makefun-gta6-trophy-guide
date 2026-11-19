# Leonida Legend — the complete GTA VI trophy guide

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/Michaelembiring/makefun-gta6-trophy-guide/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/Michaelembiring/makefun-gta6-trophy-guide/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

A static, offline trophy guide for Grand Theft Auto VI (PlayStation 5): all 55 official
trophies — 1 platinum, 2 gold, 6 silver, 46 bronze, 1,350 points — each with a
step-by-step guide written in our own words, a launch-day rarity snapshot, and a
checklist that saves your progress on your device.

## What it does

- **Every trophy, guided.** Each of the 55 trophies gets 2–4 sentences: what to do,
  where and how, and when it can be missed. Nothing is copied from other guide sites.
- **A checklist that remembers.** Tick trophies off as you earn them; progress is
  stored in `localStorage` by trophy id. Export it to JSON, import it on another
  device, or reset it.
- **Progress ring + points.** A ring, a percentage, and a running points total
  (earned / 1,350) sit at the top of the page.
- **Search and filters.** Search by trophy, mission or keyword; filter by grade,
  category, or status (all / earned / unearned / missable only).
- **Spoilers on by default.** Secret trophies show as "Hidden trophy" with generic
  text until earned — or until you untick "Hide spoilers".
- **A 6-phase roadmap.** Story → strangers → activities & skill →
  collectibles & exploration → money & crime → duo feats + 100%. Follow it in
  order and the platinum is the last thing that pops.
- **Missable warning.** Five trophies are possibly missable — Fair Game (#29),
  Catch Me If You Can (#37), Capital Offense (#45), Actions Speak Louder (#48)
  and Bad Luck, I Guess (#49). Each is flagged on its card, with a note on what
  to do before the moment passes.
- **Rarity snapshot.** Launch-day rarity from Exophase (2026-11-19 ~10:09 UTC, %
  of tracked players) on every card — a snapshot of launch day, not a difficulty
  ranking.
- **Fully offline.** No network requests beyond loading `app/data/trophies.json`;
  no trackers, no fonts, no images fetched from anywhere.

## About this project

This guide was built for make.fun's `gta6-trophy-guide-01` bounty ("Build the best
GTA 6 trophy guide", $250 pool, deadline 2026-11-21 18:00 WIB). The trophy list,
grades, points and secret flags come from the official list as published on
Exophase; the guides, the roadmap, the categories and the missable flags are this
project's own work. Where a mechanic is described by analogy it follows GTA V /
GTA Online conventions, and the guide says so.

## Run it

```sh
node serve.ts   # serves app/ on http://localhost:8080
```

Open `app/index.html` directly in a browser works too — the only fetch is the
local `data/trophies.json`.

## Screenshots

The four screenshots in `screenshots/` are 1280×800 JPEGs taken with Puppeteer
(`node ~/workspace/makefun/tools/shots/shoot-guide.mjs <repo>` in the author's
environment):

1. `1-checklist.jpg` — the full checklist, scrolled to the cards.
2. `2-silver.jpg` — the silver filter (`?grade=silver`).
3. `3-bronze.jpg` — the bronze filter, scrolled down (`?grade=bronze`).
4. `4-missable.jpg` — missable trophies with spoilers off
   (`?status=missable&spoilers=0`).

Query params preset the view for links and screenshots: `?grade=`,
`?category=`, `?status=`, `?q=`, `?spoilers=0`.

## Layout

```text
app/
  index.html          page: hero, progress ring, roadmap, controls, cards, footer
  style.css           dark Leonida neon look, grade-coloured cards
  app.js              render, filters, search, spoilers, localStorage, export/import
  data/trophies.json  the 55 trophies: id, name, description, grade, points,
                      secret, category, missable, rarity, guide, sources
main.ts               builds /output + dossier.json (kit plumbing, unchanged)
serve.ts              local static server (kit plumbing, unchanged)
screenshots/          4 JPEGs, 1280×800, each ≤ 256 KiB
shots.json            which view each screenshot shows
```

## Disclaimer

Fan-made guide. Not affiliated with, endorsed by, or connected to Rockstar Games
or Take-Two Interactive. Grand Theft Auto and GTA are trademarks of Take-Two
Interactive. No Rockstar logos, artwork or fonts are used here.
