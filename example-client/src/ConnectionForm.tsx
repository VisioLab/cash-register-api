import { TextField } from "@mui/material";
import { useState } from "react";

const defaultValues = {
  ipAddress: "127.0.0.1",
};

interface Props {
  setIpAddress: (ipAddress: string) => void;
}
const ConnectionForm = ({ setIpAddress }: Props) => {
  const [formValues, setFormValues] = useState(defaultValues);
  const handleInputChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    console.log(formValues);
    setIpAddress(formValues.ipAddress);
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        name="ipAddress"
        label="IP Address of iPad"
        value={formValues.ipAddress}
        onChange={handleInputChange}
      >
        IP Address
      </TextField>
    </form>
  );
};

export default ConnectionForm;
