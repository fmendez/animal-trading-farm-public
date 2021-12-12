use anchor_lang::prelude::*;

use crate::state::*;
use anchor_spl::token::{Token, TokenAccount};

#[derive(Accounts)]
pub struct CancelOffer<'info> {
    #[account(
        mut,
        constraint = offer.who_made_the_offer == who_made_the_offer.key(),
        close = who_made_the_offer
    )]
    pub offer: Account<'info, Offer>,

    #[account(mut)]
    pub who_made_the_offer: Signer<'info>,

    #[account(mut)]
    pub where_the_escrowed_account_was_funded_from: Account<'info, TokenAccount>,

    #[account(
        mut,
        seeds =[offer.key().as_ref()],
        bump = offer.escrowed_tokens_of_offer_maker_bump
    )]
    pub escrowed_tokens_of_offer_maker: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
}

pub fn handler(ctx: Context<CancelOffer>) -> ProgramResult {
    // Transfer what's on the escrowed account to the offer reciever.
    anchor_spl::token::transfer(
        CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            anchor_spl::token::Transfer {
                from: ctx
                    .accounts
                    .escrowed_tokens_of_offer_maker
                    .to_account_info(),
                to: ctx
                    .accounts
                    .where_the_escrowed_account_was_funded_from
                    .to_account_info(),
                authority: ctx
                    .accounts
                    .escrowed_tokens_of_offer_maker
                    .to_account_info(),
            },
            &[&[
                ctx.accounts.offer.key().as_ref(),
                &[ctx.accounts.offer.escrowed_tokens_of_offer_maker_bump],
            ]],
        ),
        ctx.accounts.escrowed_tokens_of_offer_maker.amount,
    )?;

    // Close the escrow account
    anchor_spl::token::close_account(CpiContext::new_with_signer(
        ctx.accounts.token_program.to_account_info(),
        anchor_spl::token::CloseAccount {
            account: ctx
                .accounts
                .escrowed_tokens_of_offer_maker
                .to_account_info(),
            destination: ctx.accounts.who_made_the_offer.to_account_info(),
            authority: ctx
                .accounts
                .escrowed_tokens_of_offer_maker
                .to_account_info(),
        },
        &[&[
            ctx.accounts.offer.key().as_ref(),
            &[ctx.accounts.offer.escrowed_tokens_of_offer_maker_bump],
        ]],
    ))
}
