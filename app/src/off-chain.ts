/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type CreateOpenOfferInput = {
  id?: string | null,
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
};

export type ModelOpenOfferConditionInput = {
  tx?: ModelStringInput | null,
  offer?: ModelStringInput | null,
  whoMadeTheOffer?: ModelStringInput | null,
  escrowedTokensOfOfferMaker?: ModelStringInput | null,
  accountHoldingWhatReceiverWillGet?: ModelStringInput | null,
  kindOfTokenOffered?: ModelStringInput | null,
  kindOfTokenWantedInReturn?: ModelStringInput | null,
  whereToSendWhatsWanted?: ModelStringInput | null,
  amountOffered?: ModelIntInput | null,
  amountWanted?: ModelIntInput | null,
  status?: ModelStringInput | null,
  and?: Array< ModelOpenOfferConditionInput | null > | null,
  or?: Array< ModelOpenOfferConditionInput | null > | null,
  not?: ModelOpenOfferConditionInput | null,
};

export type ModelStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export enum ModelAttributeTypes {
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
  _null = "_null",
}


export type ModelSizeInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
};

export type ModelIntInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
};

export type OpenOffer = {
  __typename: "OpenOffer",
  id: string,
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
  createdAt: string,
  updatedAt: string,
};

export type UpdateOpenOfferInput = {
  id: string,
  tx?: string | null,
  offer?: string | null,
  whoMadeTheOffer?: string | null,
  escrowedTokensOfOfferMaker?: string | null,
  accountHoldingWhatReceiverWillGet?: string | null,
  kindOfTokenOffered?: string | null,
  kindOfTokenWantedInReturn?: string | null,
  whereToSendWhatsWanted?: string | null,
  amountOffered?: number | null,
  amountWanted?: number | null,
  status?: string | null,
};

export type DeleteOpenOfferInput = {
  id: string,
};

export type ModelOpenOfferFilterInput = {
  id?: ModelIDInput | null,
  tx?: ModelStringInput | null,
  offer?: ModelStringInput | null,
  whoMadeTheOffer?: ModelStringInput | null,
  escrowedTokensOfOfferMaker?: ModelStringInput | null,
  accountHoldingWhatReceiverWillGet?: ModelStringInput | null,
  kindOfTokenOffered?: ModelStringInput | null,
  kindOfTokenWantedInReturn?: ModelStringInput | null,
  whereToSendWhatsWanted?: ModelStringInput | null,
  amountOffered?: ModelIntInput | null,
  amountWanted?: ModelIntInput | null,
  status?: ModelStringInput | null,
  and?: Array< ModelOpenOfferFilterInput | null > | null,
  or?: Array< ModelOpenOfferFilterInput | null > | null,
  not?: ModelOpenOfferFilterInput | null,
};

export type ModelIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export type ModelOpenOfferConnection = {
  __typename: "ModelOpenOfferConnection",
  items:  Array<OpenOffer >,
  nextToken?: string | null,
};

export type CreateOpenOfferMutationVariables = {
  input: CreateOpenOfferInput,
  condition?: ModelOpenOfferConditionInput | null,
};

export type CreateOpenOfferMutation = {
  createOpenOffer?:  {
    __typename: "OpenOffer",
    id: string,
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
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateOpenOfferMutationVariables = {
  input: UpdateOpenOfferInput,
  condition?: ModelOpenOfferConditionInput | null,
};

export type UpdateOpenOfferMutation = {
  updateOpenOffer?:  {
    __typename: "OpenOffer",
    id: string,
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
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteOpenOfferMutationVariables = {
  input: DeleteOpenOfferInput,
  condition?: ModelOpenOfferConditionInput | null,
};

export type DeleteOpenOfferMutation = {
  deleteOpenOffer?:  {
    __typename: "OpenOffer",
    id: string,
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
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type GetOpenOfferQueryVariables = {
  id: string,
};

export type GetOpenOfferQuery = {
  getOpenOffer?:  {
    __typename: "OpenOffer",
    id: string,
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
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListOpenOffersQueryVariables = {
  filter?: ModelOpenOfferFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListOpenOffersQuery = {
  listOpenOffers?:  {
    __typename: "ModelOpenOfferConnection",
    items:  Array< {
      __typename: "OpenOffer",
      id: string,
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
      createdAt: string,
      updatedAt: string,
    } >,
    nextToken?: string | null,
  } | null,
};

export type OnCreateOpenOfferSubscription = {
  onCreateOpenOffer?:  {
    __typename: "OpenOffer",
    id: string,
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
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateOpenOfferSubscription = {
  onUpdateOpenOffer?:  {
    __typename: "OpenOffer",
    id: string,
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
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteOpenOfferSubscription = {
  onDeleteOpenOffer?:  {
    __typename: "OpenOffer",
    id: string,
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
    createdAt: string,
    updatedAt: string,
  } | null,
};
