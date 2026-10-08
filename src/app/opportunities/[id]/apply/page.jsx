import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  ArrowLeft,
  Briefcase,
  Building2,
  CheckCircle2,
  DollarSign,
  MapPin,
  ShieldAlert,
} from "lucide-react";
import { getOpportunityById } from "@/lib/api/opportunities";
import { getUserSession } from "@/lib/core/session";
import ApplyForm from "./ApplyForm";

const OpportunityApplyPage = async ({ params }) => {
  const { id } = await params;
  const user = await getUserSession();

  if (!user) {
    redirect(`/login?redirect=/opportunities/${id}/apply`);
  }

  // Polished Access Denied Card
  if (user.role !== "collaborator") {
    return (
      <main className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-950/80 p-8 text-center shadow-2xl backdrop-blur-md">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/20">
            <ShieldAlert className="h-7 w-7" />
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-zinc-100">
            Collaborator Access Required
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-zinc-400">
            Only verified collaborator accounts can apply for open
            opportunities. Please switch accounts or update your profile role to
            proceed.
          </p>
          <div className="mt-6 flex flex-col gap-2.5">
            <Link
              href={`/opportunities/${id}`}
              className="inline-flex items-center justify-center rounded-xl bg-zinc-800 px-4 py-2.5 text-sm font-medium text-zinc-200 transition-colors hover:bg-zinc-700 hover:text-white"
            >
              Back to Opportunity
            </Link>
            <Link
              href="/logout"
              className="text-xs font-medium text-zinc-500 transition-colors hover:text-zinc-300"
            >
              Sign out and switch account
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const opportunity = await getOpportunityById(id);

  if (!opportunity) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-zinc-400">
          <Link
            href={`/opportunities/${id}`}
            className="group inline-flex items-center gap-1.5 font-medium transition-colors hover:text-zinc-200"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            Back to Opportunity
          </Link>
          <span className="text-zinc-600">/</span>
          <span className="truncate text-zinc-200">Application</span>
        </nav>

        {/* 2-Column Responsive Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Main Form Column (7 Cols) */}
          <section className="lg:col-span-7">
            <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6 shadow-xl backdrop-blur-sm sm:p-8">
              <header className="border-b border-zinc-800/80 pb-6">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                    Submit Application
                  </h1>
                  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
                    <CheckCircle2 className="h-3 w-3" /> Eligible Collaborator
                  </span>
                </div>
                <p className="mt-2 text-sm text-zinc-400">
                  Applying as{" "}
                  <span className="font-medium text-zinc-200">
                    {user.name || user.email}
                  </span>
                  . Make sure your profile and portfolio links are up to date.
                </p>
              </header>

              <div className="mt-6">
                <ApplyForm applicant={user} opportunity={opportunity} />
              </div>
            </div>
          </section>

          {/* Sticky Opportunity Summary Sidebar (5 Cols) */}
          <aside className="lg:col-span-5">
            <div className="sticky top-8 space-y-6">
              <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-6 shadow-xl backdrop-blur-sm">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Role Overview
                </span>

                <h2 className="mt-2 text-xl font-bold text-white">
                  {opportunity.title}
                </h2>

                <div className="mt-3 flex items-center gap-2 text-sm text-zinc-400">
                  <Building2 className="h-4 w-4 text-zinc-500 shrink-0" />
                  <span className="font-medium text-zinc-300">
                    {opportunity.companyName || "Confidential Startup"}
                  </span>
                </div>

                {/* Metadata Pills */}
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-3">
                    <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                      <Briefcase className="h-3.5 w-3.5 text-zinc-500" /> Type
                    </div>
                    <p className="mt-1 text-sm font-medium text-zinc-200">
                      {opportunity.type || "Contract / Equity"}
                    </p>
                  </div>

                  <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-3">
                    <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                      <MapPin className="h-3.5 w-3.5 text-zinc-500" /> Location
                    </div>
                    <p className="mt-1 text-sm font-medium text-zinc-200 truncate">
                      {opportunity.location || "Remote"}
                    </p>
                  </div>

                  <div className="col-span-2 rounded-xl border border-zinc-800 bg-zinc-950/60 p-3">
                    <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                      <DollarSign className="h-3.5 w-3.5 text-zinc-500" />{" "}
                      Compensation
                    </div>
                    <p className="mt-1 text-sm font-medium text-emerald-400">
                      {opportunity.compensation ||
                        "Competitive Equity + Stipend"}
                    </p>
                  </div>
                </div>

                {/* Skills/Tags if available */}
                {opportunity.tags?.length ? (
                  <div className="mt-6">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                      Required Skills
                    </h3>
                    <div className="mt-2.5 flex flex-wrap gap-1.5">
                      {opportunity.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-md border border-zinc-700/60 bg-zinc-800/60 px-2 py-1 text-xs text-zinc-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}

                {/* Brief Excerpt */}
                {opportunity.description ? (
                  <div className="mt-6 border-t border-zinc-800/80 pt-4">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                      Summary
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-zinc-400 line-clamp-4">
                      {opportunity.description}
                    </p>
                  </div>
                ) : null}
              </div>

              {/* Safety / Tips Banner */}
              <div className="rounded-xl border border-zinc-800/60 bg-zinc-950/40 p-4 text-xs text-zinc-400">
                <p className="leading-relaxed">
                  Tip: Detail your past projects and GitHub/live links in your
                  pitch to increase your review velocity.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default OpportunityApplyPage;
