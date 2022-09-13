export interface SyncArticles {
  event: "syncArticles";
  data: {
    articles: {
      /**
       * Name of the article.
       */
      name: string;
      /**
       * The price lookup code for the article. Whatever identifier is used in the cash register to identify the price group of articles, such as an article ID.
       *
       */
      priceLookup: string;
      /**
       * The default price for the articles. Is disregarded for price calculation if priceLookup is present.
       */
      price: number;
      /**
       * Optional unique identifier for the article, such as a GUID. Different articles with the same price on different days should still have different IDs. If not set, a unique ID will be generated internally.
       *
       */
      id?: string;
      /**
       * Preview image for the article as base64 encoded string.
       */
      previewImage?: string;
    }[];
  };
}

export interface PaymentSuccess {
  event: "paymentSuccess";
  data: {
    cashRegisterId?: string;
    receiptId?: string;
    /**
     * The amount that was payed for the transaction.
     */
    totalGross: number;
    /**
     * The amount of taxes that was payed for the transaction.
     */
    totalVat?: number;
    /**
     * URL pointing to the digital receipt for the transaction. Will be rendered as QR code.
     */
    receiptUrl?: string;
  };
}

export interface PaymentFailure {
  event: "paymentFailure";
  data: {
    /**
     * Reason for the payment failure.
     */
    reason: "cancelled" | "cardRemovedTooQuickly" | "notEnoughBalance" | "other";
    /**
     * Message for the customer on how to proceed with the payment.
     */
    message: {
      /**
       * The English text.
       */
      en: string;
      /**
       * The German text.
       */
      de: string;
    };
  };
}

export interface ShowDialog {
  event: "showDialog";
  data: {
    /**
     * Identifier for this kind of dialog. E.g. `cardReaderError`.
     */
    id: string;
    /**
     * Title of the dialog.
     */
    title: {
      /**
       * The English text.
       */
      en: string;
      /**
       * The German text.
       */
      de: string;
    };
    /**
     * Dialog body to display to the customer.
     */
    body: {
      /**
       * The English text.
       */
      en: string;
      /**
       * The German text.
       */
      de: string;
    };
    buttons?: {
      /**
       * Action the button will trigger when pressed.
       */
      action: string;
      /**
       * Label to display on the button.
       */
      label: {
        /**
         * The English text.
         */
        en: string;
        /**
         * The German text.
         */
        de: string;
      };
    }[];
  };
}

export interface CloseDialog {
  event: "closeDialog";
  data: {
    /**
     * Identifier for this kind of dialog. E.g. `cardReaderError`.
     */
    id?: string;
  };
}

export interface SetBasket {
  event: "setBasket";
  data: {
    articles: {
      /**
       * Name of the article.
       */
      name: string;
      /**
       * The price lookup code for the article. Whatever identifier is used in the cash register, to identify the price group of articles, such as an article ID.
       *
       */
      priceLookup: string;
      /**
       * Unique identifier for the article, such as a GUID.
       *
       */
      id: string;
    }[];
  };
}

export interface StartPayment {
  event: "startPayment";
  data: {
    paymentMethod: string;
  };
}

export interface UserInput {
  event: "userInput";
  data: {
    id: string;
    action: string;
  };
}

export interface Reset {
  event: "reset";
}
