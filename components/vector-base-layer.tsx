'use client'

import 'maplibre-gl/dist/maplibre-gl.css'
import { useEffect } from 'react'
import L from 'leaflet'
import '@maplibre/maplibre-gl-leaflet'
import { setWorkerUrl, type LayerSpecification, type StyleSpecification } from 'maplibre-gl'
import { useMap } from 'react-leaflet'

const STYLE_URL = 'https://tiles.openfreemap.org/styles/dark'

// The bundler can't resolve MapLibre's separate worker file, so it is served from /public.
setWorkerUrl('/vendor/maplibre-gl-worker.mjs')

const LAND = '#1a1d24'
const WATER = '#0e1015'
const ROAD = '#2a2e37'
const BORDER = '#3a3f4b'
const GREEN = '#1e2129'

function withPaint(layer: LayerSpecification, paint: Record<string, string>): LayerSpecification {
  return { ...layer, paint: { ...(layer.paint ?? {}), ...paint } } as LayerSpecification
}

function tint(layer: LayerSpecification): LayerSpecification {
  const { id, type } = layer
  if (type === 'background') return withPaint(layer, { 'background-color': LAND })
  if (id === 'water') return withPaint(layer, { 'fill-color': WATER })
  if (id === 'waterway') return withPaint(layer, { 'line-color': WATER })
  if (type === 'line' && id.startsWith('highway_')) return withPaint(layer, { 'line-color': ROAD })
  if (type === 'line' && id.startsWith('boundary_')) return withPaint(layer, { 'line-color': BORDER })
  if (type === 'fill' && (id.startsWith('landuse') || id.startsWith('landcover'))) {
    return withPaint(layer, { 'fill-color': GREEN })
  }
  return layer
}

let labelFreeStyle: Promise<StyleSpecification> | null = null

function loadLabelFreeStyle() {
  labelFreeStyle ??= fetch(STYLE_URL)
    .then((response) => response.json() as Promise<StyleSpecification>)
    .then((style) => ({
      ...style,
      layers: style.layers.filter((layer) => layer.type !== 'symbol').map(tint),
    }))
  return labelFreeStyle
}

export function VectorBaseLayer() {
  const map = useMap()

  useEffect(() => {
    let layer: L.MaplibreGL | null = null
    let cancelled = false

    loadLabelFreeStyle().then((style) => {
      if (cancelled) return
      layer = L.maplibreGL({ style, attributionControl: false, interactive: false })
      layer.addTo(map)
    })

    return () => {
      cancelled = true
      layer?.remove()
    }
  }, [map])

  return null
}
