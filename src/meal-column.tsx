import Tile, { MealTileData } from './tile'
import { Day, MealTime } from './context/MealSchedule'

type MealColumnProps = {
    day: Day
    mealTime: MealTime
    tiles: MealTileData[]
}

export default function MealColumn({ day,mealTime, tiles }: MealColumnProps) {
    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center justify-center rounded-md bg-red-900 px-4 py-1 text-base text-brown-50">
                {mealTime}
            </div>
            {tiles.map((tileData, index) => {
                return <Tile {...tileData} key={`${day} ${mealTime} ${index}`}/>
            })}
        </div>
    )
}
