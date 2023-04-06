import { omit } from 'lodash'
import { create } from 'zustand'
import { SetBasket } from './types'

interface CashRegisterState {
    ipAddress: string
    paymentInProgress: boolean
    connectionState: "CONNECTING" | "OPEN" | "CLOSING" | "CLOSED"
    basket: SetBasket["data"]["articles"]
    surveyResult: number,
    paymentMethod?: string,
    qrCodeContent?: string,
    reset: () => void,
}

const useCashRegisterStore = create<CashRegisterState>((set) => (
    {
        ipAddress: "",
        connectionState: "CONNECTING",
        paymentInProgress: false,
        basket: [],
        surveyResult: 0,
        reset: () => set(state => ({ ...omit(state, ["paymentMethod", "qrCodeContent"]), paymentInProgress: false, basket: [] }), true),
    }
))

export default useCashRegisterStore