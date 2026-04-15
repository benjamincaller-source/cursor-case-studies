# Cursor Case Studies Database

A structured database and multi-format storytelling content for Cursor customer case studies, testimonials, and adoption stories.

## Contents

### Database (`data/`)

| File | Description |
|------|-------------|
| `case-studies.json` | Full structured database with metadata, quotes, tags, and summaries (26 companies) |
| `case-studies.csv` | Notion-importable CSV with all database properties |

### Storytelling Pages (`storytelling/`)

Detailed storytelling content exists for the **7 official Cursor case studies** (published on cursor.com/blog). Each Markdown file contains:

| Section | Format | Use Case |
|---------|--------|----------|
| **One-Liner** | Single sentence | Quick reference, email subject lines |
| **Blog-Style Narrative** | 500-800 words | Blog posts, content marketing, internal comms |
| **Presentation Outline** | 6-8 slides | Sales decks, exec presentations, conference talks |
| **LinkedIn Post** | ~150 words | Professional social media |
| **Twitter/X Post** | ~280 chars | Short-form social |
| **Short Teaser** | ~50 words | Slack, newsletters, internal comms |

## All 26 Companies in the Database

### Tier 1: Official Cursor Case Studies (7)
Full-length published stories on cursor.com/blog with detailed storytelling packs.

| Company | Industry | Key Metric | Storytelling |
|---------|----------|-----------|--------------|
| NVIDIA | Semiconductors / AI | 3x more committed code, 30K devs | `storytelling/nvidia.md` |
| Salesforce | Enterprise Software | 30%+ velocity, double-digit quality gains | `storytelling/salesforce.md` |
| Stripe | Fintech / Payments | 3,000 engineers, 5-yr-high sentiment | `storytelling/stripe.md` |
| Box | Cloud Content | 30-50% more roadmap, 80-90% faster migrations | `storytelling/box.md` |
| Dropbox | Cloud Storage | 1M+ lines/month, 550K files indexed | `storytelling/dropbox.md` |
| PlanetScale | Database Infrastructure | 80% Bugbot resolution, 2 FTE saved | `storytelling/planetscale.md` |
| Money Forward | Fintech (Japan) | 15-20 hrs saved/dev/week, 70% faster QA | `storytelling/money-forward.md` |

### Tier 2: Customer Testimonials from cursor.com/customers (15)
Quotes and endorsements from the official Cursor customers page.

| Company | Industry | Key Metric | Spokesperson |
|---------|----------|-----------|--------------|
| Coinbase | Crypto / Fintech | 92% adoption, 40% AI-generated code, PR review 10x faster | Brian Armstrong, CEO |
| Brex | Fintech | 70%+ adoption, 45% of code fully AI-written | James Reggio, CTO |
| Rippling | HR Tech | 150 to 500+ engineers in weeks | Albert Strasheim, CTO |
| Upwork | Marketplace | ~50% more code shipped | Anton Andreev, Principal SWE |
| Sentry | Developer Tools | Dozen agent branches merge daily | Cody De Arkland, Sr. Director |
| Datadog | Observability | Killer app for AI -- speed + quality | Alexis Le-Quoc, CTO |
| monday.com | Work Management | 2-5x engineering velocity | Roni Avidov, Sr. R&D Lead |
| Trimble | Transportation/Construction | 800+ engineers, 99% say more productive | Jonah McIntire, CPTO |
| Fox Corporation | Media / Entertainment | Unprecedented employee gratitude | Melody Hildebrandt, CTO |
| OpenAI | AI Research | "We are at the 1% of what's possible" | Greg Brockman, President |
| Sierra | AI / Customer Service | Transforms how software is created | Bret Taylor, CEO |
| Mercado Libre | E-commerce (LatAm) | Features in a day vs. weeks | Oscar Mullin, VP Technology |
| eBay | E-commerce | Indispensable daily workflow | Lathesh Karkera, SWE |
| OnePay | Fintech / Payments | Exceptional debugging + attribution | Moe Matar, CTO |
| Optiver | Trading / Finance | Firm-wide deployment, global scale | Scott McKenzie, Head of Eng |

### Tier 3: External Press and Company Announcements (4)

| Company | Industry | Key Metric | Source |
|---------|----------|-----------|--------|
| National Australia Bank (NAB) | Banking | 40x faster requirements, 5-6x dev uplift | NAB news article |
| R Systems | IT Services | ~30% velocity, 25% fewer defects | BusinessWire press release |
| Decagon | AI Startup | 100% engineering adoption | Cursor customers page |
| Carlyle Group | Private Equity | Portfolio-wide acceleration | Cursor customers page |

### Also Mentioned (no detailed data yet)
Companies mentioned in statistics/press as Cursor customers but without published case details:
Adobe, Uber, Shopify, PayPal, Spotify, Microsoft teams, PwC

## Importing to Notion

1. **Database**: Go to Notion, click "Import" > "CSV", and select `data/case-studies.csv`
2. **Storytelling pages**: Create each as a child page under the corresponding database row, or import the Markdown files directly via Notion's "Import" > "Markdown" feature

## Sources

- Official case studies: [cursor.com/blog/topic/customers](https://www.cursor.com/blog/topic/customers)
- Customer testimonials: [cursor.com/en/customers](https://cursor.com/en/customers)
- NAB article: [news.nab.com.au](https://news.nab.com.au/tag/artificial-intelligence/the-tools-and-training-transforming-nab-s-workforce-to-become--t)
- R Systems: [rsystems.com press release](https://www.rsystems.com/news-press-release/r-systems-announces-strategic-adoption-of-cursor-to-embed-ai-across-sdlc/)
- Market statistics: Various (Panto, Shipper, Digital Applied)

All data accessed April 2026.
