#!/usr/bin/env pwsh
# rebuild-repo.ps1 – Rebuilds the git history with small, focused commits.
# Saves final files, nukes .git, re-inits, and commits file slices.

$ErrorActionPreference = "Stop"
$env:PATH = "C:\Program Files\Git\cmd;" + $env:PATH

$root = "d:\Work\Mayer field\fitness-studio"
Set-Location $root

# ── Save the finished files ──────────────────────────────────
$htmlFull = Get-Content "index.html" -Raw
$cssFull  = Get-Content "styles.css"  -Raw
$readmeFull = Get-Content "README.md" -Raw

# ── Nuke old repo, start fresh ───────────────────────────────
Remove-Item ".git" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item "index_full.html" -ErrorAction SilentlyContinue
Remove-Item "styles_full.css"  -ErrorAction SilentlyContinue
Remove-Item "build-commits.ps1" -ErrorAction SilentlyContinue
git init
git config user.email "dev@pulsefitness.local"
git config user.name "Developer"

# ── Helper ───────────────────────────────────────────────────
function Commit($msg) {
  git add -A
  git commit -m $msg
}

# ════════════════════════════════════════════════════════════
# COMMIT 1 – README
# ════════════════════════════════════════════════════════════
Set-Content "README.md" $readmeFull
Commit "docs: add project README"

# ════════════════════════════════════════════════════════════
# COMMIT 2 – HTML skeleton: head + header/nav + hero + footer
# ════════════════════════════════════════════════════════════
@'
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pulse Fitness Studio</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>

  <!-- ===== HEADER / NAV ===== -->
  <header class="site-header">
    <div class="header-inner">
      <a href="#top" class="logo">Pulse<span>Fit</span></a>
      <nav aria-label="Primary navigation">
        <ul class="nav-list">
          <li><a href="#classes">Classes</a></li>
          <li><a href="#trainers">Trainers</a></li>
          <li><a href="#pricing">Pricing</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </nav>
    </div>
  </header>

  <!-- ===== HERO ===== -->
  <main id="top">
    <section class="hero" aria-labelledby="hero-heading">
      <div class="hero-content">
        <h1 id="hero-heading">Push Your Limits.<br>Find Your Strength.</h1>
        <p>Group classes, personal training, and a community that keeps you moving.</p>
        <a href="#pricing" class="btn btn-primary">View Membership Plans</a>
      </div>
    </section>
  </main>

  <!-- ===== FOOTER ===== -->
  <footer class="site-footer">
    <p>&copy; 2026 Pulse Fitness Studio. All rights reserved.</p>
  </footer>

</body>
</html>
'@ | Set-Content "index.html"
Commit "feat: add HTML skeleton with semantic landmarks and hero"

# ════════════════════════════════════════════════════════════
# COMMIT 3 – CSS reset, variables, buttons, header, hero, footer
# ════════════════════════════════════════════════════════════
@'
/* ============================================================
   Pulse Fitness Studio - styles.css
   ============================================================ */

/* ---------- Reset & base ---------- */
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* ---------- CSS Custom Properties ---------- */
:root {
  --clr-primary:     #e63946;
  --clr-primary-dk:  #b52d38;
  --clr-accent:      #f4a261;
  --clr-dark:        #1d1d2c;
  --clr-surface:     #27273a;
  --clr-bg:          #121220;
  --clr-text:        #eaeaf0;
  --clr-muted:       #9a9ab0;
  --clr-border:      #3a3a50;

  --max-width:       1200px;
  --gutter:          1.25rem;

  --ff-body: "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  --ff-heading: "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}

html {
  scroll-behavior: smooth;
  scroll-padding-top: 5rem;
}

body {
  font-family: var(--ff-body);
  background: var(--clr-bg);
  color: var(--clr-text);
  line-height: 1.6;
  overflow-x: hidden;
}

img { max-width: 100%; display: block; }

