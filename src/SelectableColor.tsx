import { TileColor, tileColor } from './Tile'

type SelectableColorProps = {
    selected: boolean
    color: TileColor
    onChange: (color: TileColor) => void
}
export default function SelectableColor({
    selected,
    color,
    onChange,
}: SelectableColorProps) {
    return (
        <div
            className={`flex items-center justify-center rounded-md ${
                selected ? 'border border-gray-300 bg-gray-200' : ''
            } p-1`}
        >
            <span
                className={`h-8 w-8 cursor-pointer rounded-md ${tileColor(
                    color
                )}`}
                onClick={() => onChange(color)}
            />
        </div>
    )
}
