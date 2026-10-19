# Pulse Fitness Studio

A responsive website for a high-performance fitness studio in Portland, OR.
Originally built with plain HTML5 and CSS3, and rebuilt in Week 2 using **React + Tailwind CSS** inside `pulse-react/`.

---

## ⚡ React + Tailwind Version (`pulse-react/`)

Rebuilt following the Week 2 BrewHaus pattern:

- **Vite + React** (JavaScript, no TypeScript, no external icon/UI libraries)
- **Tailwind CSS** fully wired in for all styling
- **Componentized architecture**: `Header`, `Hero`, `MainContent`, `Footer`
- **Central Data File**: `src/data.js` containing classes, trainers, pricing, and studio info
- **Real Filter**: Filter classes by category (`All`, `HIIT`, `Yoga`, `Strength`, `Cycle`, `Boxing`) with `useState`
- **Controlled Component**: `QuantityStepper` reused per class card to select reserve spots
- **Mobile-First Responsive Layout**: unprefixed $\to$ `sm:` $\to$ `md:` $\to$ `lg:`, no horizontal overflow on any device

### Running Locally
```bash
cd pulse-react
npm install
npm run dev
```

### Production Build & Lint
```bash
cd pulse-react
npm run build
npm run lint
```

---

## 🖥️ Original Vanilla Version

Open `index.html` in any modern browser — no dependencies or build steps required.
