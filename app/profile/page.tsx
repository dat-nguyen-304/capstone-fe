'use client';

import { Button, Input, Select, SelectItem, Selection, SelectedItems } from '@nextui-org/react';
import Image from 'next/image';
import { useState } from 'react';
import { BiSolidPencil } from 'react-icons/bi';
import { useQuery } from '@tanstack/react-query';
import { combinationApi } from '@/api-client';
import { Combination } from '@/types';
import dynamic from 'next/dynamic';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';
import { PuffLoader } from 'react-spinners';
import { studentApi } from '@/api-client';
import { useUser } from '@/hooks';
interface StudentProfileProps {}

const StudentProfile: React.FC<StudentProfileProps> = ({}) => {
    const { user } = useUser();
    const { data: combinationsData, isLoading } = useQuery({
        queryKey: ['combinations'],
        queryFn: combinationApi.getAll
    });
    const [values, setValues] = useState<Selection>(new Set(['1']));
    const { data: studentData } = useQuery({
        queryKey: ['profile'],
        queryFn: () => studentApi.getStudent(user?.email as string)
    });

    return (
        <div className="w-[90%] xl:w-[80%] 2xl:w-[70%] mx-auto md:grid grid-cols-9 gap-8 my-8">
            <h4 className="md:hidden text-xl text-blue-500 font-semibold mb-8">Ảnh đại diện</h4>
            <div className="col-span-4 xl:col-span-3 py-8 px-4 border-1 rounded-xl">
                <div className="w-full max-w-[200px] lg:max-w-[300px] mx-auto relative">
                    <Image src="/student.png" width={300} height={300} alt="" className="border-1 rounded-lg" />
                    <div className="absolute right-2 top-2 shadow-lg rounded-full border-2 cursor-pointer w-[40px] h-[40px] flex items-center justify-center">
                        <BiSolidPencil size={20} />
                    </div>
                    <div className="hidden md:block">
                        <h3 className="text-blue-500 text-2xl font-semibold mt-8">{studentData?.data?.fullName}</h3>
                        <p className="mt-4 text-sm">Ngày tạo: 21/10/2023</p>
                        <p className="mt-4 text-sm">Tổ hợp môn: A00 - B00</p>
                    </div>
                </div>
            </div>
            <div className="col-span-5 xl:col-span-6 mt-8 md:mt-0 relative text-sm">
                <h4 className="text-xl text-blue-500 font-semibold mb-8">Thông tin cá nhân</h4>

                {!combinationsData ? (
                    <div className="h-[20vh] flex flex-col justify-center items-center">
                        <PuffLoader size={100} color="red" />
                    </div>
                ) : (
                    <div>
                        <div className="xl:flex items-center mt-4">
                            <p className="w-[160px] font-semibold">Họ và tên</p>
                            <Input
                                name="Họ và tên"
                                variant="underlined"
                                size="sm"
                                className="max-w-xs"
                                value={studentData?.data?.fullName}
                            />
                        </div>
                        <div className="xl:flex items-center mt-8 xl:mt-4">
                            <p className="w-[160px] font-semibold">Tổ hợp môn</p>

                            <Select
                                items={combinationsData}
                                disallowEmptySelection
                                selectionMode="multiple"
                                className="max-w-xs"
                                selectedKeys={values}
                                onSelectionChange={setValues}
                                variant="underlined"
                                size="sm"
                                renderValue={(combinations: SelectedItems<Combination>) => {
                                    return (
                                        <div className="flex gap-2">
                                            {combinations.map(combination => (
                                                <span className="mr-1 text-sm" key={combination.key}>
                                                    {combination.data?.name}
                                                </span>
                                            ))}
                                        </div>
                                    );
                                }}
                            >
                                {combination => (
                                    <SelectItem key={combination.id} value={combination.id}>
                                        {combination.name} - {combination.description}
                                    </SelectItem>
                                )}
                            </Select>
                        </div>
                        <div className="xl:flex items-center mt-12 xl:mt-8">
                            <p className="w-[160px] mb-4 xl:mb-0 font-semibold">Giới thiệu</p>
                            <ReactQuill
                                theme="snow"
                                className="flex-[1]"
                                placeholder="Giới thiệu về bạn một chút đi nào"
                            />
                        </div>
                        <div className="md:absolute bottom-0 right-0 flex flex-row-reverse mt-8">
                            <Button color="primary">Lưu thay đổi</Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentProfile;
