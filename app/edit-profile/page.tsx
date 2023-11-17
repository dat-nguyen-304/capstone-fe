'use client';

import { Button, Input, Select, SelectItem, Selection, SelectedItems, Card, Tabs, Tab } from '@nextui-org/react';
import Image from 'next/image';
import { useCallback, useState } from 'react';
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
import { InputText } from '@/components/form-input';
import { useForm } from 'react-hook-form';
import { DropzoneRootProps, FileWithPath, useDropzone } from 'react-dropzone';
import NotFound from '../not-found';
interface StudentProfileProps {}

const StudentProfile: React.FC<StudentProfileProps> = ({}) => {
    const { user } = useUser();
    const { data: combinationsData, isLoading } = useQuery({
        queryKey: ['combinations'],
        queryFn: combinationApi.getAll,
        staleTime: Infinity
    });

    const [values, setValues] = useState<Selection>(new Set(['1']));
    const { data: studentData } = useQuery({
        queryKey: ['profile'],
        queryFn: () => studentApi.getStudent(user?.email as string)
    });

    const {
        control,
        handleSubmit,
        formState: { isSubmitting }
    } = useForm({
        defaultValues: {
            username: '',
            password: ''
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

    if (user?.role !== 'STUDENT') return <NotFound />;

    return (
        <Card className="w-[94%] xl:w-[90%] 3xl:w-[80%] mx-auto md:grid grid-cols-9 gap-8 my-8 p-2 sm:p-8">
            <h4 className="md:hidden text-xl text-blue-500 font-semibold mb-8">Ảnh đại diện</h4>
            <div className="col-span-4 xl:col-span-3 rounded-xl">
                <div className="w-[200px] lg:w-[300px] h-[200px] lg:h-[300px] mx-auto relative object-contain">
                    <div className="group relative object-contain ">
                        <Image
                            src={uploadedFiles.length > 0 ? URL.createObjectURL(uploadedFiles[0]) : '/student.png'}
                            width={300}
                            height={300}
                            alt=""
                            className="border-1 rounded-lg w-[200px] lg:w-[300px] h-[200px] lg:h-[300px] object-cover"
                        />
                    </div>

                    <div {...getRootProps()}>
                        <div className="absolute right-2 top-2 shadow-lg rounded-full border-2 border-blue-700 bg-blue-300 cursor-pointer w-[40px] h-[40px] flex items-center justify-center">
                            <div {...getInputProps()}></div>
                            <BiSolidPencil size={20} className="text-blue-500" />
                        </div>
                    </div>
                    <div className="hidden md:block">
                        <h3 className="text-blue-500 text-2xl font-semibold mt-8">{studentData?.data?.fullName}</h3>
                        <p className="mt-4 text-sm">Ngày tham gia: 21/10/2023</p>
                        <p className="mt-4 text-sm">Tổ hợp môn: A00 - B00</p>
                    </div>
                </div>
            </div>
            <div className="col-span-5 xl:col-span-6 mt-8 md:mt-0">
                <Card className="text-sm p-4 sm:p-8">
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
                        </div>
                    )}
                </Card>
                <Card className="text-sm p-4 sm:p-8 mt-8">
                    <h4 className="text-xl text-blue-500 font-semibold mb-8">Mục tiêu</h4>
                    <Tabs color="primary" variant="underlined" aria-label="Tabs variants">
                        <Tab key="a00" title="A00 (Chưa cập nhật)">
                            <InputText name="math" control={control} label="Toán học" className="my-4" />
                            <InputText name="math" control={control} label="Toán học" className="my-4" />
                            <InputText name="math" control={control} label="Toán học" className="my-4" />
                        </Tab>
                        <Tab key="a01" title="A01 (24.5)">
                            <InputText name="math" control={control} label="Toán học" className="my-4" />
                            <InputText name="math" control={control} label="Toán học" className="my-4" />
                            <InputText name="math" control={control} label="Toán học" className="my-4" />
                        </Tab>
                    </Tabs>
                </Card>
                <div className="flex flex-row-reverse mt-8">
                    <Button color="primary">Lưu thay đổi</Button>
                </div>
            </div>
        </Card>
    );
};

export default StudentProfile;
