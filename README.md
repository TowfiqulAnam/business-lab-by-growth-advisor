# Business Lab by Growth Advisor

**Developer: Anam**  
**Version: v1.1 — Founder Experience Upgrade**

A mobile-responsive, browser-based business simulation that helps founders practice daily decision-making, forecasting, financial analysis, and consistency. Run a simulated Bangladeshi business, balance growth with cash flow, and learn from the results.

## Getting started

1. Download or clone this repository.
2. Open `index.html` directly in a modern browser by double-clicking it or using **Open with**.
3. Select **⚡ 1-Click Instant Demo Business (Try Now!)** for a ready-to-run e-commerce business, or enter your own business details.
4. Select **🚀 Launch My Business & Start Making Money**, plan your decisions, and select **🔥 Run Today's Operations & See Live Sales!**. All money and sales in the game are virtual.

No installation, build command, backend, or API key is required. An internet connection enables the Tailwind CSS and Font Awesome CDN assets; embedded styling and icon fallbacks support the interface when those assets are unavailable.

## Working prototype features

- **Business setup:** business and product details, a 7-day sprint or 30-day run, starting capital of BDT 100,000–1,000,000, and a live unit-margin calculator.
- **Daily planning:** restocking, pricing, marketing channel and budget, demand estimates, and a recovery-break option.
- **Live operations:** an animated 18-second sales and fulfillment pipeline with timed founder decisions involving customer messages, courier delays, quality checks, and complaints.
- **Financial reporting:** sales funnel, delivered orders, returns, pending leads, detailed profit and loss, cash movement, and inventory value.
- **Founder dashboard:** cash, stock, reputation, stress, forecasts, daily performance, and progress tracking.
- **Advisor scorecard:** revenue, profit, ROI, final cash, unsold inventory, peak stress, a coach grade, and three tailored lessons.
- **Convenience:** local autosave, manual Save Game, pause/resume, Reset Game, CSV results export, and light/dark themes.
- **Nightly action plan:** five founder habits, custom tasks, completion checkboxes, a progress bar, and a live unfinished-task badge accessible from the top bar and dashboard.
- **Live storefront:** animated customer and parcel tokens, grouped for larger order volumes, plus payment badges derived from delivered product revenue after discounts.
- **Daily feedback:** profit confetti, a steady-progress pulse, or a loss alert based on the completed day's net profit. Good-profit effects start at the greater of BDT 1,000 or 0.5% of starting capital; nonnegative results below that threshold use the steady-progress treatment.
- **Ownership signature:** Towfiqul Anam / Growth Advisor credit on every view and modal, with clickable phone and email links.

Animations respect reduced-motion preferences and cap simultaneous storefront tokens. They do not alter accounting or simulation outcomes.

## How the simulation works

The prototype models one product and one unit per order, with same-day cash settlement. Buying inventory uses cash immediately; only delivered units become cost of goods sold. Returned goods re-enter sellable stock, while packaging and courier charges remain expenses. The return courier fee is modeled as 50% of the outbound charge.

Pricing, marketing, reputation, stress, stock availability, cash constraints, and operational decisions affect results. Baseline returns target 5–15%, although small order counts and events can move actual outcomes outside that range. Tax, debt, depreciation, and spoilage are not modeled. Figures are educational assumptions, not verified market forecasts or financial advice.

## Save data and privacy

Progress is stored in `localStorage` in the current browser. Use the same browser and file location to continue a run; private browsing, clearing browser data, or browser restrictions can affect persistence. CSV export downloads completed daily records, not an importable game backup.

The prototype has no account system, analytics, contact collection, backend data transmission, or data-selling functionality. CDN providers receive ordinary asset requests. **Reset Game** clears the current local game after confirmation.

The nightly checklist uses a separate browser storage key. **Reset Checkboxes for a New Day** unchecks tasks while preserving the list, including custom tasks. **Reset Game** preserves the checklist. Custom tasks can be removed individually. Checklist days are reset manually, independently of simulation days.

## Feature roadmap

The following are planned features, not active capabilities in v1.0:

| Feature | Planned experience |
| --- | --- |
| AI Business Advisor Live Audit | Real-time analysis of unit economics and pricing elasticity. |
| Multi-Product & SKU Inventory Matrix | Up to 50 products, dead-stock alerts, and supplier credit terms. |
| B2B Loan, Investor Pitch & Cashflow Crisis Mode | SME loans, EMI management, investor pitches, and equity tradeoffs. |
| Automated CRM & Retargeting Funnel | Follow-up and repeat-purchase campaigns through SMS or WhatsApp. |
| Opt-in Growth Advisor services | Explicit consent to share selected insights for relevant coaching, services, and product recommendations, with export and deletion controls. |
| Future mobile release | Explore a mobile app and commercial release after further product development and validation. |

## Project structure

```text
index.html   Complete application: HTML, CSS, and modular vanilla JavaScript
README.md    Project overview, usage, and roadmap
```

The application intentionally uses a single-file architecture, with Tailwind CSS and Font Awesome referenced via CDN. No bundler or package manager is needed.

## Version history

- **v1.1:** Bolder action-driven copy, ownership footer, independently saved nightly tracker, live sales visuals, and profit/loss celebrations. The original simulation engine and application script are preserved unchanged.
- **v1.0:** Working Prototype of Business Lab by Growth Advisor.

The Git tags `v1.0` and `v1.1` preserve both milestones. Compare them with `git diff v1.0 v1.1`, or inspect a version with `git show v1.0:index.html`. The `main` branch tracks the latest version.
