"use client";

import { useMemo, useRef, useState } from "react";
import { Button, Input, SearchField as AriaSearchField } from "react-aria-components";

import { getCategory, getMood } from "@/entities/memory";
import { cx } from "@/shared/lib/cx";
import styles from "./map-place-search.module.css";

const MAX_RESULTS = 6;
const SEARCH_ZOOM = 15;

const resultReactionSymbols = {
  chill: "⌁",
  explore: "!",
  happy: "☺",
  memorable: "★",
  peaceful: "☾",
  romantic: "♥",
  sad: "•"
};

/**
 * Normalizes Vietnamese accents and casing so search can match user input loosely.
 *
 * @param {string | null | undefined} value
 * @returns {string}
 */
function normalizeSearchText(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replaceAll(/[\u0300-\u036F]/g, "")
    .toLowerCase()
    .trim();
}

/**
 * @param {import("@/entities/memory/mock-data").MemoryCheckin} checkin
 * @returns {string}
 */
function getSearchText(checkin) {
  const category = getCategory(checkin.categoryId);

  return normalizeSearchText(
    [
      checkin.title,
      checkin.locationName,
      checkin.address,
      checkin.city,
      category.name
    ].join(" ")
  );
}

function stopMapInteraction(event) {
  event.stopPropagation();
}

function SearchResultReactionIcon({ place }) {
  const category = getCategory(place.categoryId);
  const mood = getMood(place.moodId);
  const isHome = category.id === "home";
  const symbol = isHome ? "♥" : (resultReactionSymbols[mood.id] ?? "•");

  return (
    <span
      className={cx(styles.resultIcon, isHome && styles.homeIcon)}
      style={{ "--result-reaction-color": category.color }}
      aria-hidden="true"
    >
      {symbol}
    </span>
  );
}

/**
 * @typedef {object} MapPlaceSearchProps
 * @property {import("maplibre-gl").Map | null} map
 * @property {import("@/entities/memory/mock-data").MemoryCheckin[]} places
 * @property {function(string): void} onShowHoverPreview
 */

/**
 * @param {MapPlaceSearchProps} props
 */
export function MapPlaceSearch({ map, places, onShowHoverPreview }) {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const blurTimerRef = useRef(null);
  const searchRef = useRef(null);
  const normalizedQuery = normalizeSearchText(query);

  const results = useMemo(() => {
    if (!normalizedQuery) {
      return [];
    }

    return places
      .map((place) => ({
        place,
        searchText: getSearchText(place)
      }))
      .filter((item) => item.searchText.includes(normalizedQuery))
      .slice(0, MAX_RESULTS)
      .map((item) => item.place);
  }, [normalizedQuery, places]);

  const showResults = isFocused && normalizedQuery.length > 0;

  function jumpToPlace(place) {
    if (!map) {
      return;
    }

    map.flyTo({
      center: [place.longitude, place.latitude],
      duration: 550,
      zoom: Math.max(map.getZoom(), SEARCH_ZOOM)
    });
    onShowHoverPreview(place.id);
    setQuery(place.locationName);
    setIsFocused(false);
    searchRef.current?.blur();
  }

  function submitSearch() {
    if (results[0]) {
      jumpToPlace(results[0]);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    submitSearch();
  }

  function clearBlurTimer() {
    if (blurTimerRef.current) {
      globalThis.clearTimeout(blurTimerRef.current);
      blurTimerRef.current = null;
    }
  }

  return (
    <form
      className={cx(styles.root, "pointer-events-auto")}
      role="search"
      aria-label="Tìm địa điểm kỷ niệm"
      onClick={stopMapInteraction}
      onDoubleClick={stopMapInteraction}
      onPointerDown={stopMapInteraction}
      onSubmit={handleSubmit}
      onWheel={stopMapInteraction}
    >
      <div className={cx(styles.field, showResults && styles.hasResults)}>
        <AriaSearchField
          className={styles.searchField}
          value={query}
          aria-label="Tìm địa điểm"
          aria-expanded={showResults}
          aria-controls="map-place-search-results"
          autoComplete="off"
          onBlur={() => {
            clearBlurTimer();
            blurTimerRef.current = globalThis.setTimeout(() => {
              setIsFocused(false);
              blurTimerRef.current = null;
            }, 120);
          }}
          onChange={setQuery}
          onClear={() => {
            clearBlurTimer();
            setQuery("");
            setIsFocused(true);
            searchRef.current?.focus();
          }}
          onFocus={() => {
            clearBlurTimer();
            setIsFocused(true);
          }}
        >
          <Input
            ref={searchRef}
            className={styles.input}
            placeholder="Tìm kỷ niệm hoặc địa điểm"
          />
          {query ? (
            <Button type="button" className={styles.clearButton} aria-label="Xóa tìm kiếm">
              ×
            </Button>
          ) : null}
        </AriaSearchField>
        <span className={styles.divider} aria-hidden="true" />
        <Button
          type="submit"
          className={styles.submitButton}
          aria-label="Tìm kiếm"
          isDisabled={!map || results.length === 0}
        >
          <span className={styles.icon} aria-hidden="true" />
        </Button>
      </div>

      {showResults ? (
        <div id="map-place-search-results" className={styles.results}>
          {results.length > 0 ? (
            results.map((place) => (
              <Button
                key={place.id}
                type="button"
                className={styles.result}
                onPress={() => jumpToPlace(place)}
              >
                <SearchResultReactionIcon place={place} />
                <span className={styles.resultText}>
                  <strong className={styles.resultTitle}>{place.locationName}</strong>
                  <small className={styles.resultSubtitle}>{place.title}</small>
                </span>
                <em className={styles.cityPill}>{place.city}</em>
              </Button>
            ))
          ) : (
            <p className={styles.empty}>Không tìm thấy địa điểm phù hợp</p>
          )}
        </div>
      ) : null}
    </form>
  );
}
