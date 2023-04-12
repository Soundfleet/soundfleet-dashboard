export const FILTERS_UPDATED = "FILTERS_UPDATED";


export type UpdateFiltersAction = {
  type: typeof FILTERS_UPDATED,
  payload: {filtersKey: string, filters: string}
}


export type FiltersState = {
  filtersKey: string | undefined,
  filters: string | undefined
};


export type FiltersAction = (
  UpdateFiltersAction
)