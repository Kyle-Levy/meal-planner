import { useDrop } from 'react-dnd'
import Tile, { IndividualMeal, TileType } from './tile'
import { Day, MealTime, useMealSchedule, UnscheduledMeal } from './context/MealSchedule'

type DroppableTileProps = {
    mealLocation: {
        day: Day,
        mealTime: MealTime,
        index: number
    },
    tileDetails: IndividualMeal
}


export default function DroppableTile({mealLocation, tileDetails}: DroppableTileProps) {
    const mealScheduler = useMealSchedule()

    const [, dropRef] = useDrop<UnscheduledMeal>({
        accept: TileType.FILLED,
        drop: (item) => {
            mealScheduler.addMealToDay(mealLocation.day, mealLocation.mealTime, mealLocation.index, item)
        }
    })
    return (
        <div ref={dropRef}>
            <Tile {...tileDetails} />
        </div>
    )
}
