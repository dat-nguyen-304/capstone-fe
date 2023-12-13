'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { BiSolidPencil } from 'react-icons/bi';
import { useForm } from 'react-hook-form';
import { Button, Chip, Input, Select, SelectItem, SelectedItems, Selection } from '@nextui-org/react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';
import { PuffLoader } from 'react-spinners';
import { useQuery } from '@tanstack/react-query';
import { subjectApi, teacherApi, userApi } from '@/api-client';
import { Subject } from '@/types';
import Loader from '@/components/Loader';
import { toast } from 'react-toastify';
import { InputDescription } from '@/components/form-input/InputDescription';
import { InputText } from '@/components/form-input';
import { DropzoneRootProps, FileWithPath, useDropzone } from 'react-dropzone';
import { useSelectedSidebar } from '@/hooks';

const Profile: React.FC = () => {
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

    const { data, isLoading } = useQuery({
        queryKey: ['subjects'],
        queryFn: subjectApi.getAll,
        staleTime: Infinity
    });

    const { data: teacherData, refetch } = useQuery({
        queryKey: ['teacher-detail'],
        queryFn: () => teacherApi.getTeacherDetail()
    });

    const [values, setValues] = useState<Selection>(new Set(['1']));
    const [teacherDescription, setTeacherDescription] = useState<string>('');
    const { control, handleSubmit, setError, setValue } = useForm({
        defaultValues: {
            fullName: '',
            course: '',
            desciption: ''
        }
    });
    const { onTeacherKeys } = useSelectedSidebar();

    useEffect(() => {
        onTeacherKeys(['2']);
    }, []);

    useEffect(() => {
        if (teacherData) {
            setValue('fullName', teacherData?.fullName);
            setValue('desciption', teacherData?.description);
        }
    }, [teacherData]);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const onSubmit = async (values: any) => {
        const loading = toast.loading('Đang cập nhật');
        setIsSubmitting(true);
        try {
            const formDataPayload = new FormData();
            if (uploadedFiles !== undefined) {
                formDataPayload.append('avatar', uploadedFiles[0]);
            }
            formDataPayload.append('editUserRequest', new Blob([JSON.stringify(values)], { type: 'application/json' }));
            const res = await userApi.edit(formDataPayload);
            toast.dismiss(loading);
            toast.success('Cập nhật thành công');
            setIsSubmitting(false);
            refetch();
        } catch (error) {
            console.log({ error });
            toast.dismiss(loading);
            toast.error('Đã có lỗi xảy ra, vui lòng thử lại sau');
            setIsSubmitting(false);
        }
    };

    const defaultSubjectIds: number[] =
        data?.filter(subject => teacherData?.subject?.includes(subject.name)).map(subject => subject.id) ?? [];
    const dateValue = teacherData?.createDate ? new Date(teacherData?.createDate) : new Date();

    const formattedDate = new Intl.DateTimeFormat('en-GB', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
    })?.format(dateValue);
    if (!teacherData) return <Loader />;
    return (
        <form encType="multipart/form-data" onSubmit={handleSubmit(onSubmit)}>
            <div className="w-[90%] mx-auto lg:grid grid-cols-9 gap-8 my-8">
                <h4 className="sm:hidden text-xl text-blue-500 font-semibold mb-8">Ảnh đại diện</h4>
                <div className="col-span-4 xl:col-span-3 py-8 px-4 border-1 rounded-xl">
                    <div className="w-full max-w-[200px] lg:max-w-[300px] mx-auto relative">
                        <Image
                            src={
                                uploadedFiles.length > 0
                                    ? URL.createObjectURL(uploadedFiles[0])
                                    : teacherData?.url
                                    ? teacherData?.url
                                    : '/student.png'
                            }
                            width={300}
                            height={300}
                            alt=""
                            className="border-1 rounded-lg"
                        />
                        <div {...getRootProps()}>
                            <div className="absolute right-2 top-2 shadow-lg rounded-full border-2 border-blue-700 bg-blue-300 cursor-pointer w-[40px] h-[40px] flex items-center justify-center">
                                <div {...getInputProps()}></div>
                                <BiSolidPencil size={20} className="text-blue-500" />
                            </div>
                        </div>
                        <div className="hidden lg:block">
                            <h3 className="text-blue-500 text-2xl font-semibold mt-8">
                                {teacherData?.fullName || 'Nguyễn Văn An'}
                            </h3>
                            <p className="mt-4 text-sm">Ngày tham gia: {formattedDate}</p>
                            <p className="mt-4 text-sm">
                                Giáo viên môn:{' '}
                                {teacherData?.subject?.map((subject: any, index: number) => (
                                    <li className="inline-block" key={index}>
                                        <Chip color="primary" variant="flat">
                                            {subject}
                                        </Chip>
                                    </li>
                                ))}
                            </p>
                            {/* <div className="xl:flex items-center mt-4">
                            <p className="w-[160px] font-semibold mb-2 sm:mb-0">Tổ hợp môn</p>
                            <ul className="flex flex-wrap gap-2">
                                {teacherData?.subject?.map((subject: any, index: number) => (
                                    <li className="inline-block" key={index}>
                                        <Chip color="primary" variant="flat">
                                            {subject}
                                        </Chip>
                                    </li>
                                ))}
                            </ul>
                        </div> */}
                        </div>
                    </div>
                </div>
                <div className="col-span-5 xl:col-span-6 mt-8 lg:mt-0 relative">
                    <h4 className="text-xl text-blue-500 font-semibold mb-8">Thông tin cá nhân</h4>
                    {!data ? (
                        <div className="h-[20vh] flex flex-col justify-center items-center">
                            <PuffLoader size={100} color="red" />
                        </div>
                    ) : (
                        <div>
                            <div className="2xl:flex items-center mt-4">
                                <p className="w-[160px] font-semibold">Họ và tên</p>
                                <InputText
                                    color="primary"
                                    variant="underlined"
                                    size="sm"
                                    className="max-w-xs"
                                    control={control}
                                    name="fullName"
                                    value={teacherData?.fullName}
                                />
                            </div>
                            <div className="2xl:flex items-center mt-8 2xl:mt-4">
                                <p className="w-[160px] font-semibold">Giáo viên môn</p>

                                <Select
                                    // items={data.filter(subject => teacherData?.subject?.includes(subject.name))}
                                    items={data}
                                    disallowEmptySelection
                                    selectionMode="multiple"
                                    className="max-w-xs"
                                    // selectedKeys={values}
                                    onSelectionChange={setValues}
                                    variant="underlined"
                                    size="sm"
                                    defaultSelectedKeys={defaultSubjectIds.map(id => `${id}`)}
                                    renderValue={(subjects: SelectedItems<Subject>) => (
                                        <div className="flex gap-2">
                                            {subjects.map(subject => (
                                                <span className="mr-1 text-sm" key={subject.key}>
                                                    {subject.data?.name}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                >
                                    {subject => (
                                        <SelectItem key={subject.id} value={subject.id}>
                                            <div className="flex items-center gap-2">
                                                <Image alt="" width={20} height={20} src={subject.url} />
                                                <div className="sm:font-semibold text-sm sm:text-md">
                                                    {subject.name}
                                                </div>
                                            </div>
                                        </SelectItem>
                                    )}
                                </Select>
                            </div>
                            <div className="2xl:flex items-center mt-12 2xl:mt-8">
                                <p className="w-[160px] mb-4 2xl:mb-0 font-semibold">Giới thiệu</p>
                                <div className="flex-[1]">
                                    <InputDescription
                                        placeholder="Giới thiệu về bạn một chút đi nào"
                                        control={control}
                                        name="desciption"
                                    />
                                </div>
                            </div>

                            {/* <div className="lg:absolute bottom-0 right-0 flex flex-row-reverse mt-8">
                                <Button color="warning" className="mx-3" type="submit">
                                    Xác nhận giáo viên
                                </Button>
                                <Button color="primary" type="submit">
                                    Lưu thay đổi
                                </Button>
                            </div> */}
                            <div className=" flex flex-row-reverse mt-16">
                                {/* <Button color="warning" className="mx-3" type="submit">
                                    Xác nhận giáo viên
                                </Button> */}
                                <Button color="primary" type="submit">
                                    Lưu thay đổi
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </form>
    );
};

export default Profile;
