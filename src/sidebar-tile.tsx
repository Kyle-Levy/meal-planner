import { TileColor, tileColor } from './tile'

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
