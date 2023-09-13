import { ReactNode, createContext, useCallback, useContext } from 'react'
import { MealTileData, TileColor, TileType } from '../tile'
import { useImmer } from 'use-immer'

type MealScheduleProviderProps = {
    children: ReactNode
}

type MealScheduleContext = {
    scheduledMeals: MealDay[]
    mealsToSchedule: MealToSchedule[]
    addEmptyRow: () => void
} | {}
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

type MealDay = {
    day: Day
    mealColumnMap: Map<MealTime, MealTileData[]>
}

const MealDays: MealDay[] = [
    {
        day: Day.Sunday,
        mealColumnMap: new Map<MealTime, MealTileData[]>([
            [MealTime.Breakfast, [{ type: TileType.EMPTY }]],
        ]),
    },
]

type MealToSchedule = {
    title: string
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

const MEALS_TO_PREPARE = [MealTime.Lunch, MealTime.Dinner]
const MealScheduleContext = createContext<MealScheduleContext>({})

export function MealScheduleProvider({ children }: MealScheduleProviderProps) {
    const [scheduledMeals, setScheduledMeals] = useImmer(initializeWeek())
    const [mealsToSchedule, setMealsToSchedule] = useImmer<MealToSchedule[]>([])

    function initializeWeek(): MealDay[] {
        return Object.values(Day).map((dayOfWeek) => {
            const mealDay: MealDay = {
                day: dayOfWeek,
                mealColumnMap: new Map<MealTime, MealTileData[]>(
                    MEALS_TO_PREPARE.map((mealTime) => {
                        return [mealTime, []]
                    })
                ),
            }
            return mealDay
        })
    }

    const addEmptyRow = useCallback(() => {
        setScheduledMeals((oldScheduleState) => {
            oldScheduleState.forEach((mealDay) => {
                Array.from(mealDay.mealColumnMap.keys()).forEach((mealTimeKey) => {
                    const setOfMeals = mealDay.mealColumnMap.get(
                        mealTimeKey as MealTime
                    )
                    setOfMeals?.push({ type: TileType.EMPTY })
                })
            })
        })
    }, [])

    function addMealToDay(
        day: Day,
        mealTime: MealTime,
        mealIndex: number,
        mealData: { title: string; color: TileColor }
    ) {}

    function removeMealFromDay() {}

    const value = {
        scheduledMeals,
        mealsToSchedule,
        addEmptyRow,
    }

    return (
        <MealScheduleContext.Provider value={value}>
            {children}
        </MealScheduleContext.Provider>
    )
}

export function useMealSchedule() {
    const context = useContext(MealScheduleContext)
    if(!('scheduledMeals' in context)){
        throw new Error('Context lacks state and functions')
    }
    return context
}
