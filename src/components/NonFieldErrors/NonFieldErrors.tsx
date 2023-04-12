import { Alert, List, ListItem } from "@mui/material"

interface NonFieldErrorsProps {
  errors?: string[]
}
const NonFieldErrors: React.FC<NonFieldErrorsProps> = (
  {
    errors
  }
) => {
  if (!errors) return <></>
  return (
    <Alert severity="error" sx={{
      marginBottom: 3
    }}>
      <List
        sx={{
          padding: 0,
        }}
      >
        {
          errors.map((e, i) => <ListItem sx={{padding: 0}} key={i}>{e}</ListItem>)
        }
      </List>
    </Alert>
  )
}


export default NonFieldErrors;