import { UserCircleIcon, XMarkIcon } from "@heroicons/react/24/outline"

export type ProfileTile = {
    name: string
    onClick: () => void
}



export default function ProfileTile({
    name,
    onClick
}: ProfileTile) {
    return (
        <div
            className={`w-full flex select-none items-center justify-between rounded-md p-2 bg-brown-50 `}
        >
            <div className="flex gap-2 items-center">
                <UserCircleIcon className="h-6 w-6 text-brown-900" />
                <div className="text-brown-900 text-base">
                    {name}
                </div>
            </div>
            <XMarkIcon className="h-6 w-6 text-brown-900 cursor-pointer" onClick={onClick}/>
        </div>
    )
}
