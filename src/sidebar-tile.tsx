import { TileColor } from './tile'

export type SidebarTileProps = {
    title: string
    servingsLeft: number
    color: TileColor
}

export enum TileType {
    EMPTY = 'EMPTY',
    FILLED = 'FILLED',
}

export default function SidebarTile({
    title,
    color,
    servingsLeft,
}: SidebarTileProps) {
    function tileColor(color: TileColor) {
        switch (color) {
            case TileColor.ORANGE:
                return 'bg-orange-500'
            case TileColor.YELLOW:
                return 'bg-yellow-500'
            case TileColor.EMERALD:
                return 'bg-emerald-500'
            case TileColor.SKY:
                return 'bg-sky-500'
            case TileColor.INDIGO:
                return 'bg-indigo-500'
            case TileColor.PURPLE:
                return 'bg-purple-500'
            case TileColor.ROSE:
                return 'bg-rose-500'
        }
    }

    return (
        <div
            className={`w-full ${tileColor(color)} ${
                servingsLeft === 0 && 'cursor-not-allowed opacity-50'
            } flex select-none items-center justify-between rounded-md p-2 text-base text-white`}
        >
            <span>{title}</span>
            <span>{servingsLeft}</span>
        </div>
    )
}
