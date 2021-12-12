/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getOpenOffer = /* GraphQL */ `
  query GetOpenOffer($id: ID!) {
    getOpenOffer(id: $id) {
      id
      tx
      offer
      whoMadeTheOffer
      escrowedTokensOfOfferMaker
      accountHoldingWhatReceiverWillGet
      kindOfTokenOffered
      kindOfTokenWantedInReturn
      whereToSendWhatsWanted
      amountOffered
      amountWanted
      status
      createdAt
      updatedAt
    }
  }
`;
export const listOpenOffers = /* GraphQL */ `
  query ListOpenOffers(
    $filter: ModelOpenOfferFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listOpenOffers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        tx
        offer
        whoMadeTheOffer
        escrowedTokensOfOfferMaker
        accountHoldingWhatReceiverWillGet
        kindOfTokenOffered
        kindOfTokenWantedInReturn
        whereToSendWhatsWanted
        amountOffered
        amountWanted
        status
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
