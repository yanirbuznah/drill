# Drill

Bilingual (Hebrew / English) exam-practice apps. One static folder per subject — no server,
no build step at runtime, no dependencies.

| subject | questions | formats | URL |
|---|---|---|---|
| English Grammar | 220 | multiple choice + fill-in-the-blank | `/english/` |
| ML Drill | 218 | multiple choice + written | `/ml/` |
| Random Signals | 210 | multiple choice + written | `/random-signals/` |

The launcher at `/` lists them. Each subject installs as its own home-screen app with its own
icon, its own offline cache and its own progress.

## Question formats

- **Multiple choice** — the question appears first; the options stay hidden until you ask for them.
- **Fill in the blank (cloze)** — you type the missing word or phrase. Matching ignores case,
  surrounding spaces, curly apostrophes and a trailing full stop, and each blank carries a list
  of every acceptable form. Auto-graded, so these count in quizzes too.
- **Written answer** — a model answer and a rubric you score yourself; optional AI grading.

## Adding a subject

The engine is shared; a subject is three files:

- `pack.json` — id, name and blurb (EN/HE), accent colour, icon motif, the list of areas with
  their bilingual labels, and optionally `hardnessLabels` to rename the "why it's hard" axis
- `questions.json` — the question bank
- `glossary.json` — the hover/tap definitions

Nothing in the app code changes. Ask Claude for a new topic and you get those three files back.

## Install on a phone

Open the subject's URL, then **iPhone (Safari only):** Share → *Add to Home Screen*.
**Android (Chrome):** *Install app*, or menu → *Add to Home screen*.

## AI grading for written answers

Written answers self-grade against a rubric by default — no key, no cost. To have a model grade
them, open **Settings** in a subject and pick a provider (Gemini's free tier is the intended
default; get a key at https://aistudio.google.com/apikey). The key is stored in that browser only.
**Never commit a key to this repo — it is public.**

## Updating

After a push, a subject picks up the new version on its *second* launch: the service worker serves
the cached copy first and refreshes in the background. Bump `VERSION` in that subject's `sw.js`
to force it sooner.
