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
    <Stack direction="row" spacing={6}>
      <Stack spacing={2} sx={{minWidth: 450}}>
        <Divider>Connection</Divider>
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
        <Button variant="contained" onClick={() => cashRegister?.updateBasket()}>
          Update Basket
        </Button>
        <Button variant="contained" onClick={() => cashRegister?.articleWeighed()}>
          Article Weighed
        </Button>
        <Button variant="contained" onClick={() => cashRegister?.weighingFailed()}>
          Weighing Failed
        </Button>
        <Button variant="contained" onClick={() => cashRegister?.syncArticles()}>
          Sync Articles
        </Button>
        <Button variant="contained" onClick={() => cashRegister?.guestAuthenticated()}>
          Guest Authenticated
        </Button>
        <Button variant="contained" onClick={() => cashRegister?.guestRemoved()}>
          Guest Removed
        </Button>
        <Button variant="contained" onClick={() => cashRegister?.showDialog()}>
          Show Dialog
        </Button>
        <Button variant="contained" onClick={() => cashRegister?.closeDialog()}>
          Close Dialog
        </Button>
      </Stack>
      <Stack spacing={2} sx={{minWidth: 450}}>
        <Divider>Basket</Divider>
        <Basket />
        <Divider>State</Divider>
        <Chip
          label={`Payment in progress: ${state.paymentInProgress} `}
          color="primary"
          variant={state.paymentInProgress ? "filled" : "outlined"}
        />
        <Chip
          label={`Payment method: ${state.paymentMethod ?? ""}`}
          color="primary"
          variant={state.paymentMethod ? "filled" : "outlined"}
        />
        <Chip
          label={`QR code content: ${state.qrCodeContent ?? ""}`}
          color="primary"
          variant={state.qrCodeContent ? "filled" : "outlined"}
        />
        <Chip label={`Survey result: ${state.surveyResult}`} color="primary" />
      </Stack>
    </Stack>
  )
}

export default CashRegisterSimulator
