import { ReactNode, createContext, useCallback, useContext } from 'react'
import {
    EmptyMealTile,
    FilledMealTile,
    IndividualMeal,
    TileColor,
    TileType,
} from '../tile'
import { useImmer } from 'use-immer'
import { v4 as uuid } from 'uuid'

type MealScheduleProviderProps = {
    children: ReactNode
}

type MealScheduleContext =
    | {
          scheduledMeals: ScheduledDay[]
          unscheduledMeals: UnscheduledMeal[]
          addEmptyRow: () => void
          createMeal: (title: string, servings: number) => void
          addMealToDay: (
              day: Day,
              mealTime: MealTime,
              mealIndex: number,
              mealData: { id: string; title: string; color: TileColor },
          ) => void
      }
    | {}
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

type ScheduledDay = {
    day: Day
    mealSlotMap: Map<MealTime, IndividualMeal[]>
}

type UnscheduledMeal = {
    id: string
    title: string
    servings: number
    servingsLeft: number
    color: TileColor
}

//Used to make random tiles
function getRandomInt(max: number) {
    return Math.floor(Math.random() * max)
}

//Used to make random tiles
const colors = Object.values(TileColor)
//Used to make random tiles
const tempMealNames = [
    'Chicken Teriyaki',
    'Poke Bowl',
    'Chili',
    'Tacos',
    'Breakfast Sandwiches',
    'Leavitt Street Inn',
]
//Used to make random tiles
const makeMealTile = () => {
    return {
        type: TileType.FILLED,
        color: colors[getRandomInt(colors.length)],
        title: tempMealNames[getRandomInt(tempMealNames.length)],
    }
}

type MealScheduleState = {
    scheduledMeals: ScheduledDay[]
    unscheduledMeals: UnscheduledMeal[]
}

const MEALS_TO_PREPARE = [MealTime.Lunch, MealTime.Dinner]
const MealScheduleContext = createContext<MealScheduleContext>({})

export function MealScheduleProvider({ children }: MealScheduleProviderProps) {
    const [mealScheduler, setMealScheduler] = useImmer<MealScheduleState>({
        scheduledMeals: initializeWeek(),
        unscheduledMeals: []
    })

    function initializeWeek(): ScheduledDay[] {
        return Object.values(Day).map((dayOfWeek) => {
            const mealDay: ScheduledDay = {
                day: dayOfWeek,
                mealSlotMap: new Map<MealTime, IndividualMeal[]>(
                    MEALS_TO_PREPARE.map((mealTime) => {
                        return [mealTime, []]
                    })
                ),
            }
            return mealDay
        })
    }

    /*
    function canAllocateMeal(id: string) {
        const meal = unscheduledMeals.find((storedMeal) => storedMeal.id === id)
        if (!meal) throw new Error(`Meal with id '${id}' does not exist`)

        return meal.servings > 0
    }

    function reconcileServingsLeft(mealDays: ScheduledDay[]){
        //Meal UUID to amount of servings used
        const amountUsedMap = getMealTiles(mealDays).reduce(
            (acc, curr) => {
                if (curr.type === TileType.FILLED) {
                    if (curr.id in acc) {
                        acc[curr.id]++
                    } else {
                        acc[curr.id] = 0
                    }
                }
                return acc
            },
            {} as { [key: string]: number }
        )

        setunscheduledMeals((oldunscheduledMeals) => {
            oldunscheduledMeals.forEach((mealToSchedule) => {
                const amountUsed = amountUsedMap[mealToSchedule.id] ?? 0
                mealToSchedule.servingsLeft =
                    mealToSchedule.servings - amountUsed
            })
        })
    }

    function getMealTiles(mealDays: ScheduledDay[]): IndividualMeal[] {
        return mealDays.reduce((acc, curr) => {
            acc.push(...Array.from(curr.mealSlotMap.values()).flat())
            return acc
        }, [] as IndividualMeal[])
    }

    */

    const addEmptyRow = useCallback(() => {
        setMealScheduler((oldScheduleState) => {
            oldScheduleState.scheduledMeals.forEach((mealDay) => {
                Array.from(mealDay.mealSlotMap.keys()).forEach(
                    (mealTimeKey) => {
                        const mealSet =
                            mealDay.mealSlotMap.get(mealTimeKey)
                        mealSet?.push({ type: TileType.EMPTY })
                    }
                )
            })
        })
    }, [])

    const createMeal = useCallback((title: string, servings: number) => {
        setMealScheduler((oldScheduleState) => {
            oldScheduleState.unscheduledMeals.push({
                id: uuid(),
                title,
                servings,
                servingsLeft: servings,
                color: colors[getRandomInt(colors.length)],
            })
        })
    }, [])

    const addMealToDay = useCallback(
        (
            day: Day,
            mealTime: MealTime,
            mealIndex: number,
            mealData: { id: string; title: string; color: TileColor },
        ) => {
            //TODO Only work if servings available
           
            /* if (!canAllocateMeal(passMeal , mealData.id))
                throw new Error(`Cannot allocate meal '${mealData.id}'`) */

            setMealScheduler((draft) => {

                
                const foundDay = draft.scheduledMeals.find((mealDay) => mealDay.day === day)
                if (!foundDay)
                    throw new Error(`Could not find meal with day ${day}`)

                const mealSetArr = foundDay.mealSlotMap.get(mealTime)
                if (!mealSetArr)
                    throw new Error(
                        `Could not find with day ${day} and time ${mealTime}`
                    )

                mealSetArr[mealIndex] = {
                    ...mealData,
                    type: TileType.FILLED,
                }

                //TODO After meal is dropped, calculate serving amounts left for every meal
                //reconcileServingsLeft(draft)
            })
        },
        []
    )

    function removeMealFromDay() {}

    const value: MealScheduleContext = {
        scheduledMeals: mealScheduler.scheduledMeals,
        unscheduledMeals: mealScheduler.unscheduledMeals,
        addEmptyRow,
        createMeal,
        addMealToDay,
    }

    return (
        <MealScheduleContext.Provider value={value}>
            {children}
        </MealScheduleContext.Provider>
    )
}

export function useMealSchedule() {
    const context = useContext(MealScheduleContext)
    if (!('scheduledMeals' in context)) {
        throw new Error('Context lacks state and functions')
    }
    return context
}
