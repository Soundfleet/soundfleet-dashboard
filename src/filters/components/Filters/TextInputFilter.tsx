import { StandardTextFieldProps, TextField } from "@mui/material"
import React from "react";
import { useLocation, useNavigate } from "react-router-dom"
import { useDebouncedCallback } from "use-debounce";


interface TextInputFilterProps extends StandardTextFieldProps {
  queryParam: string
};


export const TextInputFilter: React.FC<TextInputFilterProps> = (
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
    <TextField
      value={value || ""}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
        handleChange(e.target.value);
      }}
      {...props}
    />
  )
}