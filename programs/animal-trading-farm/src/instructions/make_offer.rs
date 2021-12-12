use anchor_lang::prelude::*;

use crate::state::*;
use anchor_spl::token::{Mint, Token, TokenAccount};

#[derive(Accounts)]
#[instruction(escrow_bump: u8)]
pub struct MakeOffer<'info> {
    #[account(init, payer = who_made_the_offer, space = 8 + 32 + 32 + 8 + 1)]
    pub offer: Account<'info, Offer>,

    #[account(mut)]
    pub who_made_the_offer: Signer<'info>,

    #[account(mut, constraint = token_account_from_who_made_the_offer.mint ==  kind_of_token_offered.key())]
    pub token_account_from_who_made_the_offer: Account<'info, TokenAccount>,

    #[account(
        init,
        payer = who_made_the_offer,
        seeds = [offer.key().as_ref()],
        bump = escrow_bump,
        token::mint = kind_of_token_offered,
        token::authority = escrowed_tokens_of_offer_maker,
    )]
    pub escrowed_tokens_of_offer_maker: Account<'info, TokenAccount>,

    pub kind_of_token_offered: Account<'info, Mint>,

    pub kind_of_token_wanted_in_return: Account<'info, Mint>,

    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

pub fn handler(
    ctx: Context<MakeOffer>,
    escrowed_tokens_of_offer_maker_bump: u8,
    im_offering_this_much: u64,
    how_much_i_want_of_what_you_have: u64,
) -> ProgramResult {
    let offer = &mut ctx.accounts.offer;
    offer.who_made_the_offer = ctx.accounts.who_made_the_offer.key();
    offer.kind_of_token_wanted_in_return = ctx.accounts.kind_of_token_wanted_in_return.key();
    offer.amount_received_if_offer_accepted = how_much_i_want_of_what_you_have;
    offer.escrowed_tokens_of_offer_maker_bump = escrowed_tokens_of_offer_maker_bump;

    anchor_spl::token::transfer(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            anchor_spl::token::Transfer {
                from: ctx
                    .accounts
                    .token_account_from_who_made_the_offer
                    .to_account_info(),
                to: ctx
                    .accounts
                    .escrowed_tokens_of_offer_maker
                    .to_account_info(),
                authority: ctx.accounts.who_made_the_offer.to_account_info(),
            },
        ),
        im_offering_this_much,
    )
}
