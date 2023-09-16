import { useDrop } from 'react-dnd'
import {
    Day,
    MealTime,
    UnscheduledMeal,
    useMealSchedule,
} from './context/MealSchedule'
import Tile, { IndividualMeal, TileType } from './tile'

type DroppableTileProps = {
    mealLocation: {
        day: Day
        mealTime: MealTime
        index: number
    }
    tileDetails: IndividualMeal
}

export default function DroppableTile({
    mealLocation,
    tileDetails,
}: DroppableTileProps) {
    const mealScheduler = useMealSchedule()

    const [, dropRef] = useDrop<UnscheduledMeal>({
        accept: TileType.FILLED,
        drop: (item) => {
            mealScheduler.addMealToDay(
                mealLocation.day,
                mealLocation.mealTime,
                mealLocation.index,
                item
            )
        },
    })
    return (
        <div
            ref={dropRef}
            onClick={() => {
                mealScheduler.removeMealFromDay(
                    mealLocation.day,
                    mealLocation.mealTime,
                    mealLocation.index
                )
            }}
            className={
                tileDetails.type === TileType.FILLED ? 'cursor-pointer' : ''
            }
        >
            <Tile {...tileDetails} />
        </div>
    )
}
