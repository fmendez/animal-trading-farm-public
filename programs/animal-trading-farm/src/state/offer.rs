use anchor_lang::prelude::*;

#[account]
pub struct Offer {
    pub who_made_the_offer: Pubkey,
    pub kind_of_token_wanted_in_return: Pubkey,
    pub amount_received_if_offer_accepted: u64,
    pub escrowed_tokens_of_offer_maker_bump: u8,
}
