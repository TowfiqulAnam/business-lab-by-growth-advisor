# Business Lab by Growth Advisor

**Developer: Anam**  
**Version: v3.1 — Founder Workspace & Private Account Preparation**

A mobile-responsive, browser-based business simulation that helps founders practice daily decision-making, forecasting, financial analysis, and consistency. Run a simulated Bangladeshi business, balance growth with cash flow, and learn from the results.

## Getting started

1. Download or clone this repository.
2. Open `index.html` directly in a modern browser by double-clicking it or using **Open with**.
3. Select **⚡ 1-Click Instant Demo Business (Try Now!)** for a ready-to-run e-commerce business, or enter your own business details.
4. Select **🚀 Launch My Business & Start Making Money**, plan your decisions, and select **🔥 Run Today's Operations & See Live Sales!**. All money and sales in the game are virtual.

The local app needs no installation or build command. Optional online accounts and private Sheet delivery need the backend configuration described below. An internet connection enables the Tailwind CSS and Font Awesome CDN assets; embedded styling and icon fallbacks support the interface when those assets are unavailable.

## V3.1 changes and activation status

The simulation engine, accounting, COGS/cash separation, RTO formulas, live order feed and celebrations remain unchanged. All browser UI and logic stay inside `index.html`.

- **Dated daily planner:** edit/delete all five original habits, create blank or preset lists for any date, copy a list to an unused date, add tasks, check progress, delete a day's list, and export history CSV. Existing nightly habits migrate into the first dated list once. The notification badge always counts today's incomplete tasks in Asia/Dhaka. Completed history stays intact.
- **Results → reasons → improvement plan:** daily and final reports now link to evidence-based explanations, specific corrective actions and measurable checks. Download a standalone HTML action plan, print/save it as PDF, or add its actions to today's list. Recommendations do not alter game results.
- **Money due:** customer receivables and supplier bills with due dates, partial payments, overdue flags, edit/delete controls and CSV export. This is a real-business organizer separate from simulation cash/profit. The existing project board remains available.
- **Private intake:** the visitor MIS vault and owner Sheet links are removed from the app experience. Visitors only see their consultation form. New submissions no longer create a device-local lead archive. The original V3.0 archive is retained untouched for owner migration.
- **Accounts prepared:** verified email-code signup/sign-in, explicit cloud Save/Load, conflict detection and sign-out clearing are implemented against Supabase. A private lead endpoint validates users and saves submissions to an owner-only table, then writes to the Sheet. **These online features are not live until the owner configures and deploys the backend.** The UI clearly says when setup is pending.

Follow [the backend setup guide](supabase/SETUP.md). The extra files in `supabase/` are server deployment support, not a split frontend. Never embed private keys in the HTML. No paid service has been activated.

Cloud workspace saves include the simulation, dated planner, legacy habit list, project board, owner profile, money-due entries and language. Saves are explicit; local autosave continues to work. Download a JSON backup before replacing this device's workspace with a cloud copy. A stale device cannot silently overwrite a newer cloud revision. Sign out on shared devices.

The private workbook now includes a blank **Consultations** ingestion tab alongside existing **Leads** and **Usage**. Its 28 headers match the original export schema. Keep raw ingestion row positions intact; use a separate tab for sorting/analysis. Automated delivery awaits the owner-controlled Supabase project and Google service-account permission.

Additional local keys: `business_lab_daily_plans_v1`, `business_lab_obligations_v1` and `business_lab_workspace_owner`. Reset Game preserves the business tools. This release was checked with isolated browser tests, including mobile layout, task history, report downloads, original cash/inventory reconciliation and mocked cloud-save conflicts. Live authentication, RLS and Google delivery still require the deployment acceptance checks in the guide.

## Retained enterprise modules

### Consultation intake

The required form captures contact details, business stage, plan, budget and bottlenecks. With consent, signed-in users can submit to Growth Advisor through the private backend when configured. WhatsApp (`8801856084266`) and email (`towfiqul.anam@gmail.com`) drafts remain available; users review and send them themselves. Neither opening a draft nor a failed network call is reported as successful delivery. A confirmed private database save with pending Sheet delivery is shown distinctly.

### Smart report sharing

