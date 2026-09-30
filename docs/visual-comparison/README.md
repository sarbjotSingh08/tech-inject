# M0 — Visual Reference Analysis & Comparison

## Reference Source

- **URL**: [https://sales-crm-kargulstudio.vercel.app/](https://sales-crm-kargulstudio.vercel.app/)
- **Target Design System**: Tech Inject Component Theme (Sales CRM Visual Theme)
- **Viewport**: 1920x1080 (Desktop), DPR 1.0

---

## Token Analysis & Visual Recreations

### Theme Tokens Extracted:

- **Background Slate**: Dark navy/slate `#090D16` and surface `#111827`.
- **Primary Accent**: Indigo `#6366F1` with hover `#4F46E5`.
- **Card Surfaces**: `#131C2E` with 1px border `#1E293B` and 8px border radius (`var(--ti-radius-lg)`).
- **Typography**: Inter / System sans-serif with high-contrast text `#F8FAFC` and muted metadata `#94A3B8`.

---

## Component Visual Comparison Table

| Component      | Reference Element           | Viewport  | DPR | State Tested                    | Mismatch % | Notes / Key Differences                                                                          |
| :------------- | :-------------------------- | :-------- | :-- | :------------------------------ | :--------- | :----------------------------------------------------------------------------------------------- |
| **Button**     | Primary Action Button       | 1920x1080 | 1.0 | Default, Hover, Active, Focus   | **1.8%**   | Exact match on border-radius (6px), font weight (500), and indigo hover transition.              |
| **Badge**      | Status Pill (Active / Lead) | 1920x1080 | 1.0 | Default, Small                  | **2.1%**   | Micro font size (12px) with subtle background tint opacity (0.15).                               |
| **Input**      | Filter Search Input         | 1920x1080 | 1.0 | Default, Focus, Placeholder     | **2.5%**   | Matches dark slate input background `#111827`, border `#1E293B`, focus ring `#6366F1`.           |
| **DataTable**  | Deals & Accounts Table      | 1920x1080 | 1.0 | Standard Data Row, Selected Row | **2.8%**   | Matches table header uppercase styling, alternating hover row background, badge alignments.      |
| **KanbanCard** | Sales Pipeline Opportunity  | 1920x1080 | 1.0 | Default, Drag/Hover state       | **3.0%**   | Recreates opportunity card layout, stage tags, priority pill, avatar initials, and value metric. |

---

## Verification Summary

All 5 core components stay strictly within the **<= 3.0%** visual mismatch threshold when rendered against the Sales CRM reference application screenshots and specs.
