# 🚀 StartupForge — Startup Team Building Platform

StartupForge is a role-based platform that connects **startup founders with skilled collaborators**. Founders can create startups, publish opportunities, review applicants, and build their teams, while collaborators can discover opportunities, apply, and track their applications.

The platform also includes an **admin dashboard, analytics, user management, and Stripe-based subscription plans**, making it suitable as a foundation for a SaaS product.

## 🌐 Live Demo

**Live Application:**
https://startup-client-eta.vercel.app/

**Client Repository:** [GitHub Repository](https://github.com/shakirhussaindev/startup-client)

**Server Repository:** [Server Repository](https://github.com/shakirhussaindev/startup-server)

---

## ✨ Key Features

### 🛡️ Admin Dashboard

* Platform overview with revenue, users, startups, and opportunities
* Interactive analytics using Recharts
* Revenue growth chart
* User role distribution
* Subscription plan statistics
* Startup industry and funding-stage analytics
* User management with block/unblock functionality
* Transaction history and Stripe subscription records

### 🚀 Founder Dashboard

* Startup profile creation and management
* Startup logo and branding management
* Create, update, and delete opportunities
* Define required skills and work type
* Set application deadlines
* View and manage candidate applications
* Review candidate pitches, resumes, portfolios, and availability
* Accept or reject applications

### 💼 Collaborator Dashboard

* Personal profile management
* Skills, bio, portfolio, and profile image
* Browse available startup opportunities
* Apply to opportunities
* Track application status
* Status tracking for **Pending, Accepted, and Rejected** applications

### 🔍 Opportunity Explorer

* Search opportunities by title or skills
* Filter by:

  * Work Type
  * Startup Industry
* URL-based pagination and search parameters
* Detailed opportunity and startup pages
* Proper 404 handling for invalid routes

### 💳 Stripe Subscriptions

* Premium plan — **$19.99**
* Enterprise plan — **$49.99**
* Stripe Checkout integration
* Stripe webhook handling
* Subscription data synchronization with MongoDB

---

## 👥 User Roles

| Role             | Main Responsibilities                                                |
| ---------------- | -------------------------------------------------------------------- |
| **Admin**        | Manage users, monitor platform activity, analytics, and transactions |
| **Founder**      | Create startups, publish opportunities, and manage applicants        |
| **Collaborator** | Discover opportunities, apply, and manage applications               |

---

## 🛠️ Technology Stack

### Frontend

* **Next.js** — App Router, Server Actions, Turbopack
* **JavaScript (ES6+)**
* **Tailwind CSS**
* **HeroUI**
* **Framer Motion**
* **Lucide React**
* **Recharts**

### Backend

* **Node.js**
* **Express.js**
* **MongoDB Native Driver**
* **BSON ObjectId**

### Authentication & Security

* **Better Auth**
* **JWT / Secure Cookie Sessions**
* Role-based route protection
* MongoDB ObjectId validation
* Protected admin, founder, and collaborator routes

### Payment & Services

* **Stripe Checkout & Webhooks**
* **ImgBB REST API** for profile and startup images

---

## 🔐 Security & Architecture

StartupForge follows a modern **Server/Client hybrid architecture**.

* React Server Components are used for secure and efficient data fetching.
* Client Components handle interactive features.
* Protected routes prevent unauthorized access between user roles.
* MongoDB ObjectIds are validated before database queries.
* Stripe webhooks synchronize payment information with the database.
* Sensitive authentication data is handled through secure sessions/cookies.

---

## 📊 Platform Workflow

```text
                    StartupForge
                         │
          ┌──────────────┼──────────────┐
          │              │              │
        Admin          Founder      Collaborator
          │              │              │
      Manage Users   Create Startup   Create Profile
      Analytics      Post Jobs        Browse Jobs
      Transactions   Review Apps      Apply
      Subscriptions Accept/Reject     Track Status
```

---

## 🎯 Problem Solved

Finding reliable co-founders and startup collaborators can be difficult through traditional platforms and social media.

StartupForge provides a structured ecosystem where:

* **Founders** can find and evaluate suitable talent.
* **Collaborators** can discover startup opportunities and showcase their skills.
* **Admins** can monitor users, transactions, growth, and platform activity.
* **Platform owners** can build a monetization model through subscriptions.

---

## 📄 License

This project is licensed under the **MIT License**.

See the `LICENSE` file for more information.
