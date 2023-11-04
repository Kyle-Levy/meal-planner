import { useDrop } from 'react-dnd'
import DraggableScheduleTile, {
    DraggableScheduleTileProps,
} from './DraggableScheduleTile'
import {
    Day,
    MealTime,
    UnscheduledMeal,
    useMealSchedule,
} from './context/MealSchedule'
import Tile, { IndividualMeal, TileType } from './Tile'
import { DraggableTypes } from './types'

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

    const [, dropRef] = useDrop<UnscheduledMeal | DraggableScheduleTileProps>({
        accept: [DraggableTypes.UnscheduledMeal, DraggableTypes.ScheduledMeal],
        drop: (item, monitor) => {
            if (
                monitor.getItemType() === DraggableTypes.UnscheduledMeal &&
                !('originalLocation' in item)
            ) {
                mealScheduler.addMealToDay(
                    mealLocation.day,
                    mealLocation.mealTime,
                    mealLocation.index,
                    item
                )
            } else if (
                monitor.getItemType() === DraggableTypes.ScheduledMeal &&
                'originalLocation' in item
            ) {
                mealScheduler.removeMealFromDay(
                    item.originalLocation.day,
                    item.originalLocation.mealTime,
                    item.originalLocation.index
                )

                mealScheduler.addMealToDay(
                    mealLocation.day,
                    mealLocation.mealTime,
                    mealLocation.index,
                    item.tileDetails
                )
            }
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
            {tileDetails.type === TileType.FILLED ? (
                <DraggableScheduleTile
                    originalLocation={{ ...mealLocation }}
                    tileDetails={{ ...tileDetails }}
                />
            ) : (
                <Tile {...tileDetails} />
            )}
        </div>
    )
}
