import _ from "lodash";
import useCashRegisterStore from "./store";
import { PaymentFailure, PaymentSuccess, StartPayment, Reset, CloseDialog, SetBasket, ShowDialog, SyncArticles, UserInput, ArticleWeighed, WeighingFailed, WeighArticle, ApiError } from "./types";

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
        this.#ws.onmessage = this.receiveMessage.bind(this)
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
                totalGross: useCashRegisterStore.getState().basket.length,
                receiptUrl: "https://receipts.visiolab.io/"
            }
        }
        useCashRegisterStore.getState().reset()

        await this.send(message)
    }

    async paymentFailure(messageText: PaymentFailure["data"]["message"] = {
        en: "Payment cancelled",
        de: "Zahlung abgebrochen",
    }) {
        const message: PaymentFailure = {
            event: "paymentFailure",
            data: {
                reason: "cancelled",
                message: messageText
            },
        }

        await this.send(message)
    }

    async articleWeighed() {
        const scaleArticle = useCashRegisterStore.getState().scaleArticle
        if (scaleArticle === undefined) {
            return
        }
        const message: ArticleWeighed = {
            event: "articleWeighed",
            data: {
               article: {
                ...scaleArticle, 
                scale: {weight: 500, unit: scaleArticle.scale?.unit ?? "g"}},
            },
        }

        await this.send(message)
    }

    async weighingFailed() {
        const message: WeighingFailed = {
            event: "weighingFailed",
            data: {
               message: {
                de: "Waage nicht verfügbar",
                en: "Scale not available"
              }
            },
        }
        useCashRegisterStore.setState({scaleArticle: undefined})

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
                this.paymentFailure({
                    en: `Unknown PLU ${article.priceLookup}`,
                    de: `Unbekannte PLU ${article.priceLookup}`,
                })
            }
        }
        useCashRegisterStore.setState({ basket: message.data.articles })
    }

    async onStartPayment(message: StartPayment) {
        const { paymentInProgress, basket } = useCashRegisterStore.getState()
        if (!paymentInProgress && !_.isEmpty(basket)) {
            useCashRegisterStore.setState({
                paymentInProgress: true, paymentMethod: message.data.paymentMethod, qrCodeContent: message.data.identifier
            })
        }
    }

    async onReset(message: Reset) {
        useCashRegisterStore.getState().reset()
    }

    async onUserInput(message: UserInput) {
        if (message.data.id === "survey") {
            useCashRegisterStore.setState({
                surveyResult: useCashRegisterStore.getState().surveyResult
                    + parseInt(message.data.action)
            })
        }
    }

    private async weighArticle(parsedMessage: WeighArticle) {
        useCashRegisterStore.setState({scaleArticle: parsedMessage.data.article})
    }

    private async send(message: object) {
        const encodedMessage = JSON.stringify(message)
        console.log("Sending message:", encodedMessage)
        this.#ws.send(encodedMessage)
    }

    private async receiveMessage(message: MessageEvent<string>) {
        const parsedMessage = JSON.parse(message.data) as SetBasket | StartPayment | Reset | UserInput | WeighArticle | ApiError
        console.log("Received message:", message.data)
        switch (parsedMessage.event) {
            case "setBasket":
                await this.onSetBasket(parsedMessage)
                break;
            case "startPayment":
                await this.onStartPayment(parsedMessage)
                break;
            case "reset":
                await this.onReset(parsedMessage)
                break;
            case "userInput":
                await this.onUserInput(parsedMessage)
                break;
            case "weighArticle":
                await this.weighArticle(parsedMessage)
                break;
            case "error":
                console.log("Received error:", parsedMessage.data)
            default:
                await this.send({ event: "error", data: { reason: "unexpectedEvent", message: `Received unexpected event ${(parsedMessage as any).event}` } })
        }
    }

    private onConnectionChange(event: Event) {
        console.log(`WebSocket connection event: ${event.type}`)
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