import _ from "lodash";
import useCashRegisterStore from "./store";
import {
    PaymentFailure, PaymentSuccess, StartPayment, Reset, CloseDialog, SetBasket, ShowDialog, SyncArticles, UserInput,
    ArticleWeighed, WeighingFailed, WeighArticle, ApiError, AddArticles, GuestAuthenticated, GuestRemoved, ApiWarning, UpdateBasket, BasketArticle, ScanArticle, SyncedArticle, I18Ned
} from "./types";

const articles: SyncedArticle[] = [
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
    },
    {
        name: "Salad Bar",
        priceLookup: "4",
        price: 0.75,
        scale: { factor: 100, unit: "g" }
    },
    {
        name: "Dessert Bar",
        priceLookup: "5",
        price: 1.25,
        scale: { factor: 100, unit: "g" }
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

    async updateBasket() {
        const message: UpdateBasket = {
            event: "updateBasket",
            data: {
                articles: useCashRegisterStore.getState().basket,
            }
        }
        await this.send(message)
    }

    async paymentSuccess() {
        const message: PaymentSuccess = {
            event: "paymentSuccess",
            data: {
                total: { gross: useCashRegisterStore.getState().basket.reduce((acc, next) => acc + next.price, 0) },
                receiptUrl: "https://receipts.visiolab.io/",
                remainingBalance: 4.90,
                remainingAllowance: 1.20,
            }
        }
        useCashRegisterStore.getState().reset()

        await this.send(message)
    }

    async paymentFailure(messageText: I18Ned = {
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

    async guestAuthenticated() {
        const message: GuestAuthenticated = {
            event: "guestAuthenticated",
            data: {
                identifier: "42"
            }
        }
        await this.send(message)
    }

    async guestRemoved() {
        const message: GuestRemoved = {
            event: "guestRemoved",
            data: {
                identifier: "42"
            }
        }
        await this.send(message)
    }

    async articleWeighed() {
        const scaleArticlePlu = useCashRegisterStore.getState().scaleArticlePlu
        if (!scaleArticlePlu) {
            return
        }
        const scaleArticle = articles.find(a => a.priceLookup === scaleArticlePlu)
        if (!scaleArticle) {
            return
        }
        const weight = _.random(100, 500)
        const article = {
            ...scaleArticle,
            price: _.round(scaleArticle.price * weight / (scaleArticle.scale?.factor ?? 100), 2),
            scale: { weight, unit: scaleArticle.scale?.unit ?? "g" }
        }

        useCashRegisterStore.setState({ basket: useCashRegisterStore.getState().basket.concat(article) })
        this.updateBasket()

        const message: ArticleWeighed = {
            event: "articleWeighed",
            data: { article },
        }
        await this.send(message)
    }

    async weighingFailed() {
        const message: WeighingFailed = {
            event: "weighingFailed",
            data: {
                reason: "scaleNotAvailable",
                message: {
                    de: "Waage nicht verfügbar",
                    en: "Scale not available"
                }
            },
        }
        useCashRegisterStore.setState({ scaleArticlePlu: undefined })

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
        const ScanArticles = this.toBasketArticles(message.data.articles)
        if (_.isEmpty(ScanArticles)) {
            return
        }
        useCashRegisterStore.setState({ basket: this.toBasketArticles(message.data.articles) })
    }

    async onAddToBasket(message: AddArticles) {
        const ScanArticles = this.toBasketArticles(message.data.articles)
        if (_.isEmpty(ScanArticles)) {
            return
        }
        useCashRegisterStore.setState({
            basket: useCashRegisterStore.getState().basket.concat(ScanArticles)
        })
    }

    private toBasketArticles(scanArticles: ScanArticle[]): BasketArticle[] {
        const basketArticles: BasketArticle[] = []
        for (const article of scanArticles) {
            const found = articles.find(a => a.priceLookup === article.priceLookup)
            if (!found) {
                this.paymentFailure({
                    en: `Unknown PLU ${article.priceLookup}`,
                    de: `Unbekannte PLU ${article.priceLookup}`,
                })
                return []
            }
            if (found.scale) {
                this.paymentFailure({
                    en: `Scale articles need to be added via weighArticle`,
                    de: `Waageartikel müssen über weighArticle hinzugefügt werden`,
                })
                return []
            }
            basketArticles.push(found)
        }
        return basketArticles
    }

    async onStartPayment(message: StartPayment) {
        const { paymentInProgress, basket } = useCashRegisterStore.getState()
        if (!paymentInProgress && !_.isEmpty(basket)) {
            useCashRegisterStore.setState({
                paymentInProgress: true, paymentMethod: message.data.paymentMethod, qrCodeContent: message.data.identifier
            })
        }
    }

    async onReset() {
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
        useCashRegisterStore.setState({ scaleArticlePlu: parsedMessage.data.article.priceLookup })
    }

    private async send(message: object) {
        const encodedMessage = JSON.stringify(message)
        console.log("Sending message:", encodedMessage)
        this.#ws.send(encodedMessage)
    }

    private async receiveMessage(message: MessageEvent<string>) {
        const parsedMessage = JSON.parse(message.data) as SetBasket | AddArticles | StartPayment | Reset | UserInput | WeighArticle | ApiError | ApiWarning
        console.log("Received message:", message.data)
        switch (parsedMessage.event) {
            case "setBasket":
                await this.onSetBasket(parsedMessage)
                break;
            case "addArticles":
                await this.onAddToBasket(parsedMessage)
                break;
            case "startPayment":
                await this.onStartPayment(parsedMessage)
                break;
            case "reset":
                await this.onReset()
                break;
            case "userInput":
                await this.onUserInput(parsedMessage)
                break;
            case "weighArticle":
                await this.weighArticle(parsedMessage)
                break;
            case "error":
                console.log("Received error:", parsedMessage.data)
                break;
            case "warning":
                console.log("Received error:", parsedMessage.data)
                break;
            default:
                await this.send({ event: "error", data: { reason: "unexpectedEvent", message: `Received unexpected event ${parsedMessage.event}` } })
        }
    }

    private onConnectionChange(event: Event) {
        console.log(`WebSocket connection event: ${event.type}`)
        useCashRegisterStore.setState(
            { connectionState: readyStateMap.get(this.#ws.readyState as 0 | 1 | 2 | 3) ?? "CONNECTING" }
        )
    }
    get connectionState() {
        return this.#ws.readyState
    }

    get ws() {
        return this.#ws
    }
}