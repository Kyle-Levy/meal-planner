import { UserCircleIcon, XMarkIcon } from '@heroicons/react/24/outline'

type ProfileTileProps = {
    name: string
    onClick: () => void
}

export default function ProfileTile({ name, onClick }: ProfileTileProps) {
    return (
        <div
            className={`flex w-full select-none items-center justify-between rounded-md bg-brown-50 p-2 `}
        >
            <div className="flex items-center gap-2">
                <UserCircleIcon className="h-6 w-6 text-brown-900" />
                <div className="text-base text-brown-900">{name}</div>
            </div>
            <XMarkIcon
                className="h-6 w-6 cursor-pointer text-brown-900"
                onClick={onClick}
            />
        </div>
    )
}