Daily reports and final scorecards include a WhatsApp consultation CTA. The diagnostic covers the actual starting capital, current/final cash, product revenue, net profit, ROI, delivered units, RTO rate, peak founder stress, and actionable diagnoses such as excessive ad spend, returns, or stock/cash constraints. Historical daily reports share totals through the selected day.

### Bangla and English

Use **বাংলা | EN** in the navigation or a dialog. Labels, headings, actions, unit economics, KPIs, lead fields, default nightly habits, and scorecard content switch without reloading the page. The selected language persists. User-entered names, descriptions, and financial inputs retain their original values. Branded contact details and executive message briefs remain in English for consistent sharing.

### Branded PNG and one-page PDF scorecards

Open **Current Forecast Snapshot** from setup/dashboard, or use the final-scorecard export buttons. Enter an owner name and target market for meeting materials.

- PNG export uses a native 1240 × 1754 canvas, with no external rendering library.
- PDF export uses a dedicated A4 print view. Select **Save as PDF**, A4, and disable browser-added headers/footers if needed.
- Reports include completed-day results, unit economics, COGS, ad spend, courier/RTO cost, profit, ROI, grade, diagnosis, and separate 7/30-day planning forecasts.
- The requested certification seal is a Business Lab simulation mark, not an audited financial statement or professional accreditation.

### Bangladesh presets and five-slide proposal generator

Four one-click setup presets cover clothing, cloud kitchens, gadgets, and FMCG. They load the requested buying, packaging, courier, selling-price, and overhead assumptions with BDT 100,000 starting capital and editable marketing budgets.

| Preset | Buy | Pack | Courier | Price | Daily overhead | Proposal RTO |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Clothing / panjabi / three-piece | 650 | 35 | 110 | 1,350 | 800 | 12% |
| Cloud kitchen / frozen food / biryani | 180 | 30 | 70 | 380 | 600 | 4% |
| Gadgets / smart accessories | 450 | 25 | 100 | 990 | 500 | 15% |
| FMCG / mini-distribution / retail | 220 | 10 | 40 | 310 | 1,000 | 6% |

All amounts are BDT. Presets are planning assumptions, not independently verified market data. FMCG's 6% proposal RTO is an editable default. **The live game's original 5–15% baseline RTO formula and event effects remain unchanged**, including for the food preset. Preset RTO rates affect proposal forecasts only.

The proposal viewer includes executive vision, unit economics, workflow/risk controls, 7/30-day projections, and advisory next steps. Navigate with buttons or keyboard arrows. Download a self-contained `.html` presentation for offline meetings, or print five landscape A4 pages to PDF.

Forecasts use completed-day average order volume when available, otherwise the existing demand model. Each horizon starts from the configured starting capital, replenishes stock subject to cash, and uses current pricing, marketing, fixed overhead, and the editable proposal RTO assumption. Revenue, COGS, packaging, delivery fees, return fees, cash, and remaining inventory reconcile separately. Forecasts exclude random event costs, tax, debt, depreciation, and spoilage; they do not mutate live-game state or guarantee actual returns.

### Lightweight business project board

Use **Business Project Board** to manage a business launch or ongoing work:

- Add/edit milestones with an assignee, due date, priority, and To do / In progress / Done status.
- Review completion percentage and overdue tasks using the Asia/Dhaka calendar date.
- Search, filter by status, delete milestones, or export a project CSV.
- Three starter milestones guide offer validation, supplier confirmation, and a small campaign test.
- Project records save independently and survive Reset Game. The board supports up to 200 milestones.

## Google Drive MIS workspace

The connected account is `towfiqul.anam@gmail.com`.

