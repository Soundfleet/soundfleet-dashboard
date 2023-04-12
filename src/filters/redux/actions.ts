import { FILTERS_UPDATED } from "./types";

export function updateFilters(payload: {filtersKey: string, filters: string}) {
  return {
    type: FILTERS_UPDATED,
    payload: payload
  }
}