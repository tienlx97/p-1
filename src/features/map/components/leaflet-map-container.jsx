'use client'

import { LeafletContext, createLeafletContext } from '@react-leaflet/core'
import { Map as LeafletMap } from 'leaflet'
import { forwardRef, useCallback, useImperativeHandle, useRef, useState } from 'react'

function removeLeafletMap(map) {
  if (!map) {
    return
  }

  try {
    map.remove()
  } catch (error) {
    if (!error?.message?.includes('Map container is being reused by another instance')) {
      throw error
    }
  }
}

function LeafletMapContainerComponent(
  { bounds, boundsOptions, center, children, className, id, placeholder, style, whenReady, zoom, ...options },
  forwardedRef
) {
  const [props] = useState({ className, id, style })
  const [initialMapProps] = useState({
    bounds,
    boundsOptions,
    center,
    options,
    whenReady,
    zoom,
  })
  const [context, setContext] = useState(null)
  const mapInstanceRef = useRef()

  useImperativeHandle(forwardedRef, () => context?.map ?? null, [context])

  const mapRef = useCallback(
    (node) => {
      if (!node) {
        removeLeafletMap(mapInstanceRef.current)
        mapInstanceRef.current = undefined
        setContext(null)
        return
      }

      if (mapInstanceRef.current) {
        return
      }

      if (node._leaflet_id) {
        delete node._leaflet_id
      }

      const map = new LeafletMap(node, initialMapProps.options)
      mapInstanceRef.current = map

      if (initialMapProps.center != null && initialMapProps.zoom != null) {
        map.setView(initialMapProps.center, initialMapProps.zoom)
      } else if (initialMapProps.bounds != null) {
        map.fitBounds(initialMapProps.bounds, initialMapProps.boundsOptions)
      }

      if (initialMapProps.whenReady != null) {
        map.whenReady(initialMapProps.whenReady)
      }

      setContext(createLeafletContext(map))
    },
    [initialMapProps]
  )

  const contents = context ? (
    <LeafletContext value={context}>{children}</LeafletContext>
  ) : (
    (placeholder ?? null)
  )

  return (
    <div {...props} ref={mapRef}>
      {contents}
    </div>
  )
}

export const LeafletMapContainer = forwardRef(LeafletMapContainerComponent)
