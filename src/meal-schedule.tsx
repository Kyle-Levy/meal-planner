import { useState } from 'react'
import { Day, MealTime, useMealSchedule } from './context/MealSchedule'
import MealColumn from './meal-column'
import MealDay from './meal-day'
import Sidebar from './sidebar'

export default function MealSchedule() {
    const mealScheduler = useMealSchedule()

    return (
        <div className="flex h-screen w-screen gap-4">
            <Sidebar />
            <div className="ml-96 flex h-full w-full items-center justify-center bg-brown-50 px-4">
                <button
                    onClick={() => {
                        mealScheduler.addEmptyRow()
                    }}
                >
                    Add Empty Row of Data
                </button>

                <div className="flex gap-2">
                    <div className="mt-auto flex flex-col gap-2">
                        {mealScheduler.profiles.map((profile) => (
                            <span className="flex h-24 items-center justify-center rounded-md bg-red-900 px-2 text-base text-brown-50">
                                {profile[0]}
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
