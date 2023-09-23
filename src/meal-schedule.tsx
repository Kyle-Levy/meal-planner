import { useState } from 'react'
import { useMealSchedule } from './context/MealSchedule'
import MealColumn from './meal-column'
import MealDay from './meal-day'
import Sidebar, { SidebarState } from './sidebar'

export default function MealSchedule() {
    const mealScheduler = useMealSchedule()
    const [sidebarState, setSidebarState] = useState(SidebarState.CLOSED)
    return (
        <div className="flex h-screen w-screen gap-4">
            <Sidebar sidebarState={sidebarState} setSidebarState={setSidebarState} />
            <div className={` ${sidebarState === SidebarState.CLOSED ? 'ml-16' : 'ml-[28rem]'} flex h-full w-full items-center justify-center bg-gray-100 px-4`}>

                <div className="flex gap-2">
                    <div className="mt-auto flex flex-col gap-2">
                        {mealScheduler.profiles.map((profile) => (
                            <span className="flex h-24 items-center justify-center rounded-md bg-brown-50 px-2 text-base text-brown-900">
                                {profile.name[0]}
                            </span>
                        ))}
                    </div>
                    {mealScheduler.scheduledMeals.map((mealDay) => {
                        return (
                            <MealDay mealTime={mealDay.day} key={mealDay.day}>
                                {Array.from(mealDay.mealSlotMap.keys()).map(
                                    (mealTime) => {
                                        const setOfMeals =
                                            mealDay.mealSlotMap.get(mealTime)
                                        if (setOfMeals === undefined)
                                            throw new Error(
                                                `Missing set of meals for ${mealDay.day} ${mealTime}`
                                            )

                                        return (
                                            <MealColumn
                                                day={mealDay.day}
                                                mealTime={mealTime}
                                                tiles={setOfMeals}
                                                key={`${mealDay.day} ${mealTime}`}
                                            />
                                        )
                                    }
                                )}
                            </MealDay>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
