import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material"

interface ConfirmationDialogProps {
  open: boolean,
  title: string,
  onConfirm: () => void,
  onCancel: () => void,
  variant?: "error" | "warning" | "info"
  children?: React.ReactNode
}


const ConfirmationDialog: React.FC<ConfirmationDialogProps> = (
  {
    open,
    title,
    onConfirm,
    onCancel,
    variant,
    children,
  }
) => {
  return (
    <Dialog
      open={open}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        {children}
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained" 
          onClick={() => onConfirm()}
          color={variant ? variant : "warning"}
        >
          Confirm
        </Button>
        <Button 
          variant="contained" 
          color="secondary"
          onClick={() => onCancel()}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ConfirmationDialog;