import React, { useState } from 'react'
import './App.css'
import { TileColor, MealTileData, TileType } from './tile'
import MealDay from './meal-day'
import MealColumn from './meal-column'
import Sidebar from './sidebar'

export enum Day {
    Sunday = 'Sunday',
    Monday = 'Monday',
    Tuesday = 'Tuesday',
    Wednesday = 'Wednesday',
    Thursday = 'Thursday',
    Friday = 'Friday',
    Saturday = 'Saturday',
}

export enum MealTime {
    Breakfast = 'Breakfast',
    Lunch = 'Lunch',
    Dinner = 'Dinner',
}

type MealRowData = {
    day: Day
    mealTime: MealTime
    meals: MealTileData[]
}

const MEALS = [MealTime.Lunch, MealTime.Dinner]

const EMPTY_MEAL_DAYS: MealRowData[][] = Object.values(Day).reduce(
    (acc, curr) => {
        const day = MEALS.map((mealTime) => {
            return { day: curr, mealTime, meals: [] }
        })

        acc.push(day)
        return acc
    },
    [] as MealRowData[][]
)

const colors = Object.values(TileColor)
const tempMealNames = [
    'Chicken Teriyaki',
    'Poke Bowl',
    'Chili',
    'Tacos',
    'Breakfast Sandwiches',
    'Leavitt Street Inn',
]

const makeMealTile = () => {
    return {
        type: TileType.FILLED,
        color: colors[getRandomInt(colors.length)],
        title: tempMealNames[getRandomInt(tempMealNames.length)],
    }
}

function getRandomInt(max: number) {
    return Math.floor(Math.random() * max)
}

EMPTY_MEAL_DAYS.forEach((day) => {
    day.forEach((mealSlot) => {
        mealSlot.meals.push(
            getRandomInt(1) === 1 ? { type: TileType.EMPTY } : makeMealTile()
        )
        mealSlot.meals.push(
            getRandomInt(1) === 1 ? { type: TileType.EMPTY } : makeMealTile()
        )
    })
})

function App() {
    return (
        <div className="App">
            <header className="App-header bg-brown-50">
                <div className="flex h-screen w-screen gap-4">
                    <Sidebar />
                    <div className="ml-96 flex h-full w-full items-center justify-center bg-brown-50 px-4">
                        <div className="flex gap-2">
                            {EMPTY_MEAL_DAYS.map((day) => {
                                return (
                                    <MealDay mealTime={day[0].day}>
                                        {day.map((mealTime) => {
                                            return (
                                                <MealColumn
                                                    mealTime={mealTime.mealTime}
                                                    tiles={mealTime.meals}
                                                />
                                            )
                                        })}
                                    </MealDay>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </header>
        </div>
    )
}

export default App
