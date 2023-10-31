import dynamic from 'next/dynamic';
import { useController, Control } from 'react-hook-form';
import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

export type InputDescriptionProps = {
    name: string;
    control: Control<any>;
};

export function InputDescription({ name, control }: InputDescriptionProps) {
    const {
        field: { onChange, value }
    } = useController({
        name,
        control
    });

    return <ReactQuill className="h-[100px] mt-2" theme="snow" value={value} onChange={onChange} />;
}
