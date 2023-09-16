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
    SKY = 'SKY',
    INDIGO = 'INDIGO',
    PURPLE = 'PURPLE',
}

export function tileColor(color: TileColor) {
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

export default function Tile(props: IndividualMeal) {
    

    if (props.type === TileType.FILLED) {
        const { title, color } = props
        return (
            <div
                className={`h-24 w-24 ${tileColor(
                    color
                )} flex items-center justify-center rounded-md p-2 text-base text-white`}
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
