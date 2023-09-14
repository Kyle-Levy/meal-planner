import { useDrag } from 'react-dnd'
import SidebarTile, { SidebarTileProps } from './sidebar-tile'
import { TileColor, TileType } from './tile'
import { UnscheduledMeal, useMealSchedule } from './context/MealSchedule'

export default function DraggableSidebarTile(props: UnscheduledMeal) {
    const mealScheduler = useMealSchedule()
    const [, dragRef] = useDrag<UnscheduledMeal>(
        () => ({
            type: TileType.FILLED,
            item: { ...props },
            canDrag: () => {
                console.log(`${props.servingsLeft} | ${mealScheduler.unscheduledMeals.find(meal => meal.id === props.id)?.servingsLeft}`)
                console.log(props.servingsLeft > 0)
                return props.servingsLeft > 0
            }
        }),
        [props]
    )

    return (
        <div ref={dragRef} className='cursor-pointer'>
            <SidebarTile {...props} />
        </div>
    )
}
