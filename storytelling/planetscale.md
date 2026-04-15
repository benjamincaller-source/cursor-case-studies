# PlanetScale × Cursor Bugbot — Storytelling

## One-Liner

PlanetScale turned code review from a scaling crisis into a strength: Bugbot addresses four in five review comments before merge—freeing capacity equivalent to two full-time engineers—while catching semantic bugs humans and generic LLMs miss.

## Blog-Style Narrative

**Eighty percent.** That is how many of Bugbot’s comments PlanetScale addresses before a pull request ever lands in `main`. In practice, that is not a vanity metric—it is the difference between a team drowning in review debt and a team shipping with confidence. For a cloud database company where **reliability is the product**, every line of code touches workloads that carry sensitive data. There is no room for “we will catch it in prod.”

The story starts with a familiar shift. As coding agents made generation cheap and fast, **review became the new bottleneck**. Human review capacity did not scale with output. Code volume climbed; attention did not. Pull requests multiplied, diffs grew longer, and the hardest questions—whether behavior stayed correct under concurrency, failure, and edge loads—still demanded careful thought. PlanetScale estimates it would have needed **two dedicated engineers** just to keep up with code review—and even then, the work would have been reactive triage, not deep assurance. The team was not looking for another noisy bot; it needed a reviewer that could reason about production consequences.

PlanetScale adopted **Bugbot as a dedicated agentic review layer**. It now reviews **more than 2,000 pull requests every month**, operating as a persistent second set of eyes on changes that move fast. The value shows up in what it finds: not style nits or what a linter already knows, but **semantic and logical issues**—the kind static analysis was never built to reason about.

Engineers describe catches that sound almost unfair in how subtle they are: **state synchronization gaps**, **logical flow changes that quietly block critical paths**, **async controller interactions that fail to converge**, and **edge cases that could trigger production database restarts**. Software Engineer Fatih Arslan puts the contrast plainly: when he uses a reasoning model to review a branch, it still does not surface these classes of problems. **The specialized harness matters.** Bugbot’s signal-to-noise ratio stays high because it is aimed at the failure modes that actually hurt a database platform—not generic “looks fine” reassurance.

The human side of the story is just as loud as the technical one. **“Bugbot is different from other tools,”** Arslan says. **“It detects issues that as a human reviewer I would never imagine to look at. I was blown away.”** CEO Sam Lambert is even more direct: **“If I took Bugbot away from our engineering team, there would be a mutiny.”** And Arslan ties it back to the mission: **“Reliability is at the core of our product. Every change pushed to production must be flawless.”**

The takeaway is not that humans are optional. It is that **the bottleneck moved**, and PlanetScale met it with a layer that scales review the way agents scaled authoring—without sacrificing depth. When eight in ten Bot-driven findings get resolved pre-merge, you are not just saving time. You are buying back the focus of engineers who can finally spend their judgment where only humans can—on architecture, customer trust, and the next hard problem—while Bugbot holds the line on the semantic risks that slip past both people and off-the-shelf models. In a business where a missed edge case can ripple into customer-facing incidents, that combination—speed with scrutiny—is what lets a platform team keep its promise: the database layer stays dependable even as the code behind it accelerates.

## Presentation Outline

### Slide 1 — PlanetScale × Bugbot: Review at Database Scale
- PlanetScale: cloud database infrastructure for workloads with sensitive data.
- Reliability is the product—shipping fast cannot mean shipping fragile.
- Bugbot: agentic PR review built for depth, not just volume.

### Slide 2 — The New Bottleneck: Review Didn’t Scale With Generation
- Coding agents made code generation cheap and fast.
- Human review capacity stayed fixed while code output surged.
- Code review became the gating step—risk and velocity collided.

### Slide 3 — The Capacity Gap: What It Would Have Cost
- PlanetScale would have needed ~2 FTEs dedicated to review alone.
- Reactive triage ≠ assurance; more eyes on PRs doesn’t automatically mean fewer incidents.
- Needed a review layer that scales without diluting rigor.

### Slide 4 — The Fix: Bugbot as the Agentic Review Layer
- Bugbot adopted as a dedicated review layer on top of the PR workflow.
- Reviews 2,000+ PRs monthly—continuous, consistent coverage.
- Complements humans: specialized harness vs. generic “ask the model to read the diff.”

### Slide 5 — What Bugbot Catches (That Linters and Generic LLMs Miss)
- Semantic/logical issues: state sync gaps, broken critical paths, async convergence failures.
- Edge cases with real blast radius—e.g., scenarios tied to production database restarts.
- Unlike static analyzers: surfaces logic and meaning, not just syntax and rules.

### Slide 6 — Proof in the Workflow: Signal, Throughput, and Quotes
- **80%** of Bugbot comments addressed before merge; **~2 FTE** equivalent saved.
- Very high signal-to-noise—actionable findings, not noise for its own sake.
- **Fatih Arslan:** issues a human reviewer “would never imagine to look at.”
- **Sam Lambert:** “If I took Bugbot away… there would be a mutiny.”

### Slide 7 — Reliability as Product, Review as Leverage
- “Every change pushed to production must be flawless.” — Fatih Arslan
- Agentic review doesn’t replace engineering judgment—it protects production reality.
- Takeaway: scale review like you scaled authoring—without trading depth for speed.

## Social Media Posts

### LinkedIn Post

When you run cloud database infrastructure, reliability isn’t a feature—it’s the product. PlanetScale saw the same shift many of us feel: as coding agents made generation fast, **code review became the bottleneck**. Human capacity didn’t scale with output; the team estimates it would have needed **two engineers** just for review—and still would have faced subtle logical risks that linters cannot see.

Their answer was **Bugbot** as a dedicated agentic review layer—now reviewing **2,000+ PRs a month**—catching semantic issues static tools miss (state sync gaps, async convergence problems, edge cases with production impact). The result: **80% of Bugbot comments are addressed before merge**, unlocking capacity equivalent to **two full-time engineers**, with high signal and low noise.

If your roadmap depends on flawless production changes, the lesson is simple: **the harness matters**—generic LLM “review this branch” isn’t the same as a system built for deep PR reasoning at scale.

### Twitter/X Post

PlanetScale runs DB infra where reliability *is* the product. Bugbot reviews 2,000+ PRs/mo; ~80% of its comments get fixed pre-merge—saving ~2 FTE. It catches semantic bugs humans + generic LLMs miss. CEO Sam Lambert: take Bugbot away and “there would be a mutiny.”

### Short Teaser

PlanetScale uses Bugbot for agentic PR review where reliability is everything: **~80%** of Bugbot comments ship fixed pre-merge, saving **~2 FTE**. It reviews **2,000+ PRs/month** and catches semantic bugs linters miss—Fatih Arslan and CEO Sam Lambert on why the team would not give it up.