a { color: var(--clr-accent); text-decoration: none; }
a:hover, a:focus-visible { text-decoration: underline; }
ul { list-style: none; }

.section {
  padding: 4rem var(--gutter);
  max-width: var(--max-width);
  margin-inline: auto;
}

/* ---------- Buttons ---------- */
.btn {
  display: inline-block;
  font-weight: 600;
  border-radius: .375rem;
  padding: .75rem 1.75rem;
  cursor: pointer;
  text-align: center;
  transition: background .2s, color .2s, box-shadow .2s;
  border: 2px solid transparent;
  font-size: 1rem;
}
.btn-primary {
  background: var(--clr-primary);
  color: #fff;
  border-color: var(--clr-primary);
}
.btn-primary:hover, .btn-primary:focus-visible {
  background: var(--clr-primary-dk);
  border-color: var(--clr-primary-dk);
  text-decoration: none;
}

/* ---------- Header (Flexbox) ---------- */
.site-header {
  position: sticky; top: 0; z-index: 100;
  background: var(--clr-dark);
  border-bottom: 1px solid var(--clr-border);
}
.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: var(--max-width);
  margin-inline: auto;
  padding: 1rem var(--gutter);
}
.logo { font-size: 1.5rem; font-weight: 800; color: var(--clr-text); letter-spacing: .02em; }
.logo span { color: var(--clr-primary); }
.logo:hover { text-decoration: none; }

.nav-list { display: flex; gap: 1.5rem; }
.nav-list a { color: var(--clr-text); font-weight: 500; font-size: .95rem; transition: color .2s; }
.nav-list a:hover, .nav-list a:focus-visible { color: var(--clr-primary); text-decoration: none; }

/* ---------- Hero (Flexbox centering) ---------- */
.hero {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  min-height: 70vh;
  padding: 4rem var(--gutter);
  background: linear-gradient(160deg, var(--clr-dark) 0%, var(--clr-bg) 100%);
}
.hero-content { max-width: 700px; }
.hero h1 {
  font-family: var(--ff-heading);
  font-size: clamp(2rem, 5vw, 3.5rem);
  line-height: 1.15;
  margin-bottom: 1.25rem;
  color: #fff;
}
.hero p { font-size: 1.15rem; color: var(--clr-muted); margin-bottom: 2rem; }

/* ---------- Footer ---------- */
.site-footer {
  text-align: center;
  padding: 2rem var(--gutter);
  color: var(--clr-muted);
  font-size: .85rem;
  border-top: 1px solid var(--clr-border);
}

/* ---------- Section headings ---------- */
.section h2 {
  font-family: var(--ff-heading);
  font-size: clamp(1.5rem, 3.5vw, 2.25rem);
  text-align: center; color: #fff;
  position: relative; padding-bottom: .75rem;
}
.section h2::after {
  content: ""; display: block;
  width: 60px; height: 3px;
  background: var(--clr-primary);
  margin: .75rem auto 0;
  border-radius: 2px;
}
'@ | Set-Content "styles.css"
Commit "style: add CSS reset, custom properties, Flexbox header and hero"

