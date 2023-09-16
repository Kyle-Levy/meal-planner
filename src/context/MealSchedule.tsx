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
import { Draft } from 'immer'

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
              mealData: { id: string; title: string; color: TileColor }
          ) => void
          removeMealFromDay: (
              day: Day,
              mealTime: MealTime,
              mealIndex: number
          ) => void
          removeUnscheduledMeal: (idToRemove: string) => void
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

type SerializedScheduledDay = {
    day: Day
    mealSlotMap: { [id: string]: IndividualMeal[] }
}

export type UnscheduledMeal = {
    id: string
    title: string
    servings: number
    servingsLeft: number
    color: TileColor
}

//Used to give a created meal a random color
function getRandomInt(max: number) {
    return Math.floor(Math.random() * max)
}

const colors = Object.values(TileColor)

type MealScheduleState = {
    scheduledMeals: ScheduledDay[]
    unscheduledMeals: UnscheduledMeal[]
}

type SerializedMealScheduleState = {
    scheduledMeals: SerializedScheduledDay[]
    unscheduledMeals: UnscheduledMeal[]
}

const MEALS_TO_PREPARE = [MealTime.Lunch, MealTime.Dinner]
const MealScheduleContext = createContext<MealScheduleContext>({})

//Functions inside the provider are to be used exclusively internally.
//They must be passed a Draft version of the state which it can then modify/get the current state of the page from
//The functions _CAN NOT_ access the state directly or modify the state using the set provided by useImmer
export function MealScheduleProvider({ children }: MealScheduleProviderProps) {
    const data = window.localStorage.getItem('saved-data')
    let savedData: MealScheduleState | undefined
    if (data) {
        try {
            const savedState = JSON.parse(data) as SerializedMealScheduleState
            savedData = deserializeMealScheduleState(savedState)
        } catch (e) {
            console.log('Error parsing saved data')
        }
    }

    const startingState = savedData ?? {
        scheduledMeals: initializeWeek(),
        unscheduledMeals: [],
    }

    const [mealScheduler, setMealScheduler] =
        useImmer<MealScheduleState>(startingState)

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

    function canAllocateMeal(id: string, draft: MealScheduleState) {
        const meal = draft.unscheduledMeals.find(
            (storedMeal) => storedMeal.id === id
        )
        if (!meal) throw new Error(`Meal with id '${id}' does not exist`)

        return meal.servingsLeft > 0
    }

    function reconcileServingsLeft(draft: Draft<MealScheduleState>) {
        //Meal UUID to amount of servings used
        const amountUsedMap = getMealTiles(draft).reduce(
            (acc, curr) => {
                if (curr.type === TileType.FILLED) {
                    if (curr.id in acc) {
                        acc[curr.id]++
                    } else {
                        acc[curr.id] = 1
                    }
                }
                return acc
            },
            {} as { [key: string]: number }
        )

        draft.unscheduledMeals.forEach((unscheduledMeal) => {
            const amountUsed = amountUsedMap[unscheduledMeal.id] ?? 0
            unscheduledMeal.servingsLeft = unscheduledMeal.servings - amountUsed
        })
    }

    function getMealTiles(
        draft: Draft<MealScheduleState>
    ): Draft<IndividualMeal>[] {
        return draft.scheduledMeals.reduce((acc, curr) => {
            acc.push(...Array.from(curr.mealSlotMap.values()).flat())
            return acc
        }, [] as IndividualMeal[])
    }

    function deserializeMealScheduleState(
        serializedMealScheduleState: SerializedMealScheduleState
    ): MealScheduleState {
        const deserializedMealScheduleState =
            serializedMealScheduleState.scheduledMeals.map((scheduledDay) => {
                const mealSlotMap = new Map<MealTime, IndividualMeal[]>()

                for (let key in scheduledDay.mealSlotMap) {
                    mealSlotMap.set(
                        key as MealTime,
                        scheduledDay.mealSlotMap[key]
                    )
                }
                return { day: scheduledDay.day, mealSlotMap }
            })

        return {
            scheduledMeals: deserializedMealScheduleState,
            unscheduledMeals: serializedMealScheduleState.unscheduledMeals,
        }
    }

    function saveToStorage(draft: Draft<MealScheduleState>) {
        const serializedScheduledDays: SerializedScheduledDay[] =
            draft.scheduledMeals.map((scheduledDay) => {
                const mealSlotMap = Array.from(
                    scheduledDay.mealSlotMap.keys()
                ).reduce(
                    (acc, curr) => {
                        const mealArray = scheduledDay.mealSlotMap.get(
                            curr
                        ) as IndividualMeal[]
                        acc[curr] = mealArray
                        return acc
                    },
                    {} as SerializedScheduledDay['mealSlotMap']
                )
                return { day: scheduledDay.day, mealSlotMap }
            })

        const serializedMealScheduleState: SerializedMealScheduleState = {
            scheduledMeals: serializedScheduledDays,
            unscheduledMeals: draft.unscheduledMeals,
        }
        window.localStorage.setItem(
            'saved-data',
            JSON.stringify(serializedMealScheduleState)
        )
    }

    const addEmptyRow = useCallback(() => {
        setMealScheduler((oldScheduleState) => {
            oldScheduleState.scheduledMeals.forEach((mealDay) => {
                Array.from(mealDay.mealSlotMap.keys()).forEach(
                    (mealTimeKey) => {
                        const mealSet = mealDay.mealSlotMap.get(mealTimeKey)
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
            saveToStorage(oldScheduleState)
        })
    }, [])

    const addMealToDay = useCallback(
        (
            day: Day,
            mealTime: MealTime,
            mealIndex: number,
            mealData: { id: string; title: string; color: TileColor }
        ) => {
            setMealScheduler((draft) => {
                if (!canAllocateMeal(mealData.id, draft))
                    throw new Error(`Cannot allocate meal '${mealData.id}'`)

                const foundDay = draft.scheduledMeals.find(
                    (mealDay) => mealDay.day === day
                )
                if (!foundDay)
                    throw new Error(`Could not find meal with day ${day}`)

                const mealSetArr = foundDay.mealSlotMap.get(mealTime)
                if (!mealSetArr)
                    throw new Error(
                        `Could not find with day ${day} and time ${mealTime}`
                    )

                //Update IndividualMeal
                mealSetArr[mealIndex] = {
                    ...mealData,
                    type: TileType.FILLED,
                }
                //Then reconcile serving amounts
                reconcileServingsLeft(draft)
                saveToStorage(draft)
            })
        },
        []
    )

    const removeMealFromDay = useCallback(
        (day: Day, mealTime: MealTime, mealIndex: number) => {
            setMealScheduler((draft) => {
                const foundDay = draft.scheduledMeals.find(
                    (mealDay) => mealDay.day === day
                )
                if (!foundDay)
                    throw new Error(`Could not find meal with day ${day}`)

                const mealSetArr = foundDay.mealSlotMap.get(mealTime)
                if (!mealSetArr)
                    throw new Error(
                        `Could not find with day ${day} and time ${mealTime}`
                    )
                //Update IndividualMeal
                mealSetArr[mealIndex] = { type: TileType.EMPTY }
                //Then reconcile serving amounts
                reconcileServingsLeft(draft)
                saveToStorage(draft)
            })
        },
        []
    )

    const removeUnscheduledMeal = useCallback( (idToRemove: string) => {
        setMealScheduler((draft) => {
            //Remove from schedule
            draft.scheduledMeals.forEach(mealDay => {
                const iter = mealDay.mealSlotMap.values()
                let result = iter.next()
                while (!result.done){
                    const mealTiles = result.value
                    for(let i = 0; i < mealTiles.length; i++){
                        const currentTile = mealTiles[i]
                        if(currentTile.type === TileType.FILLED && currentTile.id === idToRemove){
                            mealTiles[i] = {type: TileType.EMPTY} //Removing if ID matches
                        }
                    }
                    result = iter.next()
                }

            })

            //Remove as meal option
            draft.unscheduledMeals = draft.unscheduledMeals.filter(meal => meal.id !== idToRemove)
            
            //Save new state
            saveToStorage(draft)
        })
    },[])

    const value: MealScheduleContext = {
        scheduledMeals: mealScheduler.scheduledMeals,
        unscheduledMeals: mealScheduler.unscheduledMeals,
        addEmptyRow,
        createMeal,
        addMealToDay,
        removeMealFromDay,
        removeUnscheduledMeal,
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
