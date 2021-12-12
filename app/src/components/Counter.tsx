type Props = {
    increment: () => void,
    decrement: () => void,
    currentValue: number,
}

function Counter({ increment, decrement, currentValue }: Props) {

    return (
        <div className="flex flex-row h-10 w-full rounded-lg relative bg-transparent mt-1">
            <button onClick={decrement} className=" bg-gray-300 text-gray-600 hover:text-gray-700 hover:bg-gray-400 h-full w-20 rounded-l cursor-pointer outline-none">
                <span className="m-auto text-2xl font-thin">−</span>
            </button>
            <input type="number" readOnly className="outline-none focus:outline-none text-center w-full bg-gray-300 font-semibold text-md hover:text-black focus:text-black  md:text-basecursor-default flex items-center text-gray-700  outline-none" name="custom-input-number" value={currentValue}></input>
            <button onClick={increment} className="bg-gray-300 text-gray-600 hover:text-gray-700 hover:bg-gray-400 h-full w-20 rounded-r cursor-pointer">
                <span className="m-auto text-2xl font-thin">+</span>
            </button>
        </div>
    )
}

export default Counter;
