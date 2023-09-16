import { useState } from 'react'
import DraggableSidebarTile from './draggable-sidebar-tile'
import { TileColor } from './tile'
import { Controller, useForm } from 'react-hook-form'
import { useMealSchedule } from './context/MealSchedule'
import { CustomDragLayer } from './custom-drag-layer'
import SelectableColor from './SelectableColor'
import ColorSelect from './ColorSelect'

enum SidebarState {
    MEALS = 'MEALS',
    CREATE_MEAL = 'CREATE_MEAL',
}
export default function Sidebar({}) {
    const [currentView, setCurrentView] = useState(SidebarState.MEALS)
    return (
        <div className="fixed flex h-screen w-96 flex-col gap-2 bg-white p-4">
            {currentView === SidebarState.MEALS && (
                <MealsContent setSidebarView={setCurrentView} />
            )}
            {currentView === SidebarState.CREATE_MEAL && (
                <CreateMealContent setSidebarView={setCurrentView} />
            )}
        </div>
    )
}

type SidebarContent = {
    setSidebarView: (newState: SidebarState) => void
}

function MealsContent({ setSidebarView }: SidebarContent) {
    const mealScheduler = useMealSchedule()

    return (
        <>
            <div className="flex items-center justify-center text-lg text-red-900">
                Meals
            </div>
            <div className="mx-8 border-t border-solid border-gray-300" />
            {mealScheduler.unscheduledMeals.map((mealToSchedule) => {
                return (
                    <div className="flex w-full items-center gap-2">
                        <DraggableSidebarTile
                            {...mealToSchedule}
                            key={mealToSchedule.id}
                        />
                        <span
                            className="cursor-pointer text-lg text-gray-300"
                            onClick={() => {
                                mealScheduler.removeUnscheduledMeal(
                                    mealToSchedule.id
                                )
                            }}
                        >
                            X
                        </span>
                    </div>
                )
            })}
            <CustomDragLayer />
            <button
                className="mt-auto flex items-center justify-center rounded-md bg-red-900 py-1 text-lg text-brown-50"
                onClick={() => {
                    setSidebarView(SidebarState.CREATE_MEAL)
                }}
            >
                Create Meal
            </button>
        </>
    )
}

export type CreateMealFormProps = {
    title: string
    servings: number
    color: TileColor
}

function CreateMealContent({ setSidebarView }: SidebarContent) {
    const { handleSubmit, register, control } = useForm<CreateMealFormProps>()
    const mealScheduler = useMealSchedule()

    return (
        <>
            <div className="flex flex-col gap-2">
                <label className="text-lg text-red-900">Meal</label>
                <input
                    className="rounded-md border border-solid border-gray-300 p-2 text-red-900 outline-none"
                    {...register('title', { required: true })}
                />
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-lg text-red-900">Servings</label>
                <input
                    className="w-16 rounded-md border border-solid border-gray-300 p-2 text-red-900 outline-none"
                    type="number"
                    {...register('servings', { required: true })}
                />
            </div>
            <div className="flex flex-col gap-2">
                <label className="text-lg text-red-900">Color</label>
                <ColorSelect control={control}/>
            </div>

            <button
                className="mt-auto flex items-center justify-center rounded-md bg-red-900 py-1 text-lg text-brown-50"
                onClick={handleSubmit((data) => {
                    mealScheduler.createMeal(data.title, data.servings, data.color)
                    setSidebarView(SidebarState.MEALS)
                })}
            >
                Create Meal
            </button>
        </>
    )
}
