import {
    ClockIcon,
    PlusIcon,
    RectangleStackIcon,
    UserGroupIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline'
import { useForm } from 'react-hook-form'
import ColorSelect from './ColorSelect'
import ProfileTile from './ProfileTile'
import { useMealSchedule } from './context/MealSchedule'
import { CustomDragLayer } from './custom-drag-layer'
import DraggableSidebarTile from './draggable-sidebar-tile'
import { TileColor } from './tile'

export enum SidebarState {
    MEALS = 'MEALS',
    CREATE_MEAL = 'CREATE_MEAL',
    PROFILES = 'PROFILES',
    CREATE_PROFILE = 'CREATE_PROFILE',
    CLOSED = 'CLOSED',
}

type SidebarProps = {
    sidebarState: SidebarState
    setSidebarState: (state: SidebarState) => void
}

export default function Sidebar({
    sidebarState,
    setSidebarState,
}: SidebarProps) {
    return (
        <div className="fixed flex h-screen">
            <div className="flex w-16 flex-col items-center gap-8  bg-white pt-4">
                <div
                    className="flex cursor-pointer items-center justify-center rounded-md p-1 hover:bg-brown-50"
                    onClick={() => {
                        if (sidebarState === SidebarState.PROFILES) {
                            setSidebarState(SidebarState.CLOSED)
                        } else {
                            setSidebarState(SidebarState.PROFILES)
                        }
                    }}
                >
                    <UserGroupIcon className="h-8 w-8 text-brown-900" />
                </div>
                <div
                    className="flex cursor-pointer items-center justify-center rounded-md p-1 hover:bg-brown-50"
                    onClick={() => {
                        if (sidebarState === SidebarState.MEALS) {
                            setSidebarState(SidebarState.CLOSED)
                        } else {
                            setSidebarState(SidebarState.MEALS)
                        }
                    }}
                >
                    <RectangleStackIcon className="h-8 w-8   text-brown-900" />
                </div>
                <div className="flex cursor-not-allowed items-center justify-center rounded-md p-1 hover:bg-brown-50">
                    <ClockIcon className="h-8 w-8   text-brown-900" />
                </div>
            </div>

            {sidebarState !== SidebarState.CLOSED && (
                <div className="flex w-96 flex-col gap-2 border-l border-gray-300 bg-white p-4">
                    {sidebarState === SidebarState.MEALS && (
                        <MealsContent setSidebarView={setSidebarState} />
                    )}
                    {sidebarState === SidebarState.CREATE_MEAL && (
                        <CreateMealContent setSidebarView={setSidebarState} />
                    )}
                    {sidebarState === SidebarState.PROFILES && (
                        <ProfilesContent setSidebarView={setSidebarState} />
                    )}
                    {sidebarState === SidebarState.CREATE_PROFILE && (
                        <CreateProfileContent
                            setSidebarView={setSidebarState}
                        />
                    )}
                </div>
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
            <div className="flex items-center justify-between text-xl text-brown-900">
                <span>Meals</span>
                <PlusIcon
                    className="h-6 w-6 cursor-pointer text-brown-900"
                    onClick={() => setSidebarView(SidebarState.CREATE_MEAL)}
                />
            </div>

            {mealScheduler.unscheduledMeals.map((mealToSchedule) => {
                return (
                    <div className="flex w-full items-center gap-2">
                        <DraggableSidebarTile
                            {...mealToSchedule}
                            key={mealToSchedule.id}
                        />
                        <XMarkIcon
                            className="h-6 w-6 cursor-pointer text-gray-400"
                            onClick={() => {
                                mealScheduler.removeUnscheduledMeal(
                                    mealToSchedule.id
                                )
                            }}
                        />
                    </div>
                )
            })}
            <CustomDragLayer />
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
                <label className="text-lg text-brown-900">Meal</label>
                <input
                    className="rounded-md border border-solid border-gray-300 p-2 text-brown-900 outline-none"
                    {...register('title', { required: true })}
                />
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-lg text-brown-900">Servings</label>
                <input
                    className="w-16 rounded-md border border-solid border-gray-300 p-2 text-brown-900 outline-none"
                    type="number"
                    {...register('servings', { required: true })}
                />
            </div>
            <div className="flex flex-col gap-2">
                <label className="text-lg text-brown-900">Color</label>
                <ColorSelect control={control} />
            </div>

            <button
                className="mt-auto flex items-center justify-center rounded-md bg-red-900 py-1 text-lg text-brown-50"
                onClick={handleSubmit((data) => {
                    mealScheduler.createMeal(
                        data.title,
                        data.servings,
                        data.color
                    )
                    setSidebarView(SidebarState.MEALS)
                })}
            >
                Create Meal
            </button>
        </>
    )
}

function ProfilesContent({ setSidebarView }: SidebarContent) {
    const mealScheduler = useMealSchedule()
    return (
        <>
            <div className="flex items-center justify-between text-xl text-brown-900">
                <span>Profiles</span>
                <PlusIcon
                    className="h-6 w-6 cursor-pointer text-brown-900"
                    onClick={() => setSidebarView(SidebarState.CREATE_PROFILE)}
                />
            </div>
            {mealScheduler.profiles.map((profile) => (
                <ProfileTile
                    name={profile.name}
                    key={profile.id}
                    onClick={() => mealScheduler.removeProfile(profile.id)}
                />
            ))}
        </>
    )
}

type CreateProfileProps = {
    name: string
}
function CreateProfileContent({ setSidebarView }: SidebarContent) {
    const { handleSubmit, register } = useForm<CreateProfileProps>()
    const mealScheduler = useMealSchedule()

    return (
        <>
            <div className="flex items-center text-xl text-brown-900">
                <span>New Profile</span>
            </div>
            <div className="flex flex-col gap-2">
                <label className="text-lg text-brown-900">Name</label>
                <input
                    className="rounded-md border border-solid border-gray-300 p-2 text-brown-900 outline-none"
                    {...register('name', { required: true })}
                />
            </div>

            <button
                className="mt-auto flex items-center justify-center rounded-md bg-red-900 py-1 text-lg text-brown-50"
                onClick={handleSubmit((data) => {
                    mealScheduler.addProfile(data.name)
                    setSidebarView(SidebarState.PROFILES)
                })}
            >
                Add Profile
            </button>
        </>
    )
}
