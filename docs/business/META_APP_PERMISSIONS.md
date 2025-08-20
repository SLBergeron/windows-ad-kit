Below is a ready-to-paste set of App Review justifications for Windows Ad Kit. They’re written in Meta’s preferred style: what the permission enables, how users exercise it in-product (screen-by-screen), the exact Graph calls, and data handling. Keep scope tight and tied to our niche (windows/doors contractors), per the strategic plan.

⸻

App Review – Permissions & Features

1) ads_management (Marketing API)

Why needed (feature): Create and manage ad objects (campaigns, ad sets, ads, creatives) on behalf of the business the user selects during onboarding.
User flow (review video steps):
	1.	User visits Settings → Connect Meta.
	2.	Clicks “Continue with Facebook” → grants requested scopes.
	3.	We show asset picker: user selects Business, Ad Account, and Page they own/admin.
	4.	User clicks Create Campaign → chooses Goal: Lead generation and our Windows & Doors template (prebuilt copy, geo radius, budget).
	5.	App creates: Campaign → Ad Set (location/budget/schedule) → Creative (image/video + primary text).
	6.	User sees confirmation with created IDs and live status; can pause/edit from our dashboard.

Graph endpoints we call (examples):
	•	POST /act_{ad_account_id}/campaigns
	•	POST /act_{ad_account_id}/adsets
	•	POST /act_{ad_account_id}/adcreatives
	•	POST /act_{ad_account_id}/ads
	•	Occasional POST /{ad_id} with status=PAUSED (user-initiated pause)

Data access/retention:
	•	Store ad account ID, campaign/ad IDs, selected Page ID, and scoped access token (encrypted, rotated).
	•	No personal profile data stored.
	•	Delete all stored ad objects we created if user disconnects; purge logs after 30 days.

In-app locations:
	•	/connect/meta (OAuth + asset picker)
	•	/campaigns/new (creation)
	•	/campaigns/{id} (management)

⸻

2) ads_read

Why needed (feature): Read ad/campaign status and performance to power our Analytics and Recommendations screens.
User flow:
	1.	From Analytics, user selects a date range.
	2.	We fetch spend, results, CPL, and breakdowns; show clear per-campaign tables and trend charts.
	3.	User clicks a row to view ad-level metrics; can pause poor performers (this uses ads_management).

Graph endpoints:
	•	GET /act_{ad_account_id}/insights (campaign/adset/ad level with fields: spend, impressions, leads, cpl, actions)
	•	GET /{ad_id} (delivery, effective_status)

Data access/retention:
	•	Cache aggregated metrics for rolling 13 months for reporting; no user PII.
	•	User can delete cached analytics from Settings → Data Controls.

In-app locations: /analytics, /campaigns/{id}/performance

⸻

3) business_management

Why needed (feature): List and connect Business Manager assets (ad accounts, Pages) the user administers, and verify they have the right roles to run ads for their company.
User flow:
	1.	After login, Asset Picker loads businesses the user can manage.
	2.	User selects a business → we show linked ad accounts & Pages for explicit selection.
	3.	We persist only the IDs the user chose.

Graph endpoints:
	•	GET /me/businesses
	•	GET /{business_id}/owned_ad_accounts
	•	GET /{business_id}/owned_pages

Data access/retention:
	•	Store business/ad account/page IDs chosen by the user.
	•	No changes to business structure or roles; read-only discovery of assets.

In-app locations: /connect/meta

⸻

4) pages_manage_ads

Why needed (feature): Create and manage ads associated with a Page (required when promoting Page-connected assets and lead forms).
User flow:
	1.	During campaign creation, user links the ad to their company Page.
	2.	App uses the Page connection for delivery and attribution.
	3.	User can pause/resume ad delivery from our UI.

Graph endpoints:
	•	As in ads_management, with Page-scoped creative/spec where required.

Data access/retention:
	•	Store Page ID selected by the user; no Page posts are created by us.

In-app locations: /campaigns/new (Page selection step)

⸻

5) pages_manage_metadata

Why needed (feature): Manage Page app subscriptions to receive leadgen webhooks (subscribe/unsubscribe the app to the Page).
User flow:
	1.	In Settings → Lead Sync, user toggles “Sync Facebook Leads”.
	2.	We subscribe the app to the Page’s leadgen field; user can turn it off anytime.

Graph endpoints:
	•	POST /{page-id}/subscribed_apps with subscribed_fields=["leadgen"]
	•	DELETE /{page-id}/subscribed_apps (opt-out)

Data access/retention:
	•	Store subscription status only.
	•	Webhook payloads handled per leads_retrieval below.

In-app locations: /settings/integrations/meta

⸻

6) pages_read_engagement

