import { Controller, Control } from 'react-hook-form'
import { TileColor } from './tile'
import SelectableColor from './SelectableColor'
import { CreateMealFormProps } from './sidebar'

type ColorSelectProps = {
    control: Control<CreateMealFormProps, any>
}
export default function ColorSelect({ control }: ColorSelectProps) {
    return (
        <Controller
            name="color"
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => {
                const colors = Array.from(Object.values(TileColor))
                return (
                    <div className="flex gap-2">
                        {colors.map((color) => (
                            <SelectableColor
                                selected={value === color}
                                color={color}
                                onChange={onChange}
                            />
                        ))}
                    </div>
                )
            }}
        />
    )
}
