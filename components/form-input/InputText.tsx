import { Form, FormItemProps, Input } from 'antd';
import { useController, Control, FieldValue } from 'react-hook-form';

export type InputTextProps = FormItemProps & {
    name: string;
    control: Control<any>;
};

export function InputText({ name, label, control }: InputTextProps) {
    const {
        field: { onChange, onBlur, value, ref },
        fieldState: { error }
    } = useController({
        name,
        control
    });

    return (
        <Form.Item label={label} validateStatus={error ? 'error' : ''} help={error?.message}>
            <Input name={name} onChange={onChange} onBlur={onBlur} value={value} ref={ref} />
        </Form.Item>
    );
}
