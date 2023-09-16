import { useEffect } from 'react'
import { useDrag } from 'react-dnd'
import { getEmptyImage } from 'react-dnd-html5-backend'
import { UnscheduledMeal, useMealSchedule } from './context/MealSchedule'
import SidebarTile from './sidebar-tile'
import { TileType } from './tile'

export default function DraggableSidebarTile(props: UnscheduledMeal) {
    const mealScheduler = useMealSchedule()
    const [{ isDragging }, dragRef, dragPrev] = useDrag(
        () => ({
            type: TileType.FILLED,
            item: { ...props },
            canDrag: () => {
                return props.servingsLeft > 0
            },
            collect: (monitor) => ({
                isDragging: !!monitor.isDragging(),
            }),
        }),
        [props]
    )

    useEffect(() => {
        dragPrev(getEmptyImage(), { captureDraggingState: true })
    }, [])

    return (
        <div ref={dragRef} className="grow cursor-pointer">
            <SidebarTile {...props} />
        </div>
    )
}
