import { useAppSelector } from '../hooks';
import { TradeableTokenType } from '../types'
import Airdrop from './Airdrop';
import TradeableToken from './TradeableToken'

function Tokens() {
    const { tokens } = useAppSelector((state) => state.trades);
    return (
        <div>
            <Airdrop />
            <div>
                {tokens.length > 0 &&
                    <div className="flex flex-col">
                        <h1 className="self-center justify-center text-3xl lg:text-6xl pb-8 font-bold text-red-btn">Your Tokens</h1>
                    </div>
                }
            </div>
            <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-2 justify-items-center">
                {tokens.map((token: TradeableTokenType) => <TradeableToken key={token.mint} token={token} />)}
            </div>
        </div>
    )
}

export default Tokens
