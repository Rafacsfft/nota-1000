# Nota 1000

An interactive writing lab that helps Brazilian high-school students understand the five ENEM essay competencies and turn feedback into a concrete revision plan.

**Live product:** https://nota-1000.rafasn008.chatgpt.site

## Why it exists

An essay score is useful only when students understand what to change next. Nota 1000 makes the competency structure easier to explore through a focused, private-by-design revision experience.

## Current MVP

- Paste or edit an essay directly in the browser
- Explore all five ENEM competencies independently
- See structural signals such as paragraph, word and connector counts
- Receive a prioritized revision prompt for each competency
- Use a realistic sample essay to understand the workflow
- Responsive, keyboard-accessible interface
- No account, upload or server-side storage

The displayed score is a **demonstrative heuristic**, not an official ENEM grade and not a substitute for a teacher. This limitation is stated in the product itself.

## Product principles

1. **Teach, do not mystify.** Feedback should explain the next action.
2. **Privacy by default.** The MVP analyzes text locally in the browser.
3. **One priority at a time.** Students improve more deliberately when feedback is focused.
4. **Honest evaluation.** The project does not claim pedagogical validation it has not yet completed.

## Tech stack

- React 19 + TypeScript
- Next.js-compatible Vinext runtime
- Tailwind CSS
- Cloudflare Workers deployment

## Run locally

```bash
npm install
npm run dev
```

## Quality checks

```bash
npm run lint
npm test
```

## Roadmap

- [ ] Conduct usability tests with students
- [ ] Validate feedback language with Portuguese teachers
- [ ] Add side-by-side version comparison
- [ ] Add an optional revision history stored on-device
- [ ] Explore OCR for handwritten essays
- [ ] Evaluate an AI-assisted mode with clear privacy and accuracy safeguards

## Project status

This is an actively developed educational MVP. The next milestone is evidence: testing whether students can use the feedback to make a stronger second draft.

## Author

Created by [Rafa](https://github.com/Rafacsfft), a Brazilian high-school student exploring how technology can make learning more intentional.

## License

MIT License. See [LICENSE](LICENSE).
