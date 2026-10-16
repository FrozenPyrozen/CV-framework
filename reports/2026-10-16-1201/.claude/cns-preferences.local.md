# CNS Skills Preferences

Control which CNS skills are active and add custom conditions.

**Note:** Core CNS guidance is injected at session start.
This file only controls per-project skill preferences.

**Managing Skills:**
Use `/cns:manage-skills` command to list all available skills and configure preferences.

---

## Disabled Skills

Add skill names below (one per line, starting with `-`):

<!-- Example:
- test-driven-development
- brainstorming
-->

## Custom Conditions

Add custom activation conditions (format: `- skill-name: YOUR CONDITION`):

<!-- Examples:
- systematic-debugging: REQUIRED for all bug fixes
- brainstorming: USE ONLY WHEN designing new features
- test-driven-development: DISABLED FOR THIS PROJECT
-->
