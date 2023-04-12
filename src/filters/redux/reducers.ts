import { FiltersAction, FiltersState, FILTERS_UPDATED } from "./types";

export const filtersReducer = (
  state: FiltersState = {filtersKey: undefined, filters: undefined},
  action: FiltersAction
): FiltersState => {
  switch (action.type) {
    case FILTERS_UPDATED:
      return {
        ...state,
        filtersKey: action.payload.filtersKey,
        filters: action.payload.filters
      }
    default:
      return state;
  }
}