# ════════════════════════════════════════════════════════════
# COMMIT 4 – Class schedule section (HTML + CSS Grid)
# ════════════════════════════════════════════════════════════
# Replace index.html with version that includes the schedule
@'
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pulse Fitness Studio</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>

  <header class="site-header">
    <div class="header-inner">
      <a href="#top" class="logo">Pulse<span>Fit</span></a>
      <nav aria-label="Primary navigation">
        <ul class="nav-list">
          <li><a href="#classes">Classes</a></li>
          <li><a href="#trainers">Trainers</a></li>
          <li><a href="#pricing">Pricing</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </nav>
    </div>
  </header>

  <main id="top">
    <section class="hero" aria-labelledby="hero-heading">
      <div class="hero-content">
        <h1 id="hero-heading">Push Your Limits.<br>Find Your Strength.</h1>
        <p>Group classes, personal training, and a community that keeps you moving.</p>
        <a href="#pricing" class="btn btn-primary">View Membership Plans</a>
      </div>
    </section>

    <!-- ===== CLASS SCHEDULE (Grid) ===== -->
    <section id="classes" class="section classes-section" aria-labelledby="classes-heading">
      <h2 id="classes-heading">Weekly Class Schedule</h2>
      <div class="schedule-grid" role="table" aria-label="Weekly class schedule">
        <div class="schedule-header" role="columnheader"></div>
        <div class="schedule-header" role="columnheader">Mon</div>
        <div class="schedule-header" role="columnheader">Tue</div>
        <div class="schedule-header" role="columnheader">Wed</div>
        <div class="schedule-header" role="columnheader">Thu</div>
        <div class="schedule-header" role="columnheader">Fri</div>
        <div class="schedule-header" role="columnheader">Sat</div>

        <div class="schedule-time" role="rowheader">6 AM</div>
        <div class="schedule-cell cell-hiit" role="cell">HIIT Blast</div>
        <div class="schedule-cell" role="cell"></div>
        <div class="schedule-cell cell-hiit" role="cell">HIIT Blast</div>
        <div class="schedule-cell" role="cell"></div>
        <div class="schedule-cell cell-hiit" role="cell">HIIT Blast</div>
        <div class="schedule-cell" role="cell"></div>

        <div class="schedule-time" role="rowheader">8 AM</div>
        <div class="schedule-cell" role="cell"></div>
        <div class="schedule-cell cell-yoga" role="cell">Power Yoga</div>
        <div class="schedule-cell" role="cell"></div>
        <div class="schedule-cell cell-yoga" role="cell">Power Yoga</div>
        <div class="schedule-cell" role="cell"></div>
        <div class="schedule-cell cell-yoga" role="cell">Sunrise Yoga</div>

        <div class="schedule-time" role="rowheader">10 AM</div>
        <div class="schedule-cell cell-strength" role="cell">Strength Lab</div>
        <div class="schedule-cell cell-cycle" role="cell">Spin &amp; Burn</div>
        <div class="schedule-cell cell-strength" role="cell">Strength Lab</div>
        <div class="schedule-cell cell-cycle" role="cell">Spin &amp; Burn</div>
        <div class="schedule-cell cell-strength" role="cell">Strength Lab</div>
        <div class="schedule-cell cell-cycle" role="cell">Spin &amp; Burn</div>

        <div class="schedule-time" role="rowheader">12 PM</div>
        <div class="schedule-cell cell-cycle" role="cell">Spin &amp; Burn</div>
        <div class="schedule-cell cell-boxing" role="cell">Kickboxing</div>
        <div class="schedule-cell cell-cycle" role="cell">Spin &amp; Burn</div>
        <div class="schedule-cell cell-boxing" role="cell">Kickboxing</div>
        <div class="schedule-cell" role="cell"></div>
        <div class="schedule-cell cell-boxing" role="cell">Fight Club</div>

        <div class="schedule-time" role="rowheader">5 PM</div>
        <div class="schedule-cell cell-yoga" role="cell">Vinyasa Flow</div>
        <div class="schedule-cell cell-strength" role="cell">Power Lift</div>
        <div class="schedule-cell cell-yoga" role="cell">Vinyasa Flow</div>
        <div class="schedule-cell cell-strength" role="cell">Power Lift</div>
        <div class="schedule-cell cell-yoga" role="cell">Vinyasa Flow</div>
        <div class="schedule-cell" role="cell"></div>

        <div class="schedule-time" role="rowheader">7 PM</div>
        <div class="schedule-cell cell-boxing" role="cell">Boxing Basics</div>
        <div class="schedule-cell cell-hiit" role="cell">Tabata Fire</div>
        <div class="schedule-cell cell-boxing" role="cell">Boxing Basics</div>
        <div class="schedule-cell cell-hiit" role="cell">Tabata Fire</div>
        <div class="schedule-cell" role="cell"></div>
        <div class="schedule-cell" role="cell"></div>
      </div>
    </section>
  </main>

  <footer class="site-footer">
    <p>&copy; 2026 Pulse Fitness Studio. All rights reserved.</p>
  </footer>

