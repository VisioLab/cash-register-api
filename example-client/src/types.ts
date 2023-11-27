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
       * The default price for the articles. Is disregarded for price calculation if priceLookup is present. For scale items this is the price per unit of weight.
       *
       */
      price: number;
      /**
       * Optional scale configuration for the article. If present, the article will be weighed instead of counted. The price will be calculated based on the weight.
       *
       */
      scale?: {
        /**
         * Unit of the weight, e.g. `g` or `kg`.
         *
         */
        unit?: string;
        /**
         * The factor by which the unit is multiplied to display the price per unit to the guest. E.g. 100 if the price is denoted in 100g.
         *
         */
        factor?: number;
      };
      /**
       * Optional unique identifier for the article, such as a GUID. Must not contain any "." or "/" characters. Different articles with the same price on different days should still have different IDs. If not set, a unique ID will be generated internally.
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

export interface UpdateBasket {
  event: "updateBasket";
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
       * The updated price for the article after recalculation with discounts.
       */
      price: number;
      /**
       * Only present if the article is weighed.
       */
      scale?: {
        /**
         * The weight of the article in units.
         *
         */
        weight?: number;
        /**
         * Unit of the weight, e.g. `g` or `kg`. Only present if the article is weighed.
         *
         */
        unit?: string;
      };
      /**
       * Optional unique identifier for the article, such as a GUID. Must not contain any "." or "/" characters. Must match the IDs that were sent in the original basket. Different articles with the same price on different days should still have different IDs.
       *
       */
      id?: string;
    }[];
  };
}

export interface ArticleWeighed {
  event: "articleWeighed";
  data: {
    article: {
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
       * The updated price for the article after recalculation with discounts.
       */
      price: number;
      /**
       * Only present if the article is weighed.
       */
      scale?: {
        /**
         * The weight of the article in units.
         *
         */
        weight?: number;
        /**
         * Unit of the weight, e.g. `g` or `kg`. Only present if the article is weighed.
         *
         */
        unit?: string;
      };
      /**
       * Optional unique identifier for the article, such as a GUID. Must not contain any "." or "/" characters. Must match the IDs that were sent in the original basket. Different articles with the same price on different days should still have different IDs.
       *
       */
      id?: string;
    };
  };
}

export interface WeighingFailed {
  event: "weighingFailed";
  data: {
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

export interface PaymentSuccess {
  event: "paymentSuccess";
  data: {
    /**
     * Identifier for the cash register that processed the payment.
     *
     */
    cashRegisterId?: string;
    /**
     * Unique identifier for the receipt, such as a GUID. Must not contain any "." or "/" characters.
     *
     */
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
    reason: "cancelled" | "cardRemovedTooQuickly" | "insufficientBalance" | "other";
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
    id: string;
  };
}

export interface ApiError {
  event?: "error";
  data?: {
    reason: "malformed" | "internal" | "unexpectedEvent" | "unknown";
    message: string;
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
       * Unique identifier for the article, such as a GUID. Must not contain any "." or "/" characters.
       *
       */
      id: string;
    }[];
  };
}

export interface WeighArticle {
  event: "weighArticle";
  data: {
    article: {
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
       * The default price for the articles. Is disregarded for price calculation if priceLookup is present. For scale items this is the price per unit of weight.
       *
       */
      price: number;
      /**
       * Optional scale configuration for the article. If present, the article will be weighed instead of counted. The price will be calculated based on the weight.
       *
       */
      scale?: {
        /**
         * Unit of the weight, e.g. `g` or `kg`.
         *
         */
        unit?: string;
        /**
         * The factor by which the unit is multiplied to display the price per unit to the guest. E.g. 100 if the price is denoted in 100g.
         *
         */
        factor?: number;
      };
      /**
       * Optional unique identifier for the article, such as a GUID. Must not contain any "." or "/" characters. Different articles with the same price on different days should still have different IDs. If not set, a unique ID will be generated internally.
       *
       */
      id?: string;
      /**
       * Preview image for the article as base64 encoded string.
       */
      previewImage?: string;
    };
  };
}

export interface StartPayment {
  event: "startPayment";
  data: {
    /**
     * Method used to complete the transaction, e.g. `KEY_CARD` or `CREDIT_CARD`.  Exact values depend on the cash register.
     *
     */
    paymentMethod: string;
    /**
     * Unique ID for the checkout assigned by the Blink app.  Useful for reconciliation between the scanner and the cash register.
     *
     */
    checkoutId: string;
    /**
     * Identifier for the guest, such as provided by a QR code or an employee card. Can be used if a QR code is directly scanned by VisioLab.
     *
     */
    identifier?: string;
  };
}

export interface PrintReceipt {
  event: "printReceipt";
  data: {
    /**
     * Unique ID for the checkout assigned by the Blink app.
     *
     */
    checkoutId: string;
    /**
     * Unique ID for the checkout assigned by the cash register.
     *
     */
    receiptId?: string;
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
