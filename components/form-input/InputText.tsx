import { useController, Control, FieldValue } from 'react-hook-form';
import { Input, InputProps } from '@nextui-org/react';

export type InputTextProps = InputProps & {
    name: string;
    control: Control<any>;
};

export function InputText({ name, label, control, size }: InputTextProps) {
    const {
        field: { onChange, onBlur, value, ref },
        fieldState: { error }
    } = useController({
        name,
        control
    });

    return (
        <Input
            size={size}
            label={label}
            isInvalid={error ? true : false}
            errorMessage={error?.message}
            name={name}
            onChange={onChange}
            onBlur={onBlur}
            value={value}
            ref={ref}
            className="my-4"
        />
    );
}
