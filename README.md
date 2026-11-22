# رحلات تعليمية · Learning Journeys

من حالمٍ بتعلّمٍ أجمل — From a dreamer of better learning.

Free educational apps by Halim Faroug, all under one address:

| App | Address |
| --- | --- |
| Front page | https://halimfaroug.github.io/ |
| رحلة المهارات · Skills Journey | https://halimfaroug.github.io/skills-journey/ |
| كلماتي · Kalimati | https://halimfaroug.github.io/kalimati/ |
| مغامرة الرياضيات ٥ · Math5 Expert | https://halimfaroug.github.io/math5/ |
| منصة العلوم التفاعلية · Quantum Nexus | https://halimfaroug.github.io/quantum-nexus/ |

GitHub Pages publishes this repository automatically.

## Notes for updates

- `skills-journey/` is now the main copy of Skills Journey. Raise the cache version in `skills-journey/sw.js` with every change. `tools/check-bank.js` checks the question bank on every push.
- `kalimati/` is a static build of the `kalimati-crafter` repository (TanStack Start SPA mode, base `/kalimati/`). Rebuild and copy it after changes there.
- `math5/` comes from `Math5-Expert`; `quantum-nexus/` comes from `Quantum-Nexus_Modern_Academy-Schools`.
- Each app keeps its saved progress under its own storage keys, so the apps do not interfere with each other.
