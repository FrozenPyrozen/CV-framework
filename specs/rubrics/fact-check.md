# Rubric: Fact check

**Question:** is every claim in the CV supported by its source, without exaggeration?

`npm run trace` already checks that every source id exists. This rubric checks the **meaning**: does the source really say what the bullet says?

## Inputs
- The CV Markdown with its `src` comments
- The summaries and facts the `src` ids point to
- `profile.yaml`, calculated values (`cv-spec.md` section 7)

## Checks
| Area | What to check |
|---|---|
| Support | every bullet and summary sentence is fully supported by its sources |
| Numbers | each number matches the source exactly (no rounding up, no "~" turned into an exact figure) |
| Scope inflation | "led" when the source says "contributed", "architected" when it says "implemented", "team" when it was solo work |
| Ownership | work done by others not presented as yours: design decisions credited to AI agents, or AI agents' role narrowed or widened beyond the source (decision `ai-agents-wording`) |
| Emphasis | the points in an entry's `cv_emphasis` appear in its first bullets, in the given order (`specs/cv-spec.md` 5); lint can't judge this |
| Dates and titles | entry lines match summary front matter |
| Calculated values | years of experience and team size match the calculation |
| Unsourced content | sentences without `src` outside generated blocks |

## Required sections in the report
1. **Claims checked:** count, supported / partly supported / unsupported.
2. **Findings** (report spec): quote, source quote, and what's wrong. Unsupported claims are `high`, and `needs_user_input: yes` when the user could confirm them as a fact.

## Severity guide
- high: unsupported or inflated claim, wrong number
- medium: partly supported, wording stronger than the source
- low: source supports it but the `src` points to a less precise section
