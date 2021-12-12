use anchor_lang::prelude::*;

use anchor_spl::{
    associated_token::AssociatedToken,
    token::{Mint, Token, TokenAccount},
};

#[derive(Accounts)]
#[instruction(mint_seed: Vec<u8>,mint_bump: u8, amount: u64)]
pub struct Airdrop<'info> {
    #[account(
        init_if_needed,
        payer = payer,
        seeds = [&mint_seed],
        bump = mint_bump,
        mint::decimals = 9,
        mint::authority = mint
    )]
    pub mint: Account<'info, Mint>,

    #[account(
        init_if_needed,
        payer = payer,
        associated_token::mint = mint,
        associated_token::authority = payer
    )]
    pub destination: Account<'info, TokenAccount>,

    #[account(mut)]
    pub payer: Signer<'info>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub rent: Sysvar<'info, Rent>,
}

pub fn handler(
    ctx: Context<Airdrop>,
    mint_seed: Vec<u8>,
    mint_bump: u8,
    amount: u64,
) -> ProgramResult {
    anchor_spl::token::mint_to(
        CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            anchor_spl::token::MintTo {
                mint: ctx.accounts.mint.to_account_info(),
                to: ctx.accounts.destination.to_account_info(),
                authority: ctx.accounts.mint.to_account_info(),
            },
            &[&[&mint_seed, &[mint_bump]]],
        ),
        amount,
    )?;
    Ok(())
}
