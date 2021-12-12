/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createOpenOffer = /* GraphQL */ `
  mutation CreateOpenOffer(
    $input: CreateOpenOfferInput!
    $condition: ModelOpenOfferConditionInput
  ) {
    createOpenOffer(input: $input, condition: $condition) {
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
export const updateOpenOffer = /* GraphQL */ `
  mutation UpdateOpenOffer(
    $input: UpdateOpenOfferInput!
    $condition: ModelOpenOfferConditionInput
  ) {
    updateOpenOffer(input: $input, condition: $condition) {
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
export const deleteOpenOffer = /* GraphQL */ `
  mutation DeleteOpenOffer(
    $input: DeleteOpenOfferInput!
    $condition: ModelOpenOfferConditionInput
  ) {
    deleteOpenOffer(input: $input, condition: $condition) {
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
