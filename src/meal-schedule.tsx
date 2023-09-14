import { useState } from 'react'
import { Day, MealTime, useMealSchedule } from './context/MealSchedule'
import MealColumn from './meal-column'
import MealDay from './meal-day'
import Sidebar from './sidebar'
import { TileColor } from './tile'

export default function MealSchedule() {
    const mealScheduler = useMealSchedule()
    const [days, setDays] = useState([Day.Monday, Day.Tuesday, Day.Wednesday, Day.Thursday])
    const meals = [MealTime.Lunch, MealTime.Lunch, MealTime.Lunch, MealTime.Lunch]

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

                <button
                    onClick={() => {
                        const firstMeal = mealScheduler.unscheduledMeals[0]
                        const moveDay = days.pop() ?? Day.Saturday
                        setDays(days)
                        const moveTime = meals.pop() ?? MealTime.Lunch
                        mealScheduler.addMealToDay(moveDay, moveTime, 0, firstMeal)
                    }}
                >
                    Add Data
                </button>

                <div className="flex gap-2">
                    {mealScheduler.scheduledMeals.map((mealDay) => {
                        return (
                            <MealDay mealTime={mealDay.day} key={mealDay.day}>
                                {Array.from(mealDay.mealSlotMap.keys()).map(
                                    (mealTime) => {
                                        const setOfMeals =
                                            mealDay.mealSlotMap.get(
                                                mealTime
                                            )
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
