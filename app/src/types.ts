export type TradeableTokenType = {
    image: string,
    mint: string,
    name: string,
    symbol: string,
    accountHoldingToken: string,
    owner: string,
    amount: string,
    decimals: number,
}

export type MintWithAssociatedAccountType = {
    mint: string,
    associatedAccount: string,
}

export type OfferType = {
    id: string | null,
    tx: string,
    offer: string,
    whoMadeTheOffer: string,
    escrowedTokensOfOfferMaker: string,
    accountHoldingWhatReceiverWillGet: string,
    kindOfTokenOffered: string,
    kindOfTokenWantedInReturn: string,
    whereToSendWhatsWanted: string,
    amountOffered: number,
    amountWanted: number,
    status: string,
    createdAt?: string,
    updatedAt?: string,
}

export type TradeSliceState = {
    offers: OfferType[],
    tokens: TradeableTokenType[]
    mintsWithAccounts: MintWithAssociatedAccountType[],
}