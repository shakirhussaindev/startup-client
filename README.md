StartupForge — Platform for Founders & Collaborators
StartupForge is a role-based ecosystem platform designed to bridge the gap between early-stage startup founders and skilled talent. It empowers founders to build ventures, post collaborative roles, and evaluate applicants, while enabling professionals to discover vetted startups, pitch their expertise, and track opportunities in real time.

🌐 Live Deployment & Links
Live Application: https://startupforge.vercel.app (Replace with your live URL)

Client Repository: GitHub Repository

Server API: Server Repository

💡 Key Benefits & Problem Solved
Frictionless Co-Founder & Talent Matchmaking: Eliminates chaotic outreach by giving founders a structured candidate review pipeline and providing collaborators direct access to vetted ventures.

Granular Role-Based Experiences: Custom dashboards tailor distinct user flows for Admins, Founders, and Collaborators with strict access boundaries.

Monetization-Ready Infrastructure: Integrated Stripe checkout session workflows for tiered subscription plans (Premium and Enterprise), offering scalable SaaS revenue models for ecosystem operators.

Data-Driven Ecosystem Visibility: Built-in interactive visual analytics provide platform admins transparent visibility into user retention, platform growth, revenue velocity, and venture industries.

✨ Features Breakdown
1. 🛡️ Admin Command Center
Ecosystem Overview: Instant high-level summary cards displaying Gross Revenue, Total Platform Users, Registered Startups, and Published Opportunities.

Visual Analytics & Charting: Interactive data visualizations powered by Recharts:

Cumulative Revenue Growth Timeline (Area Chart with dynamic gradient fills).

User Role Demographics (Donut Chart).

Subscription Plan Distribution (Donut Chart).

Venture Categorization by Industry & Funding Stage (Bar Charts).

User Management System: Filterable, sortable user directory with security safeguards preventing accidental admin suspensions and real-time block/unblock capabilities.

Audited Transaction Ledger: Chronological record of Stripe checkout sessions, subscriber emails, plan tiers, and transaction dates.

2. 🚀 Founder Workspace
Dynamic Venture Dashboard: Metric overview monitoring Total Opportunities, Candidate Applications, and Accepted Team Members.

Startup Profile Management: Dedicated branding section for company overview, industry classification, funding stages, and venture logos.

Opportunity Publishing Pipeline: Create and manage collaborative roles specifying work types (Remote, Hybrid, Onsite), required technical skills, and application deadlines.

Candidate Evaluation Table:

Review incoming proposals, candidate pitch notes, and availability timelines.

Direct one-click access to verified candidate resumes and portfolios.

Single-action Accept or Reject decision workflows with immediate data revalidation.

3. 💼 Collaborator Workspace & Talent Hub
Unified Profile & Application Tracker: Hybrid overview displaying personal bio, skills tags, portfolio URLs, and live application counts.

Live Status Pipeline: Real-time visibility into submitted pitches with status badges (Pending, Accepted, Rejected).

Profile Customization Modal: Seamless profile photo updates via ImgBB CDN API, skills configuration, and bio updates.

4. 🔍 Opportunity Explorer & Discovery
Multi-Parameter Search: Real-time search by opportunity title or required technical competencies.

Dynamic Filters: Filter ventures by work arrangements (Remote, Hybrid, Onsite) and target startup industries.

URL-Synced Pagination: Clean URL search-param pagination maintaining bookmarkable search states.

Detailed Dynamic Views: Comprehensive venture detail layouts with graceful 404 (notFound()) boundaries for invalid identifiers.

5. 💳 Stripe Monetization & Subscriptions
Tiered Subscription Plans: Support for Premium ($19.99) and Enterprise ($49.99) checkouts.

Automated Webhook Sync: Background data ingestion synchronizing Stripe checkout sessions directly with MongoDB subscription records.

🛠️ Technology Stack
Category	Technology
Framework	Next.js (App Router, Turbopack, Server Actions)
Language	JavaScript (ES6+)
Styling & Design	Tailwind CSS, Modern Minimalist Design System
Component Library	HeroUI, Lucide React Icons, Framer Motion
Charts & Analytics	Recharts (Responsive SVG Visualization)
Backend & Runtime	Node.js, Express.js
Database	MongoDB (Native Driver, BSON ObjectId)
Authentication	Better Auth / Secure JWT Cookie Sessions
Payment Gateway	Stripe (Checkout API & Webhook Listeners)
Image Hosting	ImgBB REST API


🔒 Security & Best Practices
Server-Client Hybrid Architecture: High-speed data delivery using React Server Components (RSC) for sensitive data fetching and Client Components strictly for interactive UI.

Premise ID Validation: Sanitized MongoDB ObjectIDs preventing malformed query injection and unhandled 500 runtime exceptions.

Protected Role Routing: Dynamic route guards redirecting unauthorized actors attempting access across Founder, Admin, and Collaborator boundaries.

📄 License
Distributed under the MIT License. See LICENSE for more information.