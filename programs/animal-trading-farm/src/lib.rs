use anchor_lang::prelude::*;

pub mod instructions;
pub mod state;

use instructions::*;

declare_id!("6iHfHR4e2KusjUQMoqEgjNqaxw4Cgg5R3xgKrCorxEHN");

#[program]
pub mod animal_trading_farm {

    use super::*;

    pub fn make_offer(
        ctx: Context<MakeOffer>,
        escrowed_tokens_of_offer_maker_bump: u8,
        im_offering_this_much: u64,
        how_much_i_want_of_what_you_have: u64,
    ) -> ProgramResult {
        instructions::make_offer::handler(
            ctx,
            escrowed_tokens_of_offer_maker_bump,
            im_offering_this_much,
            how_much_i_want_of_what_you_have,
        )
    }

    pub fn accept_offer(ctx: Context<AcceptOffer>) -> ProgramResult {
        instructions::accept_offer::handler(ctx)
    }

    pub fn cancel_offer(ctx: Context<CancelOffer>) -> ProgramResult {
        instructions::cancel_offer::handler(ctx)
    }

    pub fn airdrop(
        ctx: Context<Airdrop>,
        mint_seed: Vec<u8>,
        mint_bump: u8,
        amount: u64,
    ) -> ProgramResult {
        instructions::airdrop::handler(ctx, mint_seed, mint_bump, amount)
    }
}
