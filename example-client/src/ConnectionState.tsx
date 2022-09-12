import { Chip } from "@mui/material";
import useCashRegisterStore from "./store";

const ConnectionState = () => {
  const connectionState = useCashRegisterStore(
    (state) => state.connectionState
  );
  return <Chip label={`Connection: ${connectionState}`} color="success" />;
};

export default ConnectionState;
