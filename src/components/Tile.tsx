export type IndividualMeal = EmptyMealTile | FilledMealTile

export type EmptyMealTile = {
    type: TileType.EMPTY
}
export type FilledMealTile = {
    type: TileType.FILLED
    id: string
    title: string
    color: TileColor
}

export enum TileType {
    EMPTY = 'EMPTY',
    FILLED = 'FILLED',
}

export enum TileColor {
    ROSE = 'ROSE',
    ORANGE = 'ORANGE',
    YELLOW = 'YELLOW',
    EMERALD = 'EMERALD',
    INDIGO = 'INDIGO',
    SKY = 'SKY',
    PURPLE = 'PURPLE',
}

export function tileColor(color: TileColor) {
    switch (color) {
        case TileColor.ORANGE:
            return 'bg-[#ec7668] text-[#ecd19e]'
        case TileColor.YELLOW:
            return 'bg-[#e7c456] text-[#8f6049]'
        case TileColor.EMERALD:
            return 'bg-[#3aa08f] text-[#ded46a]'
        case TileColor.SKY:
            return 'bg-[#304180] text-[#edd4d2]'
        case TileColor.INDIGO:
            return 'bg-[#656553] text-[#e8ca57]'
        case TileColor.PURPLE:
            return 'bg-[#4a3a7a] text-[#eed7ff]'
        case TileColor.ROSE:
            return 'bg-[#aa4843] text-[#ff836c]'
    }
}

export default function Tile(props: IndividualMeal) {
    if (props.type === TileType.FILLED) {
        const { title, color } = props
        return (
            <div
                className={`h-24 w-24 ${tileColor(
                    color
                )} flex items-center justify-center rounded-md p-2 text-base`}
            >
                {title}
            </div>
        )
    }
    if (props.type === TileType.EMPTY) {
        return <div className="h-24 w-24 rounded-md bg-gray-300" />
    }

    throw new Error(`Tile component does not support type`)
}
