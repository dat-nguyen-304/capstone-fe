import { useController, Control } from 'react-hook-form';
import { NumberFormatBase } from 'react-number-format';

export type InputNumberProps = {
    name: string;
    control: Control<any>;
    label: string;
};

export function InputNumber({ name, control, label }: InputNumberProps) {
    const {
        field: { onChange, onBlur, value },
        fieldState: { error }
    } = useController({
        name,
        control
    });

    const formatVnd = (numStr: string) => {
        if (numStr === '') return '';
        return new Intl.NumberFormat('vi-VI', {
            style: 'currency',
            currency: 'VND',
            maximumFractionDigits: 0
        }).format(numStr as any);
    };

    return (
        <div className="">
            <label className="mb-1 block font-semibold">{label}</label>
            <NumberFormatBase
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                format={formatVnd}
                name={name}
                value={value}
                onValueChange={values => {
                    const { value } = values;
                    onChange(value);
                }}
                onBlur={onBlur}
            />
        </div>
    );
}
