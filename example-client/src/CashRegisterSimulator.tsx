import {Button, Chip, Divider} from "@mui/material"
import {CashRegister} from "./client"
import Stack from "@mui/material/Stack"
import Basket from "./Basket"
import ConnectionState from "./ConnectionState"
import useCashRegisterStore from "./store"
import {useEffect, useState} from "react"
import {HiOutlineRefresh} from "react-icons/hi"

interface Props {
  ipAddress: string
}

const CashRegisterSimulator = ({ipAddress}: Props) => {
  const [cashRegister, setCashRegister] = useState<CashRegister>()

  const connect = () => {
    const ws = new WebSocket(
      ipAddress === "echo" ? "wss://ws.postman-echo.com/raw" : `ws://${ipAddress}/visiolab-cash-register`
    )
    setCashRegister(new CashRegister(ws))
  }

  const reconnect = () => {
    console.log("reconnecting")
    connect()
  }

  useEffect(() => {
    connect()
    return () => cashRegister?.ws.close()
  }, [ipAddress])

  const state = useCashRegisterStore()
  return (
    <Stack spacing={2}>
      <ConnectionState />
      <Button variant="contained" onClick={reconnect}>
        Reconnect <HiOutlineRefresh />
      </Button>
      <Divider>Actions</Divider>
      <Button variant="contained" onClick={() => cashRegister?.paymentSuccess()}>
        Payment Success
      </Button>
      <Button variant="contained" onClick={() => cashRegister?.paymentFailure()}>
        Payment Failure
      </Button>
      <Button variant="contained" onClick={() => cashRegister?.syncArticles()}>
        Sync Articles
      </Button>
      <Button variant="contained" onClick={() => cashRegister?.showDialog()}>
        Show Dialog
      </Button>
      <Button variant="contained" onClick={() => cashRegister?.closeDialog()}>
        Close Dialog
      </Button>
      <Divider>State</Divider>
      <Basket />
      <Chip
        label={`Payment in progress: ${state.paymentInProgress} `}
        color="primary"
        variant={state.paymentInProgress ? "filled" : "outlined"}
      />
      <Chip label={`Survey result: ${state.surveyResult}`} color="primary" />
    </Stack>
  )
}

export default CashRegisterSimulator
