# Rubric: Confidentiality

**Question:** could this CV leak anything a former employer or client would consider confidential, or identify a client that is meant to stay hidden?

`npm run lint` already blocks listed terms, ticket prefixes and secrets. This rubric checks what a blocklist can't: **meaning and inference**.

## Inputs
- The CV Markdown
- Section 9 (*Confidentiality notes*) of every summary, `cv_client_label` vs `client`
- `decisions.yaml`

## Checks
| Area | What to check |
|---|---|
| Hidden clients | could a reader identify a client hidden behind `cv_client_label` from product details, unique numbers, domain or dates? |
| Internal details | internal product or code names, architecture details that are not public, internal process names |
| Numbers | internal metrics that may be confidential (revenue, user counts) unless the source marks them as public |
| People | names of colleagues or clients' staff |
| Links and files | URLs other than the profile's own links |

## Portfolio mode (`/review --portfolio`)

The portfolio is a **public link**, so the bar is higher than for a CV sent to one employer:
- Names: only `portfolio_label` (default `cv_client_label`) for each project; a client the CV hides stays hidden, including by inference (product, city, team, unusual technology combination); decision `portfolio-client-names` lists who may be named.
- Section 9 terms pass only with `allow_in: [portfolio]` (`portfolio check` blocks the rest); look for the ones a blocklist can't see.
- **Screenshots:** look at every image in the previews: customer or patient data, real names, emails, internal URLs or environment names, NDA or "confidential" banners, internal tool names. Each image must be `public: yes, confirmed by user` in its summary; a risky one is a `high` finding even if confirmed (ask the user again).
- Contacts: no phone unless decision `portfolio-show-phone`.

## Required sections in the report
1. **Hidden clients:** for each, *identifiable / possibly identifiable / safe*, with the reason.
2. **Findings** (report spec), each with the safer wording.

## Severity guide
- high: a hidden client is identifiable, an internal name or non-public detail appears
- medium: details that narrow the client down considerably
- low: wording that could be more generic without losing value
