import { ReactNode } from 'react'
import { Day } from './App'

type MealColumnProps = {
    mealTime: Day
    children: ReactNode
}

export default function MealDay({ mealTime, children }: MealColumnProps) {
    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center justify-center rounded-md bg-red-900 py-1 text-base text-brown-50">
                {mealTime}
            </div>
            <div className="flex gap-2">{children}</div>
        </div>
    )
}
