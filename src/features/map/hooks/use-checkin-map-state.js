'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { DEFAULT_ZOOM, PLACE_LABEL_MIN_ZOOM } from '@/features/map/constants/map.constants'
import { checkins } from '@/entities/memory'

function getLatestPlaceCheckins(sourceCheckins) {
  const places = new Map()

  for (const checkin of sourceCheckins) {
    const current = places.get(checkin.locationName)

    if (
      !current ||
      new Date(checkin.checkinTime).getTime() > new Date(current.checkinTime).getTime()
    ) {
      places.set(checkin.locationName, checkin)
    }
  }

  return [...places.values()]
}

export function useCheckinMapState() {
  const [activeId, setActiveId] = useState(null)
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [initialMediaIndex, setInitialMediaIndex] = useState(null)
  const [drawerMode, setDrawerMode] = useState(null)
  const [hoveredPreviewId, setHoveredPreviewId] = useState(null)
  const [showPlaceLabels, setShowPlaceLabels] = useState(DEFAULT_ZOOM >= PLACE_LABEL_MIN_ZOOM)
  const hoverCloseTimerRef = useRef(null)

  const filteredCheckins = useMemo(
    () =>
      checkins.filter((checkin) => {
        const matchesCategory = categoryFilter === 'all' || checkin.categoryId === categoryFilter

        return matchesCategory
      }),
    [categoryFilter]
  )

  const mapPlaces = useMemo(() => getLatestPlaceCheckins(filteredCheckins), [filteredCheckins])

  const clusterablePlaces = useMemo(
    () => mapPlaces.filter((checkin) => checkin.categoryId !== 'home'),
    [mapPlaces]
  )
  const standalonePlaces = useMemo(
    () => mapPlaces.filter((checkin) => checkin.categoryId === 'home'),
    [mapPlaces]
  )

  const activeCheckin = useMemo(
    () => (activeId ? (filteredCheckins.find((checkin) => checkin.id === activeId) ?? null) : null),
    [activeId, filteredCheckins]
  )

  useEffect(() => {
    return () => {
      if (hoverCloseTimerRef.current) {
        globalThis.clearTimeout(hoverCloseTimerRef.current)
      }
    }
  }, [])

  useEffect(() => {
    const activeStillVisible =
      !activeId || filteredCheckins.some((checkin) => checkin.id === activeId)
    const previewStillVisible =
      !hoveredPreviewId || filteredCheckins.some((checkin) => checkin.id === hoveredPreviewId)

    if (!activeStillVisible) {
      setActiveId(null)
      setInitialMediaIndex(null)
      setDrawerMode(null)
    }

    if (!previewStillVisible) {
      setHoveredPreviewId(null)
    }
  }, [activeId, filteredCheckins, hoveredPreviewId])

  const keepPreviewOpen = useCallback(() => {
    if (hoverCloseTimerRef.current) {
      globalThis.clearTimeout(hoverCloseTimerRef.current)
      hoverCloseTimerRef.current = null
    }
  }, [])

  const showHoverPreview = useCallback(
    (checkinId) => {
      keepPreviewOpen()
      setHoveredPreviewId(checkinId)
    },
    [keepPreviewOpen]
  )

  const scheduleCloseHoverPreview = useCallback(() => {
    keepPreviewOpen()
    hoverCloseTimerRef.current = globalThis.setTimeout(() => {
      setHoveredPreviewId(null)
    }, 180)
  }, [keepPreviewOpen])

  const closeHoverPreview = useCallback(() => {
    keepPreviewOpen()
    setHoveredPreviewId(null)
  }, [keepPreviewOpen])

  const openAddMemoryDrawer = useCallback(() => {
    setActiveId(null)
    setInitialMediaIndex(null)
    setDrawerMode('add')
  }, [])

  useEffect(() => {
    const eventName = 'photo-mem:open-add-memory'

    function handleOpenAddMemory() {
      openAddMemoryDrawer()
    }

    globalThis.addEventListener(eventName, handleOpenAddMemory)

    if (sessionStorage.getItem(eventName) === '1') {
      sessionStorage.removeItem(eventName)
      openAddMemoryDrawer()
    }

    return () => globalThis.removeEventListener(eventName, handleOpenAddMemory)
  }, [openAddMemoryDrawer])

  const openMemoryDetail = useCallback(
    (checkinId, mediaIndex = null) => {
      keepPreviewOpen()
      setActiveId(checkinId)
      setInitialMediaIndex(mediaIndex)
      setHoveredPreviewId(null)
      setDrawerMode('memory')
    },
    [keepPreviewOpen]
  )

  const closeDrawer = useCallback(() => {
    setDrawerMode((currentDrawerMode) => {
      if (currentDrawerMode === 'memory') {
        setActiveId(null)
      }

      return null
    })
    setHoveredPreviewId(null)
    setInitialMediaIndex(null)
  }, [])

  return {
    activeCheckin,
    activeId,
    categoryFilter,
    closeDrawer,
    closeHoverPreview,
    clusterablePlaces,
    drawerMode,
    filteredCheckins,
    hoveredPreviewId,
    initialMediaIndex,
    keepPreviewOpen,
    mapPlaces,
    openMemoryDetail,
    scheduleCloseHoverPreview,
    setCategoryFilter,
    setShowPlaceLabels,
    showHoverPreview,
    showPlaceLabels,
    standalonePlaces,
    totalCheckinCount: checkins.length,
  }
}
