import { Select, SelectChangeEvent, SelectProps } from "@mui/material";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom"
import { useDebouncedCallback } from "use-debounce";


interface SelectFilterProps extends SelectProps {
  queryParam: string
};


export const SelectFilter: React.FC<SelectFilterProps> = (
  {
    queryParam,
    ...props
  }
) => {

  const { search } = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(search);

  const [value, setValue] = React.useState(searchParams.get(queryParam));

  const handleChange = useDebouncedCallback((val: string) => {
    if (val) searchParams.set(queryParam, val);
    else searchParams.delete(queryParam);
    navigate({search: searchParams.toString()});
  }, 500);

  return (
    <Select
      value={value || ""}
      onChange={(e: SelectChangeEvent<unknown>) => {
        setValue(e.target.value as string);
        handleChange(e.target.value as string);
      }}
      {...props}
    >
      {props.children}
    </Select>
  )
}
