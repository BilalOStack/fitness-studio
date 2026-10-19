export default function QuantityStepper({
  value,
  onIncrement,
  onDecrement,
  min = 1,
  max = 10,
  label = 'Spots',
}) {
  return (
    <div className="flex items-center justify-between gap-2 p-1.5 rounded-lg bg-[#1d1d2c] border border-[#3a3a50]">
      <span className="text-xs text-[#9a9ab0] font-medium pl-1 select-none">
        {label}:
      </span>

      <div className="flex items-center gap-2">
        {/* Decrement Button */}
        <button
          type="button"
          onClick={onDecrement}
          disabled={value <= min}
          aria-label={`Decrease ${label}`}
          className="w-7 h-7 flex items-center justify-center rounded bg-[#27273a] text-white hover:bg-[#e63946] active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-[#27273a] transition-all font-bold text-sm focus:outline-none focus:ring-1 focus:ring-[#e63946]"
        >
          -
        </button>

        {/* Current Value Display */}
        <span className="w-5 text-center text-sm font-semibold text-white select-none">
          {value}
        </span>

        {/* Increment Button */}
        <button
          type="button"
          onClick={onIncrement}
          disabled={value >= max}
          aria-label={`Increase ${label}`}
          className="w-7 h-7 flex items-center justify-center rounded bg-[#27273a] text-white hover:bg-[#e63946] active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-[#27273a] transition-all font-bold text-sm focus:outline-none focus:ring-1 focus:ring-[#e63946]"
        >
          +
        </button>
      </div>
    </div>
  );
}
