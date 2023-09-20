import { useDrag, useDrop } from 'react-dnd'
import {
    Day,
    MealTime,
    UnscheduledMeal,
    useMealSchedule,
} from './context/MealSchedule'
import Tile, { IndividualMeal, TileType, FilledMealTile } from './tile'
import { DraggableTypes } from './types'

type ScheduledMealDrop = {
    tileDetails: FilledMealTile
    originalLocation: {
        day: Day
        mealTime: MealTime
        index: number
    }
}

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

    const [, dropRef] = useDrop<UnscheduledMeal | ScheduledMealDrop>({
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
                //TODO Need to pass original square when coming from a scheduled meal
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

    const [, dragRef] = useDrag(
        () => ({
            type: DraggableTypes.ScheduledMeal,
            item: {
                originalLocation: { ...mealLocation },
                tileDetails: {
                    id:
                        tileDetails.type === TileType.FILLED
                            ? tileDetails.id
                            : '',
                    title:
                        tileDetails.type === TileType.FILLED
                            ? tileDetails.title
                            : '',
                    color:
                        tileDetails.type === TileType.FILLED
                            ? tileDetails.color
                            : '',
                    type: tileDetails.type,
                },
            }, //TODO Need to pass original square when coming from a scheduled meal
        }),
        [tileDetails]
    )

    //TODO Need tile to also implement draggable
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
                <div ref={dragRef}>
                    <Tile {...tileDetails} />
                </div>
            ) : (
                <Tile {...tileDetails} />
            )}
        </div>
    )
}
