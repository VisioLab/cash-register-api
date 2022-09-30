import {Button, Card, Stack, TextField} from "@mui/material"
import {useState} from "react"
import useCashRegisterStore from "./store"

const defaultValues = {
  ipAddress: "127.0.0.1",
}

const ConnectionForm = () => {
  const [formValues, setFormValues] = useState(defaultValues)
  const handleInputChange = (e: {target: {name: any; value: any}}) => {
    const {name, value} = e.target
    setFormValues({
      ...formValues,
      [name]: value,
    })
  }

  const handleSubmit = (event: {preventDefault: () => void}) => {
    event.preventDefault()
    console.log(formValues)
    useCashRegisterStore.setState({ipAddress: formValues.ipAddress})
  }

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={2}>
        <TextField
          name="ipAddress"
          label="IP Address of iPad"
          value={formValues.ipAddress}
          onChange={handleInputChange}
        >
          IP Address
        </TextField>

        <Button variant="contained" type="submit">
          Connect
        </Button>

        <Card variant="outlined" sx={{padding: "1rem"}}>
          When using the hosted version, you will need to enable{" "}
          <a href="https://experienceleague.adobe.com/docs/target/using/experiences/vec/troubleshoot-composer/mixed-content.html?lang=en">
            mixed content
          </a>{" "}
          for this site to connect to the websocket in your local network.
        </Card>
      </Stack>
    </form>
  )
}

export default ConnectionForm
