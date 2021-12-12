use anchor_lang::prelude::*;

use crate::state::*;
use anchor_spl::token::{Mint, Token, TokenAccount};

#[derive(Accounts)]
pub struct AcceptOffer<'info> {
    #[account(
        mut,
        constraint = offer.who_made_the_offer == who_made_the_offer.key(),
        close = who_made_the_offer 
    )]
    pub offer: Account<'info, Offer>,

    #[account(mut)]
    pub escrowed_tokens_of_offer_maker: Account<'info, TokenAccount>,

    #[account(mut)]
    pub who_made_the_offer: AccountInfo<'info>,

    pub who_is_taking_the_offer: Signer<'info>,

    #[account(
        mut,
        associated_token::mint = kind_of_token_wanted_in_return,
        associated_token::authority = who_made_the_offer
    )]
    pub account_holding_what_maker_will_get: Box<Account<'info, TokenAccount>>,

    #[account(
        mut,
        constraint = account_holding_what_receiver_will_give.mint == offer.kind_of_token_wanted_in_return
    )]
    pub account_holding_what_receiver_will_give: Account<'info, TokenAccount>,

    #[account(mut)]
    pub account_holding_what_receiver_will_get: Account<'info, TokenAccount>,

    #[account(address = offer.kind_of_token_wanted_in_return)]
    pub kind_of_token_wanted_in_return: Account<'info, Mint>,

    pub token_program: Program<'info, Token>,
}

    pub fn handler(ctx: Context<AcceptOffer>) -> ProgramResult {
        // Transfer token to who started the offer
        anchor_spl::token::transfer(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                anchor_spl::token::Transfer {
                    from: ctx
                        .accounts
                        .account_holding_what_receiver_will_give
                        .to_account_info(),
                    to: ctx
                        .accounts
                        .account_holding_what_maker_will_get
                        .to_account_info(),
                    authority: ctx.accounts.who_is_taking_the_offer.to_account_info(),
                },
            ),
            ctx.accounts.offer.amount_received_if_offer_accepted,
        )?;

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
                        .account_holding_what_receiver_will_get
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
