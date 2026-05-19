'use client'

import { useEffect } from 'react'
import { useMapEvents } from 'react-leaflet'

import { PLACE_LABEL_MIN_ZOOM } from '@/features/map/constants/map.constants'

/**
 * @param {{ onPlaceLabelVisibilityChange: function(boolean): void }} props
 */
export function MapZoomWatcher({ onPlaceLabelVisibilityChange }) {
  const map = useMapEvents({
    zoomend: () => {
      onPlaceLabelVisibilityChange(map.getZoom() >= PLACE_LABEL_MIN_ZOOM)
    },
  })

  useEffect(() => {
    onPlaceLabelVisibilityChange(map.getZoom() >= PLACE_LABEL_MIN_ZOOM)
  }, [map, onPlaceLabelVisibilityChange])

  return null
}

/**
 * @param {{ onDismissPreview: function(): void }} props
 */
export function MapPreviewDismissWatcher({ onDismissPreview }) {
  useMapEvents({
    click: onDismissPreview,
    dragstart: onDismissPreview,
  })

  return null
}
