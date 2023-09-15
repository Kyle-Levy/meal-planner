import { DragPreviewImage, useDrag, useDragLayer } from 'react-dnd'
import SidebarTile, { SidebarTileProps } from './sidebar-tile'
import Tile, { TileColor, TileType } from './tile'
import { UnscheduledMeal, useMealSchedule } from './context/MealSchedule'
import { useEffect } from 'react'
import { getEmptyImage } from 'react-dnd-html5-backend'

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
        dragPrev(getEmptyImage(), {captureDraggingState: true})
    }, [])

    return (
        

            <div ref={dragRef} className="cursor-pointer">
                
                <SidebarTile {...props} />
            </div>
            
    )
}