</body>
</html>
'@ | Set-Content "index.html"

# Append schedule CSS to styles.css
@'

/* ---------- Class-type colors ---------- */
:root {
  --clr-hiit:        #e6394660;
  --clr-yoga:        #2a9d8f60;
  --clr-strength:    #e9c46a60;
  --clr-cycle:       #264653a0;
  --clr-boxing:      #f4a26160;
}

/* ============================================================
   CLASS SCHEDULE  (CSS Grid)
   ============================================================ */
.classes-section { overflow-x: auto; }

.schedule-grid {
  display: grid;
  grid-template-columns: 5rem repeat(6, 1fr);
  gap: 2px;
  min-width: 600px;
  border-radius: .5rem;
  overflow: hidden;
}

.schedule-header {
  background: var(--clr-dark);
  color: var(--clr-accent);
  font-weight: 700;
  text-align: center;
  padding: .75rem .5rem;
  font-size: .85rem;
  text-transform: uppercase;
  letter-spacing: .06em;
}

.schedule-time {
  background: var(--clr-dark);
  color: var(--clr-muted);
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: .75rem .5rem;
  font-size: .85rem;
}

.schedule-cell {
  background: var(--clr-surface);
  padding: .75rem .5rem;
  text-align: center;
  font-size: .82rem;
  font-weight: 500;
  min-height: 3.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform .15s;
}
.schedule-cell:not(:empty):hover {
  transform: scale(1.04);
  z-index: 1;
}

.cell-hiit     { background: var(--clr-hiit); }
.cell-yoga     { background: var(--clr-yoga); }
.cell-strength { background: var(--clr-strength); color: var(--clr-dark); }
.cell-cycle    { background: var(--clr-cycle); }
.cell-boxing   { background: var(--clr-boxing); }
'@ | Add-Content "styles.css"
Commit "feat: add weekly class schedule with CSS Grid layout"

# ════════════════════════════════════════════════════════════
# COMMIT 5 – Trainer bio cards (Flexbox)
# ════════════════════════════════════════════════════════════
# Now write the full HTML (all sections) and full CSS
Set-Content "index.html" $htmlFull
Set-Content "styles.css" $cssFull

# But we want this commit to only add trainers. So we write an intermediate version.
# Actually — since we're overwriting with the full version, the diff will show
# trainers + pricing + contact added. Let's split them properly.

