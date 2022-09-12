import create from 'zustand'
import { SetBasket } from './types'

interface CashRegisterState {
    paymentInProgress: boolean
    connectionState: "CONNECTING" | "OPEN" | "CLOSING" | "CLOSED"
    basket: SetBasket["data"]["articles"]
    surveyResult: number

}

const useCashRegisterStore = create<CashRegisterState>(() => (
    {
        connectionState: "CONNECTING",
        paymentInProgress: false,
        basket: [],
        surveyResult: 0,
    }
))

export default useCashRegisterStore