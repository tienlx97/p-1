"use client";

import { useMemo, useRef, useState } from "react";
import { Button } from "react-aria-components";
import { useMap } from "react-leaflet";

import { getCategory, getMood } from "@/entities/memory";
import { cx } from "@/shared/lib/styles";

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

function normalizeSearchText(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replaceAll(/[\u0300-\u036F]/g, "")
    .toLowerCase()
    .trim();
}

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
      className={cx("map-place-search-result-icon", isHome && "home")}
      style={{ "--result-reaction-color": category.color }}
      aria-hidden="true"
    >
      {symbol}
    </span>
  );
}

export function MapPlaceSearch({ places, onShowHoverPreview }) {
  const map = useMap();
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
    map.flyTo([place.latitude, place.longitude], Math.max(map.getZoom(), SEARCH_ZOOM), {
      duration: 0.55
    });
    onShowHoverPreview(place.id);
    setQuery(place.locationName);
    setIsFocused(false);
    searchRef.current?.blur();
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (results[0]) {
      jumpToPlace(results[0]);
    }
  }

  function clearBlurTimer() {
    if (blurTimerRef.current) {
      globalThis.clearTimeout(blurTimerRef.current);
      blurTimerRef.current = null;
    }
  }

  return (
    <form
      className={cx("map-place-search")}
      role="search"
      aria-label="Tìm địa điểm kỷ niệm"
      onDoubleClick={stopMapInteraction}
      onPointerDown={stopMapInteraction}
      onSubmit={handleSubmit}
      onWheel={stopMapInteraction}
    >
      <div className={cx("map-place-search-field", showResults && "has-results")}>
        <input
          ref={searchRef}
          type="search"
          value={query}
          placeholder="Tìm kỷ niệm hoặc địa điểm"
          autoComplete="off"
          aria-label="Tìm địa điểm"
          aria-expanded={showResults}
          aria-controls="map-place-search-results"
          onBlur={() => {
            clearBlurTimer();
            blurTimerRef.current = globalThis.setTimeout(() => {
              setIsFocused(false);
              blurTimerRef.current = null;
            }, 120);
          }}
          onChange={(event) => setQuery(event.target.value)}
          onFocus={() => {
            clearBlurTimer();
            setIsFocused(true);
          }}
        />
        {query ? (
          <Button
            type="button"
            className={cx("map-place-search-clear")}
            aria-label="Xóa tìm kiếm"
            onPress={() => {
              clearBlurTimer();
              setQuery("");
              setIsFocused(true);
              searchRef.current?.focus();
            }}
          >
            ×
          </Button>
        ) : null}
        <span className={cx("map-place-search-divider")} aria-hidden="true" />
        <Button
          type="submit"
          className={cx("map-place-search-submit")}
          aria-label="Tìm kiếm"
          isDisabled={results.length === 0}
        >
          <span className={cx("map-place-search-icon")} aria-hidden="true" />
        </Button>
      </div>

      {showResults ? (
        <div id="map-place-search-results" className={cx("map-place-search-results")}>
          {results.length > 0 ? (
            results.map((place) => (
              <Button
                key={place.id}
                type="button"
                className={cx("map-place-search-result")}
                onPress={() => jumpToPlace(place)}
              >
                <SearchResultReactionIcon place={place} />
                <span>
                  <strong>{place.locationName}</strong>
                  <small>{place.title}</small>
                </span>
                <em>{place.city}</em>
              </Button>
            ))
          ) : (
            <p className={cx("map-place-search-empty")}>Không tìm thấy địa điểm phù hợp</p>
          )}
        </div>
      ) : null}
    </form>
  );
}