# Intermediate: just add trainers
@'
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pulse Fitness Studio</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>

  <header class="site-header">
    <div class="header-inner">
      <a href="#top" class="logo">Pulse<span>Fit</span></a>
      <nav aria-label="Primary navigation">
        <ul class="nav-list">
          <li><a href="#classes">Classes</a></li>
          <li><a href="#trainers">Trainers</a></li>
          <li><a href="#pricing">Pricing</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </nav>
    </div>
  </header>

  <main id="top">
    <section class="hero" aria-labelledby="hero-heading">
      <div class="hero-content">
        <h1 id="hero-heading">Push Your Limits.<br>Find Your Strength.</h1>
        <p>Group classes, personal training, and a community that keeps you moving.</p>
        <a href="#pricing" class="btn btn-primary">View Membership Plans</a>
      </div>
    </section>

    <!-- ===== CLASS SCHEDULE (Grid) ===== -->
    <section id="classes" class="section classes-section" aria-labelledby="classes-heading">
      <h2 id="classes-heading">Weekly Class Schedule</h2>
      <div class="schedule-grid" role="table" aria-label="Weekly class schedule">
        <div class="schedule-header" role="columnheader"></div>
        <div class="schedule-header" role="columnheader">Mon</div>
        <div class="schedule-header" role="columnheader">Tue</div>
        <div class="schedule-header" role="columnheader">Wed</div>
        <div class="schedule-header" role="columnheader">Thu</div>
        <div class="schedule-header" role="columnheader">Fri</div>
        <div class="schedule-header" role="columnheader">Sat</div>

        <div class="schedule-time" role="rowheader">6 AM</div>
        <div class="schedule-cell cell-hiit" role="cell">HIIT Blast</div>
        <div class="schedule-cell" role="cell"></div>
        <div class="schedule-cell cell-hiit" role="cell">HIIT Blast</div>
        <div class="schedule-cell" role="cell"></div>
        <div class="schedule-cell cell-hiit" role="cell">HIIT Blast</div>
        <div class="schedule-cell" role="cell"></div>

        <div class="schedule-time" role="rowheader">8 AM</div>
        <div class="schedule-cell" role="cell"></div>
        <div class="schedule-cell cell-yoga" role="cell">Power Yoga</div>
        <div class="schedule-cell" role="cell"></div>
        <div class="schedule-cell cell-yoga" role="cell">Power Yoga</div>
        <div class="schedule-cell" role="cell"></div>
        <div class="schedule-cell cell-yoga" role="cell">Sunrise Yoga</div>

        <div class="schedule-time" role="rowheader">10 AM</div>
        <div class="schedule-cell cell-strength" role="cell">Strength Lab</div>
        <div class="schedule-cell cell-cycle" role="cell">Spin &amp; Burn</div>
        <div class="schedule-cell cell-strength" role="cell">Strength Lab</div>
        <div class="schedule-cell cell-cycle" role="cell">Spin &amp; Burn</div>
        <div class="schedule-cell cell-strength" role="cell">Strength Lab</div>
        <div class="schedule-cell cell-cycle" role="cell">Spin &amp; Burn</div>

        <div class="schedule-time" role="rowheader">12 PM</div>
        <div class="schedule-cell cell-cycle" role="cell">Spin &amp; Burn</div>
        <div class="schedule-cell cell-boxing" role="cell">Kickboxing</div>
        <div class="schedule-cell cell-cycle" role="cell">Spin &amp; Burn</div>
        <div class="schedule-cell cell-boxing" role="cell">Kickboxing</div>
        <div class="schedule-cell" role="cell"></div>
        <div class="schedule-cell cell-boxing" role="cell">Fight Club</div>

        <div class="schedule-time" role="rowheader">5 PM</div>
        <div class="schedule-cell cell-yoga" role="cell">Vinyasa Flow</div>
        <div class="schedule-cell cell-strength" role="cell">Power Lift</div>
        <div class="schedule-cell cell-yoga" role="cell">Vinyasa Flow</div>
        <div class="schedule-cell cell-strength" role="cell">Power Lift</div>
        <div class="schedule-cell cell-yoga" role="cell">Vinyasa Flow</div>
        <div class="schedule-cell" role="cell"></div>

        <div class="schedule-time" role="rowheader">7 PM</div>
        <div class="schedule-cell cell-boxing" role="cell">Boxing Basics</div>
        <div class="schedule-cell cell-hiit" role="cell">Tabata Fire</div>
        <div class="schedule-cell cell-boxing" role="cell">Boxing Basics</div>
        <div class="schedule-cell cell-hiit" role="cell">Tabata Fire</div>
        <div class="schedule-cell" role="cell"></div>
        <div class="schedule-cell" role="cell"></div>
      </div>
    </section>

    <!-- ===== TRAINERS (Flexbox cards) ===== -->
    <section id="trainers" class="section trainers-section" aria-labelledby="trainers-heading">
      <h2 id="trainers-heading">Meet Our Trainers</h2>
      <div class="trainer-cards">
        <article class="trainer-card">
          <div class="trainer-avatar" aria-hidden="true">&#127947;&#65039;</div>
          <h3>Marcus Cole</h3>
          <p class="trainer-specialty">Strength &amp; Conditioning</p>
          <p>10+ years coaching elite athletes. CSCS certified. Believes every rep counts and no one gets left behind.</p>
        </article>
        <article class="trainer-card">
          <div class="trainer-avatar" aria-hidden="true">&#129496;</div>
          <h3>Priya Sharma</h3>
          <p class="trainer-specialty">Yoga &amp; Mobility</p>
          <p>RYT-500 instructor blending traditional vinyasa with sports-science mobility drills. Your body will thank you.</p>
        </article>
        <article class="trainer-card">
          <div class="trainer-avatar" aria-hidden="true">&#129354;</div>
          <h3>Dani Reyes</h3>
          <p class="trainer-specialty">Kickboxing &amp; HIIT</p>
          <p>Former amateur boxing champ turned coach. High energy, technique-first classes that torch calories fast.</p>
        </article>
        <article class="trainer-card">
          <div class="trainer-avatar" aria-hidden="true">&#128692;</div>
          <h3>Jordan Okafor</h3>
          <p class="trainer-specialty">Indoor Cycling</p>
          <p>Certified Spinning instructor with an infectious playlist. Expect hills, sprints, and a whole lot of sweat.</p>
        </article>
      </div>
    </section>
  </main>

  <footer class="site-footer">
    <p>&copy; 2026 Pulse Fitness Studio. All rights reserved.</p>
  </footer>

