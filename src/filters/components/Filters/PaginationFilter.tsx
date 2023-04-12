import { Pagination } from "@mui/material"
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";


interface PaginationFilterProps {
  pageSize: number,
  count: number,
}



const PaginationFilter: React.FC<PaginationFilterProps> = (
  {
    pageSize,
    count,
  }
) => {
  const { search } = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(search);
  const [pages, setPages] = React.useState(Math.ceil(count / pageSize));
  const [page, setPage] = React.useState<number>(
    parseInt(searchParams.get('page') || "1")
  );

  React.useEffect(() => {
    setPages(Math.ceil(count / pageSize))
  }, [count, pageSize]);

  const handleChange = (e: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    searchParams.set('page', value.toString());
    navigate({search: searchParams.toString()});
  }

  return (
    <Pagination 
      page={page}
      count={pages} 
      siblingCount={0}
      boundaryCount={2}
      onChange={handleChange}
    />
  )
}

export default PaginationFilter;