- [Enterprise MIS workspace](https://drive.google.com/drive/folders/1E_tLHQEOKu6KANQ5TAk8FXX7uLrSjTah)
- [Native MIS lead-vault spreadsheet](https://docs.google.com/spreadsheets/d/1BCo31StL50LDK6YuNqPwXUcRIVIkACo3SgNS3LfQyoA/edit)

Folders organize **Lead MIS**, **Forms and Application**, **Scorecards and Reports**, and **Proposal Decks**. The spreadsheet has matching CSV headers and import instructions. The new Consultations tab is reserved for the private backend. Demo exports contain simulated business data, not collected customer records.

The consultation form lives inside `index.html`. Direct Sheet delivery is implemented by the optional server function and requires deployment; it is not yet active. Manual exports remain available. Owner Sheet and Drive links are documented here but are not shown to app visitors. Google account permissions protect the workbook.

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
- **Ownership signature:** Anam / Growth Advisor credit on every view and modal, with clickable phone and email links.

Animations respect reduced-motion preferences and cap simultaneous storefront tokens. They do not alter accounting or simulation outcomes.

## How the simulation works

The prototype models one product and one unit per order, with same-day cash settlement. Buying inventory uses cash immediately; only delivered units become cost of goods sold. Returned goods re-enter sellable stock, while packaging and courier charges remain expenses. The return courier fee is modeled as 50% of the outbound charge.

Pricing, marketing, reputation, stress, stock availability, cash constraints, and operational decisions affect results. Baseline returns target 5–15%, although small order counts and events can move actual outcomes outside that range. Tax, debt, depreciation, and spoilage are not modeled. Figures are educational assumptions, not verified market forecasts or financial advice.

## Save data and privacy

Progress is stored in `localStorage` in the current browser. Use the same browser and file location to continue a run; private browsing, clearing browser data, or browser restrictions can affect persistence. CSV export downloads completed daily records, not an importable game backup.

The local app has no analytics. Optional online accounts and private consultation delivery require owner setup; see the activation guide. The public UI cannot list leads. Reset Game clears only the simulation. Sign-out clears the working business data on this device, while cloud data remains in the account.

The dated planner saves independently from the simulation. Every date has its own editable list and completion history; all default and custom tasks can be edited or deleted. Copying to a new date resets completion only in the new copy.

| Local storage key | Purpose |
| --- | --- |
| `business-lab-growth-advisor-v1` | Original simulation save, unchanged |
| `business-lab-nightly-tasks-v1` | Nightly habits and custom tasks |
| `growth_advisor_leads` | Legacy V3.0 archive only; no new submissions or public vault UI |
| `business_lab_language` | English/Bangla preference |
| `growth_advisor_business_profile` | Owner, target market, proposal assumptions |
| `growth_advisor_projects_v1` | Project milestones and statuses |

## Feature roadmap

The following remain planned features, not active capabilities in v3.0:

| Feature | Planned experience |
| --- | --- |
| AI Business Advisor Live Audit | Real-time analysis of unit economics and pricing elasticity. |
| Multi-Product & SKU Inventory Matrix | Up to 50 products, dead-stock alerts, and supplier credit terms. |
| B2B Loan, Investor Pitch & Cashflow Crisis Mode | SME loans, EMI management, investor pitches, and equity tradeoffs. |
| Automated CRM & Retargeting Funnel | Follow-up and repeat-purchase campaigns through SMS or WhatsApp. |
| Cloud CRM and opt-in recommendations | V3.1 prepares private accounts and Sheet delivery. Team roles, background retries and separately consented service recommendations remain future work. |
| Future mobile release | Explore a mobile app and commercial release after further product development and validation. |

## Project structure

```text
index.html   Complete application: HTML, CSS, and modular vanilla JavaScript
README.md    Project overview, usage, and roadmap
```

The application intentionally uses a single-file architecture, with Tailwind CSS and Font Awesome referenced via CDN. No bundler or package manager is needed.

## Version history

- **v3.1:** Editable dated daily plans, private account/backend preparation, visitor-safe consultation intake, downloadable improvement plans and customer/supplier dues.
- **v3.0:** Consultation lead CRM, smart WhatsApp diagnostics, Bangla/English toggle, canvas PNG/A4 PDF scorecards, four industry presets, five-slide proposal exports, a local business project board, and a private Drive MIS workspace.
- **v1.1:** Bolder action-driven copy, ownership footer, independently saved nightly tracker, live sales visuals, and profit/loss celebrations. The original simulation engine and application script are preserved unchanged.
- **v1.0:** Working Prototype of Business Lab by Growth Advisor.

Git tags `v1.0`, `v1.1`, `v3.0`, and `v3.1` preserve the milestones. The previous experience upgrade was tagged `v1.1`; no historical V2.0 release is invented. Compare changes with `git diff v1.1 v3.0`, or inspect the original using `git show v1.0:index.html`. The `main` branch tracks the latest version.

All application modules remain inside the single `index.html`. V3.0 adds an enterprise layer while retaining the original simulation, application, and V1.1 experience scripts unchanged. This preserves accounting, COGS/cash separation, live RTO math, game saving, order visuals, celebrations, and the nightly tracker.