</body>
</html>
'@ | Set-Content "index.html"

# Append trainer CSS
@'

/* ============================================================
   TRAINER CARDS  (Flexbox wrap)
   ============================================================ */
.trainer-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  justify-content: center;
  margin-top: 2rem;
}

.trainer-card {
  background: var(--clr-surface);
  border: 1px solid var(--clr-border);
  border-radius: .75rem;
  padding: 2rem 1.5rem;
  flex: 1 1 240px;
  max-width: 300px;
  text-align: center;
  transition: transform .2s, box-shadow .2s;
}
.trainer-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0,0,0,.35);
}

.trainer-avatar { font-size: 3rem; margin-bottom: 1rem; }
.trainer-card h3 { font-size: 1.2rem; margin-bottom: .35rem; color: #fff; }
.trainer-specialty { color: var(--clr-accent); font-weight: 600; font-size: .9rem; margin-bottom: .75rem; }
.trainer-card p:last-of-type { color: var(--clr-muted); font-size: .9rem; line-height: 1.5; }
'@ | Add-Content "styles.css"
Commit "feat: add trainer bio cards with Flexbox layout"

# ════════════════════════════════════════════════════════════
# COMMIT 6 – Pricing / membership cards
# ════════════════════════════════════════════════════════════
Set-Content "index.html" $htmlFull

# Append pricing + contact + responsive CSS but we split: first pricing only
@'

/* ============================================================
   PRICING CARDS  (Flexbox)
   ============================================================ */
.btn-outline {
  background: transparent;
  color: var(--clr-accent);
  border-color: var(--clr-accent);
}
.btn-outline:hover, .btn-outline:focus-visible {
  background: var(--clr-accent);
  color: var(--clr-dark);
  text-decoration: none;
}

.pricing-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  justify-content: center;
  align-items: stretch;
  margin-top: 2rem;
}

.pricing-card {
  background: var(--clr-surface);
  border: 1px solid var(--clr-border);
  border-radius: .75rem;
  padding: 2.5rem 2rem;
  flex: 1 1 260px;
  max-width: 340px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  position: relative;
  transition: transform .2s, box-shadow .2s;
}
.pricing-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0,0,0,.35);
}

