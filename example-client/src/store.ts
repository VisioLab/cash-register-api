import { omit } from 'lodash'
import { create } from 'zustand'
import { BasketArticle } from './types'

interface CashRegisterState {
    ipAddress: string
    paymentInProgress: boolean
    connectionState: "CONNECTING" | "OPEN" | "CLOSING" | "CLOSED"
    basket: BasketArticle[],
    surveyResult: number,
    scaleArticlePlu?: string
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