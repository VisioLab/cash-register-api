import _ from "lodash";
import useCashRegisterStore from "./store";
import { PaymentFailure, PaymentSuccess, StartPayment, Reset, CloseDialog, SetBasket, ShowDialog, SyncArticles, UserInput } from "./types";

const articles: SyncArticles["data"]["articles"] = [
    {
        name: "Eggs Benedict",
        priceLookup: "1",
        price: 1.00,

    },
    {
        name: "Waldorf Salad",
        priceLookup: "2",
        price: 2.00,
    },
    {
        name: "Caesar Salad",
        priceLookup: "3",
        price: 3.00,
    }
]

const readyStateMap = new Map([
    [0, "CONNECTING"],
    [1, "OPEN"],
    [2, "CLOSING"],
    [3, "CLOSED"],
] as const);

export class CashRegister {
    #ws: WebSocket;

    constructor(ws: WebSocket) {
        this.#ws = ws;
        this.#ws.onmessage = this.receiveMessage
        this.#ws.onopen = this.onConnectionChange.bind(this)
        this.#ws.onclose = this.onConnectionChange.bind(this)
    }

    async syncArticles() {
        const message: SyncArticles = {
            event: "syncArticles",
            data: {
                articles,
            }
        }
        await this.send(message)
    }

    async paymentSuccess() {
        const message: PaymentSuccess = {
            event: "paymentSuccess",
            data: {
                totalGross: 100,
            }
        }
        useCashRegisterStore.setState({ paymentInProgress: false })

        await this.send(message)

    }
    async paymentFailure() {
        const message: PaymentFailure = {
            event: "paymentFailure",
            data: {
                reason: "cancelled",
                message: "Payment cancelled"
            }
        }
        await this.send(message)
    }

    async showDialog() {
        const message: ShowDialog = {
            event: "showDialog",
            data: {
                id: "survey",
                title: {
                    en: "Survey",
                    de: "Umfrage",
                },
                body: {
                    en: "How satisfied are you with the interface?",
                    de: "Wie zufrieden sind Sie mit der Schnittstelle?",
                },
                buttons: [
                    {
                        action: "-1",
                        label: {
                            en: "Not at all",
                            de: "Gar nicht",
                        }
                    },
                    {
                        action: "+1",
                        label: {
                            en: "A lot",
                            de: "Sehr",
                        }
                    }
                ],
            }
        }
        await this.send(message)
    }

    async closeDialog() {
        const message: CloseDialog = {
            event: "closeDialog",
            data: {
                id: "survey",
            }
        }
        await this.send(message)
    }


    async onSetBasket(message: SetBasket) {
        for (const article of message.data.articles) {
            const found = articles.find(a => a.priceLookup === article.priceLookup)
            if (!found) {
                this.paymentFailure()
            }
        }
        useCashRegisterStore.setState({ basket: message.data.articles })
    }

    async onStartPayment(message: StartPayment) {
        const { paymentInProgress, basket } = useCashRegisterStore.getState()
        if (!paymentInProgress && !_.isEmpty(basket)) {
            useCashRegisterStore.setState({ paymentInProgress: true })
        }
    }

    async onReset(message: Reset) {
        useCashRegisterStore.setState({ basket: [] })
    }

    async onUserInput(message: UserInput) {
        if (message.data.id === "survey") {
            useCashRegisterStore.setState({
                surveyResult: useCashRegisterStore.getState().surveyResult
                    + parseInt(message.data.action)
            })
        }
    }

    private async send(message: object) {
        this.#ws.send(JSON.stringify(message))
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

    private onConnectionChange(event: unknown) {
        useCashRegisterStore.setState(
            { connectionState: readyStateMap.get(this.#ws.readyState as any) ?? "CONNECTING" }
        )
    }
    get connectionState() {
        return this.#ws.readyState
    }

    get ws() {
        return this.#ws
    }
}