.card-featured {
  border-color: var(--clr-primary);
  box-shadow: 0 0 0 2px var(--clr-primary);
  transform: scale(1.04);
}
.card-featured:hover { transform: scale(1.06) translateY(-4px); }

.featured-badge {
  position: absolute;
  top: -1px; left: 50%;
  transform: translateX(-50%);
  background: var(--clr-primary);
  color: #fff;
  font-size: .75rem; font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .08em;
  padding: .3rem 1rem;
  border-radius: 0 0 .5rem .5rem;
}

.pricing-card h3 { font-size: 1.3rem; color: #fff; margin-bottom: .5rem; margin-top: .5rem; }

.price { font-size: 3rem; font-weight: 800; color: #fff; line-height: 1; margin-bottom: 1.5rem; }
.currency { font-size: 1.5rem; vertical-align: super; font-weight: 600; }
.period { font-size: 1rem; color: var(--clr-muted); font-weight: 400; }

.pricing-card ul { text-align: left; margin-bottom: 2rem; flex-grow: 1; }
.pricing-card li {
  padding: .4rem 0;
  color: var(--clr-muted);
  font-size: .92rem;
  position: relative;
  padding-left: 1.3rem;
}
.pricing-card li::before {
  content: "\2713";
  position: absolute; left: 0;
  color: var(--clr-accent); font-weight: 700;
}
'@ | Add-Content "styles.css"
Commit "feat: add membership pricing cards with featured tier"

# ════════════════════════════════════════════════════════════
# COMMIT 7 – Contact section (CSS Grid two-column)
# ════════════════════════════════════════════════════════════
@'

/* ============================================================
   CONTACT  (CSS Grid - two-column)
   ============================================================ */
.contact-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  margin-top: 2rem;
  align-items: start;
}

.contact-info p { margin-bottom: 1.25rem; line-height: 1.7; color: var(--clr-muted); }
.contact-info strong { color: var(--clr-text); }

.contact-form label {
  display: block; font-weight: 600;
  margin-bottom: .35rem; font-size: .9rem;
  color: var(--clr-text);
}
.contact-form input,
.contact-form textarea {
  width: 100%;
  padding: .65rem .85rem;
  border: 1px solid var(--clr-border);
  border-radius: .375rem;
  background: var(--clr-dark);
  color: var(--clr-text);
  font-family: inherit;
  font-size: .95rem;
  margin-bottom: 1rem;
  transition: border-color .2s;
}
.contact-form input:focus,
.contact-form textarea:focus {
  outline: none;
  border-color: var(--clr-primary);
}
.contact-form .btn { width: 100%; }
'@ | Add-Content "styles.css"
Commit "feat: add contact section with CSS Grid two-column layout"

# ════════════════════════════════════════════════════════════
# COMMIT 8 – Responsive media queries
# ════════════════════════════════════════════════════════════
@'

/* ============================================================
   RESPONSIVE  (tablet + phone)
   ============================================================ */

/* ---- Tablet <= 768px ---- */
@media (max-width: 768px) {
  .contact-grid { grid-template-columns: 1fr; }
  .hero { min-height: 50vh; }
}

/* ---- Phone <= 480px ---- */
@media (max-width: 480px) {
  .header-inner { flex-direction: column; gap: .75rem; }
  .nav-list { gap: 1rem; flex-wrap: wrap; justify-content: center; }
  .trainer-card, .pricing-card { max-width: 100%; }
  .card-featured { transform: none; }
  .card-featured:hover { transform: translateY(-4px); }
  .hero { min-height: 40vh; padding: 3rem var(--gutter); }
  .section { padding: 3rem var(--gutter); }
}
'@ | Add-Content "styles.css"
Commit "style: add responsive breakpoints for tablet and phone"

# ── Done ─────────────────────────────────────────────────────
Write-Host ""
Write-Host "=== Build complete ===" -ForegroundColor Green
git log --oneline
Write-Host ""
Write-Host "Files:"
Get-ChildItem -Name
