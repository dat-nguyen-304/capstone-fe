'use client';

import React, { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Checkbox, Select, SelectItem, Selection } from '@nextui-org/react';
import Image from 'next/image';
import { RiImageAddLine, RiImageEditLine } from 'react-icons/ri';
import { useQuery } from '@tanstack/react-query';
import { subjectApi } from '@/api-client';
import { Subject } from '@/types';
import { InputText } from '@/components/form-input';
import { InputDescription } from '@/components/form-input/InputDescription';
import Loader from '@/components/Loader';
import { InputNumber } from '@/components/form-input/InputNumber';
import { useDropzone, FileWithPath, DropzoneRootProps } from 'react-dropzone';
import CourseCard from '@/components/course/CourseCard';

const MyCourse: React.FC = () => {
    const { data, isLoading } = useQuery({
        queryKey: ['subjects'],
        queryFn: subjectApi.getAll
    });
    const [values, setValues] = useState<Selection>(new Set(['1']));
    const { control, handleSubmit, setError } = useForm({
        defaultValues: {
            name: '',
            course: '',
            description: ''
        }
    });
    const [uploadedFiles, setUploadedFiles] = useState<FileWithPath[]>([]);

    const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
        setUploadedFiles(acceptedFiles);
    }, []);

    const { getRootProps, getInputProps, fileRejections }: DropzoneRootProps = useDropzone({
        onDrop,
        accept: {
            'image/png': ['.png', '.jpg', '.jpeg']
        },
        maxFiles: 1,
        multiple: false
    });

    if (!data) return <Loader />;

    return (
        <div className="w-[98%] lg:w-[90%] mx-auto">
            <h3 className="text-xl text-blue-500 font-semibold mb-8">Khóa học của tôi</h3>
            <div className="mb-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                <CourseCard isTeacherCourse={true} />
                <CourseCard isTeacherCourse={true} />
                <CourseCard isTeacherCourse={true} />
                <CourseCard isTeacherCourse={true} />
                <CourseCard isTeacherCourse={true} />
                <CourseCard isTeacherCourse={true} />
                <CourseCard isTeacherCourse={true} />
            </div>
        </div>
    );
};

export default MyCourse;
