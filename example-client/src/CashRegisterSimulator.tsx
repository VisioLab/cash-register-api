import { Button, Chip, Divider } from "@mui/material";
import { CashRegister } from "./client";
import Stack from "@mui/material/Stack";
import Basket from "./Basket";

interface Props {
  cashRegister: CashRegister;
}

const readyState = new Map([
  [0, "CONNECTING"],
  [1, "OPEN"],
  [2, "CLOSING"],
  [3, "CLOSED"],
]);

const CashRegisterSimulator = ({ cashRegister }: Props) => {
  return (
    <Stack spacing={2}>
      <Chip
        label={`Connection: ${readyState.get(cashRegister.connectionState)}`}
        color="success"
      />
      <Divider>Actions</Divider>
      <Button variant="contained" onClick={() => cashRegister.paymentSuccess()}>
        Payment Success
      </Button>
      <Button variant="contained" onClick={() => cashRegister.paymentFailure()}>
        Payment Failure
      </Button>
      <Button variant="contained" onClick={() => cashRegister.syncArticles()}>
        Sync Articles
      </Button>
      <Button variant="contained" onClick={() => cashRegister.showDialog()}>
        Show Dialog
      </Button>
      <Button variant="contained" onClick={() => cashRegister.closeDialog()}>
        Close Dialog
      </Button>
      <Divider>State</Divider>
      <Basket articles={cashRegister.basket} />
      <Chip
        label={`Payment in progress: ${cashRegister.paymentInProgress} `}
        color="primary"
        variant={cashRegister.paymentInProgress ? "filled" : "outlined"}
      />
      <Chip
        label={`Survey result: ${cashRegister.surveyResult}`}
        color="primary"
      />
    </Stack>
  );
};

export default CashRegisterSimulator;
