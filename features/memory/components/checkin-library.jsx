"use client";

import { useMemo, useState } from "react";
import { CheckinFilters } from "@/features/memory/components/checkin-filters";
import { CheckinGrid } from "@/features/memory/components/checkin-grid";
import { CheckinLibrarySummary } from "@/features/memory/components/checkin-library-summary";
import { checkins } from "@/entities/memory";

export function CheckinLibrary() {
  const [query, setQuery] = useState("");
  const [categoryId, setCategoryId] = useState("all");
  const [moodId, setMoodId] = useState("all");
  const [sort, setSort] = useState("newest");

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return checkins
      .filter((checkin) => {
        const queryMatch =
          !normalizedQuery ||
          checkin.title.toLowerCase().includes(normalizedQuery) ||
          checkin.locationName.toLowerCase().includes(normalizedQuery) ||
          checkin.city.toLowerCase().includes(normalizedQuery);
        const categoryMatch = categoryId === "all" || checkin.categoryId === categoryId;
        const moodMatch = moodId === "all" || checkin.moodId === moodId;
        return queryMatch && categoryMatch && moodMatch;
      })
      .toSorted((a, b) => {
        const left = new Date(a.checkinTime).getTime();
        const right = new Date(b.checkinTime).getTime();
        return sort === "newest" ? right - left : left - right;
      });
  }, [categoryId, moodId, query, sort]);

  return (
    <>
      <CheckinFilters
        categoryId={categoryId}
        moodId={moodId}
        onCategoryChange={setCategoryId}
        onMoodChange={setMoodId}
        onQueryChange={setQuery}
        onSortChange={setSort}
        query={query}
        sort={sort}
      />
      <CheckinLibrarySummary count={filtered.length} />
      <CheckinGrid checkins={filtered} />
    </>
  );
}
