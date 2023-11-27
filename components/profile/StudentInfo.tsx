'use client';

import Image from 'next/image';
import dynamic from 'next/dynamic';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import { Button, Card, Input, Select, useDisclosure } from '@nextui-org/react';
import Loader from '../Loader';

interface StudentInfoProps {
    studentData: any;
}

const StudentInfo: React.FC<StudentInfoProps> = ({ studentData }) => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    if (!studentData) return <Loader />;

    return (
        <Card className="text-sm p-4 sm:p-8">
            <h4 className="text-lg sm:text-xl text-blue-500 font-semibold mb-8">Thông tin cá nhân</h4>
            {/* {!combinationsData ? (
                <div className="h-[20vh] flex flex-col justify-center items-center">
                    <PuffLoader size={100} color="blue" />
                </div>
            ) : ( */}
            <div>
                <div className="xl:flex items-center mt-4">
                    <p className="w-[160px] font-semibold">Họ và tên</p>
                    <Input
                        name="Họ và tên"
                        variant="underlined"
                        size="sm"
                        className="max-w-xs"
                        color="primary"
                        value={studentData.fullName}
                    />
                </div>
                {/* <div className="xl:flex items-center mt-8 xl:mt-4">
                    <p className="w-[160px] font-semibold">Tổ hợp môn</p>

                    <Select
                        color="primary"
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
                </div>*/}
                <div className="xl:flex items-center mt-12 xl:mt-8">
                    <p className="w-[160px] mb-4 xl:mb-0 font-semibold">Giới thiệu</p>
                    <ReactQuill
                        theme="snow"
                        className="flex-[1]"
                        placeholder="Giới thiệu về bạn một chút đi nào"
                        value={studentData?.description}
                    />
                </div>
            </div>
            {/* )} */}
            <div className="flex flex-row-reverse mt-8">
                <Button color="primary">Lưu thay đổi</Button>
            </div>
        </Card>
    );
};

export default StudentInfo;
