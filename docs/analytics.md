# SiteLaunchCheck Analytics Documentation

## 1. Overview
SiteLaunchCheck uses **Vercel Web Analytics** (`@vercel/analytics`) to track page views and specific product actions. The goal is to understand how users interact with the tool while preserving complete privacy.

All tracking logic is encapsulated in `lib/analytics.ts`.

## 2. Tracked Events

| Event | Trigger | Properties |
|------|---------|------------|
| `audit_started` | User starts audit (enters URL and clicks Check) | `source_page`, `audit_type` |
| `audit_completed` | Audit succeeds and returns results | `score`, `status`, `total_checks`, `passed_count`, `warning_count`, `critical_count` |
| `audit_failed` | Audit API returns an error or fails | `error_type`, `source_page` |
| `report_generated` | User clicks "View Full Report" | `report_type` |
| `report_downloaded` | User clicks "Download PDF" (either internal or client) | `report_type`, `format` |
| `report_shared` | User clicks "Share Report" (copies link) | `report_type`, `share_method` |
| `another_audit_started` | User clicks "Re-run" or "Run Another Audit" | `source_page` |

## 3. Privacy Standards
SiteLaunchCheck is a free, public tool. Privacy is a core requirement.

**We intentionally DO NOT collect:**
- User emails, passwords, or accounts (there is no auth)
- The audited website URL (this is the most important privacy constraint)
- Page contents from the audited websites
- Full raw HTML or DOM snapshots
- Cookies or tracking pixels
- Exact IP addresses manually

The `audit_completed` event specifically strips out the `url` and only sends aggregated metrics (score, pass count, fail count, etc.).

## 4. How to View Analytics in Vercel
1. Log in to the Vercel dashboard.
2. Navigate to the `SiteLaunchCheck` project.
3. Click on the **Analytics** tab.
4. Ensure "Web Analytics" is enabled in your project settings.
5. In the Analytics dashboard, switch from "Pageviews" to **"Custom Events"** to see the interactions (e.g., `audit_completed`, `report_downloaded`).

## 5. Testing Analytics Locally
1. Start the development server (`npm run dev`).
2. Vercel Analytics automatically disables event tracking in development environments (`NODE_ENV === 'development'`) to avoid muddying production data.
3. To force-test tracking locally, you can temporarily add `mode="production"` to the `<Analytics />` component in `app/layout.tsx`.
4. Check the Network tab in your browser's DevTools. You should see POST requests to `/_vercel/insights/event` when you perform actions.

## 6. How to Add Future Events Safely
1. Add the new event name to `ANALYTICS_EVENTS` inside `lib/analytics.ts`.
2. Create a strictly typed helper function (e.g., `trackNewFeature()`) in `lib/analytics.ts`.
3. Use the helper inside the relevant UI component (`onClick`, form submissions, or fetch `.then()` blocks).
4. **Never** put a bare `trackEvent` inside a generic `useEffect` without strict guards, as React Strict Mode will fire it twice.
