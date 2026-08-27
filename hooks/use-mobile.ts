import * as React from "react"

// Keep this aligned with the mobile layout breakpoint in app/globals.css.
export const MOBILE_BREAKPOINT = 900

export const MOBILE_QUERY = `(max-width: ${MOBILE_BREAKPOINT}px)`

function subscribe(onStoreChange: () => void): () => void {
  const media = window.matchMedia(MOBILE_QUERY)
  media.addEventListener("change", onStoreChange)
  return () => media.removeEventListener("change", onStoreChange)
}

function getSnapshot(): boolean {
  return window.matchMedia(MOBILE_QUERY).matches
}

export function useIsMobile() {
  return React.useSyncExternalStore(subscribe, getSnapshot, () => false)
}
