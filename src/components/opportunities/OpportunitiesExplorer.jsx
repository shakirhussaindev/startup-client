
"use client";

import { useState, useMemo } from "react";
import { Briefcase, RotateCcw } from "lucide-react";
import { Button } from "@heroui/react";
// import OpportunityCard from "@/components/opportunities/OpportunityCard";
import OpportunitiesFilterBar from "./OpportunitiesFilterBar";
import OpportunityCard from "./OpportunityCard";

const INITIAL_FILTERS = {
  search: "",
  workType: "all",
  commitment: "all",
  industry: "all",
  status: "all",
};

export default function OpportunitiesExplorer({ initialOpportunities = [] }) {
  const [filters, setFilters] = useState(INITIAL_FILTERS);

  // Filter change updater
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Reset all filters back to default
  const handleResetFilters = () => {
    setFilters(INITIAL_FILTERS);
  };

  // Filter logic across Title, Startup, Skills, Industry, Commitment, WorkType, and Status
  const filteredOpportunities = useMemo(() => {
    return initialOpportunities.filter((opp) => {
      const searchLower = filters.search.trim().toLowerCase();

      // 1. Keyword search (Title, Startup Name, Industry, or Skills Array)
      const matchesSearch =
        !searchLower ||
        opp.title?.toLowerCase().includes(searchLower) ||
        opp.startupName?.toLowerCase().includes(searchLower) ||
        opp.StartupIndustry?.toLowerCase().includes(searchLower) ||
        opp.skills?.some((skill) => skill.toLowerCase().includes(searchLower));

      // 2. Work Type filter ('remote' | 'hybrid' | 'onsite')
      const matchesWorkType =
        filters.workType === "all" ||
        opp.workType?.toLowerCase() === filters.workType.toLowerCase();

      // 3. Commitment level filter ('full-time' | 'part-time' | 'equity')
      const matchesCommitment =
        filters.commitment === "all" ||
        opp.commitment?.toLowerCase() === filters.commitment.toLowerCase();

      // 4. Industry filter
      const matchesIndustry =
        filters.industry === "all" ||
        opp.StartupIndustry?.toLowerCase() === filters.industry.toLowerCase();

      // 5. Status filter ('Active' | 'Closed')
      const matchesStatus =
        filters.status === "all" ||
        opp.status?.toLowerCase() === filters.status.toLowerCase();

      return (
        matchesSearch &&
        matchesWorkType &&
        matchesCommitment &&
        matchesIndustry &&
        matchesStatus
      );
    });
  }, [initialOpportunities, filters]);

  return (
    <div className="space-y-6">
      {/* Dynamic Filter Controls */}
      <OpportunitiesFilterBar
        opportunities={initialOpportunities}
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
        totalResults={filteredOpportunities.length}
      />

      {/* Grid or Empty Results State */}
      {filteredOpportunities.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filteredOpportunities.map((opp) => (
            <OpportunityCard key={opp._id} opportunity={opp} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-default-300 bg-background/50 p-12 text-center backdrop-blur-xl dark:border-default-100/20">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-500">
            <Briefcase size={28} />
          </div>
          <h3 className="mt-4 text-base font-bold text-foreground sm:text-lg">
            No matching opportunities found
          </h3>
          <p className="mt-1 max-w-sm text-xs text-default-500">
            We couldn&apos;t find any opportunities matching your current search and
            filter criteria.
          </p>
          <Button
            size="sm"
            variant="secondary"
            onPress={handleResetFilters}
            className="mt-5 flex items-center gap-2 rounded-xl text-xs font-semibold"
          >
            <RotateCcw size={13} />
            <span>Clear All Filters</span>
          </Button>
        </div>
      )}
    </div>
  );
}
