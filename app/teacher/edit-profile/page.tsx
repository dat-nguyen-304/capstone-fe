'use client';

import React, { useState } from 'react';
import { BiSolidPencil } from 'react-icons/bi';
import { useForm } from 'react-hook-form';
import { Button, Input, Select, SelectItem, SelectedItems, Selection } from '@nextui-org/react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';
import { PuffLoader } from 'react-spinners';
import { useQuery } from '@tanstack/react-query';
import { subjectApi } from '@/api-client';
import { Subject } from '@/types';

const Profile: React.FC = () => {
    const { data, isLoading } = useQuery({
        queryKey: ['subjects'],
        queryFn: subjectApi.getAll,
        staleTime: Infinity
    });
    const [values, setValues] = useState<Selection>(new Set(['1']));
    const { control, handleSubmit, setError } = useForm({
        defaultValues: {
            name: '',
            course: '',
            description: ''
        }
    });
    return (
        <div className="w-[90%] mx-auto lg:grid grid-cols-9 gap-8 my-8">
            <h4 className="sm:hidden text-xl text-blue-500 font-semibold mb-8">Ảnh đại diện</h4>
            <div className="col-span-4 xl:col-span-3 py-8 px-4 border-1 rounded-xl">
                <div className="w-full max-w-[200px] lg:max-w-[300px] mx-auto relative">
                    <Image src="/student.png" width={300} height={300} alt="" className="border-1 rounded-lg" />
                    <div className="absolute right-2 top-2 shadow-lg rounded-full border-2 cursor-pointer w-[40px] h-[40px] flex items-center justify-center">
                        <BiSolidPencil size={20} />
                    </div>
                    <div className="hidden lg:block">
                        <h3 className="text-blue-500 text-2xl font-semibold mt-8">Nguyễn Văn An</h3>
                        <p className="mt-4 text-sm">Ngày tham gia: 21/10/2023</p>
                        <p className="mt-4 text-sm">Giáo viên môn: Toán học - Vật lí</p>
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
                            <Input name="Họ và tên" variant="underlined" size="sm" className="max-w-xs" />
                        </div>
                        <div className="2xl:flex items-center mt-8 2xl:mt-4">
                            <p className="w-[160px] font-semibold">Giáo viên môn</p>

                            <Select
                                items={data}
                                disallowEmptySelection
                                selectionMode="multiple"
                                className="max-w-xs"
                                selectedKeys={values}
                                onSelectionChange={setValues}
                                variant="underlined"
                                size="sm"
                                renderValue={(subjects: SelectedItems<Subject>) => {
                                    return (
                                        <div className="flex gap-2">
                                            {subjects.map(subject => (
                                                <span className="mr-1 text-sm" key={subject.key}>
                                                    {subject.data?.name}
                                                </span>
                                            ))}
                                        </div>
                                    );
                                }}
                            >
                                {subject => (
                                    <SelectItem key={subject.id} value={subject.id}>
                                        <div className="flex items-center gap-2">
                                            <Image alt="" width={20} height={20} src={subject.url} />
                                            <div className="sm:font-semibold text-sm sm:text-md">{subject.name}</div>
                                        </div>
                                    </SelectItem>
                                )}
                            </Select>
                        </div>
                        <div className="2xl:flex items-center mt-12 2xl:mt-8">
                            <p className="w-[160px] mb-4 2xl:mb-0 font-semibold">Giới thiệu</p>
                            <ReactQuill
                                theme="snow"
                                className="flex-[1]"
                                placeholder="Giới thiệu về bạn một chút đi nào"
                            />
                        </div>
                        <div className="lg:absolute bottom-0 right-0 flex flex-row-reverse mt-8">
                            <Button color="primary">Lưu thay đổi</Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
