import React from "react";
import { connect } from "react-redux";
import { useLocation } from "react-router-dom";
import { ThunkDispatch } from "redux-thunk";
import { AppState } from "../../../redux/store";
import { updateFilters } from "../../redux/actions";


interface FilterConf {
  queryParam: string,
  filterParam: string,
}

interface FiltersProps {
  filtersKey: string,
  filtersConf: FilterConf[],
  updateFilters: (filtersKey: string, filters: string) => void
}

const Filters: React.FC<FiltersProps> = (
  {
    filtersKey,
    filtersConf,
    updateFilters,
  }
) => {
  const { search } = useLocation();

  React.useEffect(() => {
    const queryParams = new URLSearchParams(search);
    const filterParams = new URLSearchParams();
    queryParams.forEach((value, key) => {
      if (filtersConf.some(conf => conf.queryParam === key)) filterParams.set(key, value);
    });
    updateFilters(filtersKey, filterParams.toString());
  }, [filtersKey, search, filtersConf, updateFilters]);
  return (
    <></>
  )
}

const mapStateToProps = (state: AppState) => ({});

const mapDispatchToProps = (dispatch: ThunkDispatch<{}, {}, any>) => ({
  updateFilters: (
    filtersKey: string, filters: string
  ) => dispatch(updateFilters({filtersKey: filtersKey, filters: filters})),
})

export default connect(mapStateToProps, mapDispatchToProps)(Filters);