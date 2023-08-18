import { Form, FormItemProps, Input } from 'antd';
import { useController, Control } from 'react-hook-form';

export type InputPasswordProps = FormItemProps & {
    name: string;
    control: Control<any>;
};

export function InputPassword({ name, label, control }: InputPasswordProps) {
    const {
        field: { onChange, onBlur, value, ref },
        fieldState: { error }
    } = useController({
        name,
        control
    });

    return (
        <Form.Item label={label} validateStatus={error ? 'error' : ''} help={error?.message}>
            <Input.Password name={name} onChange={onChange} onBlur={onBlur} value={value} ref={ref} />
        </Form.Item>
    );
}
