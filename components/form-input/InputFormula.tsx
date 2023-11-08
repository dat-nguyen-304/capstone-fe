'use client';

import dynamic from 'next/dynamic';
import { useController, Control } from 'react-hook-form';
import 'react-quill/dist/quill.snow.css';
import 'katex/dist/katex.min.css';
import katex from 'katex';
import { useEffect } from 'react';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

export type InputFormulaProps = {
    name: string;
    placeholder?: string;
    control: Control<any>;
};

export function InputFormula({ name, control, placeholder }: InputFormulaProps) {
    const {
        field: { onChange, value }
    } = useController({
        name,
        control
    });

    useEffect(() => {
        window.katex = katex;
    }, []);

    const toolbarOptions = [['bold', 'italic'], [{ script: 'sub' }, { script: 'super' }], [{ formula: 'katex' }]];

    const _module = {
        toolbar: toolbarOptions
    };

    return (
        <>
            <ReactQuill
                modules={_module}
                className="h-[100px] mt-2"
                theme="snow"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
            />
        </>
    );
}