Why needed (feature): Read engagement metadata on Page content tied to active ads (e.g., to show comments/engagement counts alongside ad performance so the contractor can respond in their native tools).
User flow:
	1.	On Campaign Detail, user clicks “Engagement” tab.
	2.	We fetch top-level engagement counts for the ad’s Page post (if applicable) to help the contractor understand sentiment.

Graph endpoints (examples):
	•	GET /{page-id}/posts?fields=id,permalink_url,created_time (for linked posts)
	•	GET /{object-id}?fields=comments.summary(true),reactions.summary(true) (aggregates only)

Data access/retention:
	•	We store aggregate counts only; we do not store individual commenter data.
	•	No publishing or moderation actions.

In-app locations: /campaigns/{id}/engagement

⸻

7) leads_retrieval

Why needed (feature): Retrieve Lead Ads submissions in real time so contractors receive and act on inquiries (quotes, measurements, bookings).
User flow:
	1.	During campaign creation, user can select or auto-create a Lead Form.
	2.	When a person submits the form, our webhook receives the event and we pull the lead via API.
	3.	We display leads in Leads Inbox, send to CRM/email, and mark their ad as “Leads received: N”.

Graph endpoints:
	•	Webhook: leadgen events
	•	GET /{form_id}/leads?fields=created_time,ad_id,adset_id,campaign_id,field_data
	•	GET /{page_id}/leadgen_forms (listing)

Data access/retention:
	•	Store only the form answers and associated ad/campaign IDs for the advertiser that owns the form/Page.
	•	Data encrypted at rest; user can enable auto-deletion after 90 days in Settings.

In-app locations: /leads, /settings/integrations/meta

⸻

Facebook Login (Web) – Implementation Notes (for Review)
	•	Auth: Standard OAuth with redirect URIs:
https://windowadkit.com/api/meta/callback and https://www.windowadkit.com/api/meta/callback (plus localhost for dev).
	•	Consent UX: We list each permission with a short, plain-language reason and link to our Privacy Policy and Data Controls.
	•	User control: Users can disconnect Meta any time (/settings/integrations/meta → Disconnect), which revokes tokens, unsubscribes webhooks, and prompts optional deletion of cached analytics & leads.
	•	Data minimization: We request only the scopes above; we don’t create Page posts, send messages, or access user friends/profile content.

⸻

Screen recording checklist (attach 3–4 short videos)
	1.	Connect & Consent (1–2 min): Login → asset picker → explain each scope → confirm selected Business/Ad Account/Page.
	2.	Create Lead Campaign (2–3 min): Select template → budget/location → create campaign/ad set/ad → show live IDs.
	3.	Lead Sync & Webhook (1–2 min): Toggle “Sync Facebook Leads” → submit a test lead → show it arriving in Leads Inbox.
	4.	Analytics (1–2 min): Open Analytics → fetch insights with ads_read → show pause action uses ads_management.

⸻

Test credentials for reviewers (paste in App Review)
	•	Test Business: Test Window Company
	•	Role: Admin on Business, Ad Account, and Page
	•	Login: test@windowadkit.com / password provided in the review form
	•	Ad Account ID / Page ID: include IDs and a dummy Lead Form ID with usable sample data

⸻

Data handling summary (for the form)
	•	Retention:
	•	Ads insights (aggregates): 13 months (reporting)
	•	Lead data: 90 days by default; configurable per customer
	•	Audit logs: 30 days
	•	Deletion: One-click delete in app; documented endpoint at /legal/data-deletion
	•	Security: Encryption at rest & in transit; scoped tokens; least-privilege roles; monitoring & revocation on disconnect.

⸻

Notes for Meta reviewers (paste in “How you use this permission” fields)

We are a vertical SaaS for windows/doors contractors. Users explicitly select their Business, Ad Account, and Page. We only:
	•	Create/manage ads the user requests (ads_management, pages_manage_ads).
	•	Read performance to show ROI (ads_read).
	•	Subscribe/unsubscribe to leads (pages_manage_metadata) and retrieve only their Lead Ads submissions (leads_retrieval).
	•	Read aggregate engagement numbers to help them gauge ad sentiment (pages_read_engagement).
We do not read personal profile content, do not post Page content, and do not use permissions for any unrelated features.

⸻

Next steps
	•	Drop these texts into App Review → Permissions and Features (one section per scope).
	•	Record and attach the 4 short screen captures listed above.
	•	Add data deletion URL & instructions in the Review form.
	•	Submit with the test business + IDs.

⸻

1-click reusable prompt

Draft App Review justifications for Meta scopes ads_management, ads_read, business_management, pages_manage_ads, pages_manage_metadata, pages_read_engagement, and leads_retrieval for Windows Ad Kit (vertical SaaS for windows/doors contractors). Include: (1) Why needed; (2) User flow; (3) Graph endpoints; (4) Data retention/deletion; (5) In-app screen paths; (6) Screen-recording checklist.

If you want, I can also add exact screenshot text (captions/tooltips) and API request/response snippets to include in your review package.