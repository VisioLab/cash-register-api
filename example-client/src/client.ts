import { PaymentFailure, PaymentSuccess, StartPayment, Reset, CloseDialog, SetBasket, ShowDialog, SyncArticles, UserInput } from "./types";

export class CashRegister {
    #ws: WebSocket;
    basket: SetBasket["data"]["articles"]
    constructor(ws: WebSocket) {
        this.#ws = ws;
        this.#ws.onmessage = this.receiveMessage
        this.basket = []
    }
    async syncArticles() {

    }

    async paymentSuccess() {
        const message: PaymentSuccess = {
            event: "paymentSuccess",
            data: {
                totalGross: 100,
            }
        }
        await this.send(JSON.stringify(message))

    }
    async paymentFailure() {
        const message = {
            event: "paymentFailure",
            data: {
                status: "cancelled",
                message: "Payment cancelled"
            }
        }
        await this.send(JSON.stringify(message))
    }

    async showDialog() {
    }

    async closeDialog() {
    }

    private async receiveMessage(message: MessageEvent<SetBasket | StartPayment | Reset | UserInput>) {
        switch (message.data.event) {
            case "setBasket":
                await this.onSetBasket(message.data)
                break;
            case "startPayment":
                await this.onStartPayment(message.data)
                break;
            case "reset":
                await this.onReset(message.data)
                break;
            case "userInput":
                await this.onUserInput(message.data)
                break;
            default:
                throw Error("Unknown event")
        }
    }
    async onSetBasket(message: SetBasket) {
        this.basket = message.data.articles
    }

    async onStartPayment(message: StartPayment) {
    }

    async onReset(message: Reset) {
    }

    async onUserInput(message: UserInput) {
    }

    private async send(message: unknown) {
        this.#ws.send(JSON.stringify(message))
    }

}