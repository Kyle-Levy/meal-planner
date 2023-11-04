import { useDrag } from 'react-dnd'
import { Day, MealTime } from './context/MealSchedule'
import Tile, { FilledMealTile } from './Tile'
import { DraggableTypes } from './types'

export type DraggableScheduleTileProps = {
    tileDetails: FilledMealTile
    originalLocation: {
        day: Day
        mealTime: MealTime
        index: number
    }
}

export default function DraggableScheduleTile({
    tileDetails,
    originalLocation,
}: DraggableScheduleTileProps) {
    const [, dragRef] = useDrag<DraggableScheduleTileProps>(
        () => ({
            type: DraggableTypes.ScheduledMeal,
            item: {
                originalLocation: { ...originalLocation },
                tileDetails: {
                    id: tileDetails.id,
                    title: tileDetails.title,
                    color: tileDetails.color,
                    type: tileDetails.type,
                },
            },
        }),
        [tileDetails]
    )

    return (
        <div ref={dragRef}>
            <Tile {...tileDetails} />
        </div>
    )
}
