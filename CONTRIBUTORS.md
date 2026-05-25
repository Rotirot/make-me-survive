# Contributors & Verification

## Authorship — be honest about this

This encyclopedia was **drafted with AI assistance** (Claude by Anthropic) and is being
**progressively reviewed and verified** by human contributors.

We believe transparency about this process is more trustworthy than pretending otherwise.
AI assistance does not make the content wrong — but it does mean every article needs
human eyes, domain expertise, and source verification before it should be considered
authoritative.

---

## Article verification status

Each article has one of three statuses:

| Badge | Meaning |
|-------|---------|
| 🔴 **Unverified** | AI-drafted. Content is plausible and cross-referenced against known sources during drafting, but has not yet been reviewed by a qualified human contributor. Use with appropriate caution. |
| 🟡 **Community reviewed** | Checked by one or more contributors with relevant experience. May still contain errors. Improvements welcome. |
| 🟢 **Expert verified** | Reviewed by a qualified professional in the relevant field (medicine, engineering, etc.). Highest confidence level. |

---

## How to contribute a review

1. Fork the repository
2. Open `src/index.html`
3. Find the article you want to review (search for `id:XX` in the ARTICLES array)
4. Add or update the `verified` field:

```javascript
{
  id: 7,
  cat: 'medical',
  title: 'Wound care without hospital access',
  verified: 'community',           // 'none' | 'community' | 'expert'
  verifiedBy: 'github_username',   // your GitHub handle
  verifiedDate: '2026-05',         // year-month
  verifiedNotes: 'Cross-checked against Auerbach Wilderness Medicine 7th ed.',
  sources: [ ... ],
  ...
}
```

5. Open a Pull Request with the title: `verify: [article title]`
6. In the PR description, state your qualifications and what sources you used

---

## Sources and references

Every article should cite the primary sources used. Key reference works used in drafting:

### Medical
- **WHO First Aid Guidelines** — World Health Organization
- **Wilderness Medicine, 7th Ed.** — Paul Auerbach (Elsevier)
- **Where There Is No Doctor** — David Werner (Hesperian Foundation) — CC licensed
- **Where There Is No Dentist** — Murray Dickson (Hesperian Foundation)
- **British National Formulary (BNF)** — NICE/BMJ Group (drug dosing)
- **Psychological First Aid Field Guide** — WHO / Johns Hopkins

### Survival & Outdoor
- **US Army Survival Manual FM 21-76** — US Department of the Army (public domain)
- **SAS Survival Handbook** — John 'Lofty' Wiseman
- **Tom Brown's Field Guide to Wilderness Survival** — Tom Brown Jr.
- **Edible Wild Plants of Britain and Northern Europe** — Roger Phillips

### Technical
- **Machinery's Handbook** — Industrial Press (engineering reference)
- **Code of Federal Regulations — Amateur Radio (47 CFR Part 97)** (public domain)
- **ARRL Handbook for Radio Communications** — American Radio Relay League
- **Photovoltaics: Design and Installation Manual** — Solar Energy International

### Pharmacology
- **Merck Manual** — Merck & Co. (merckmanuals.com)
- **Martindale: The Complete Drug Reference** — Pharmaceutical Press
- **WHO Model Formulary** — World Health Organization (open access)

---

## Current contributors

| Contributor | Role | Articles reviewed |
|-------------|------|-------------------|
| [@Rotirot](https://github.com/Rotirot) | Project founder, initial content | All (unverified) |
| *Your name here* | *Your role* | *Articles* |

---

## Want to help?

We especially need reviewers with expertise in:
- 🏥 Emergency medicine / wilderness medicine
- 🌿 Botany / ethnobotany (plant identification)
- ⚡ Electrical engineering
- 🔧 Mechanical engineering
- 🌾 Agriculture / permaculture
- 👶 Paediatric medicine
- 🛡️ Self-defence / firearms safety

Open an issue to introduce yourself and the area you can help with.
