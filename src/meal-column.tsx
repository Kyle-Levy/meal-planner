import Tile, { IndividualMeal, TileType } from './tile'
import { Day, MealTime, UnscheduledMeal, useMealSchedule } from './context/MealSchedule'
import DroppableTile from './droppable-tile'
import { useDrop } from 'react-dnd'

type MealColumnProps = {
    day: Day
    mealTime: MealTime
    tiles: IndividualMeal[]
}

export default function MealColumn({ day, mealTime, tiles }: MealColumnProps) {
    const mealScheduler = useMealSchedule()

    const [, dropRef] = useDrop<UnscheduledMeal>({
        accept: TileType.FILLED,
        drop: (item) => {
            mealScheduler.addMealToTimeSlot(
                day,
                mealTime,
                item.id
            )
        },
    })
    return (
        <div className="flex flex-col gap-2">
            <div ref={dropRef} className="flex items-center justify-center rounded-md bg-red-900 px-4 py-1 text-base text-brown-50">
                {mealTime}
            </div>

            {tiles.map((tileData, index) => {
                return (
                    <DroppableTile
                        mealLocation={{ day, mealTime, index }}
                        tileDetails={tileData}
                        key={`${day} ${mealTime} ${index}`}
                    />
                )
            })}
        </div>
    )
}
