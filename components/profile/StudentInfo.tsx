'use client';
import { Button, Card } from '@nextui-org/react';
import Loader from '../Loader';
import { userApi } from '@/api-client';
import { useForm } from 'react-hook-form';
import { InputText } from '../form-input';
import { InputDescription } from '../form-input/InputDescription';
import { useState } from 'react';
import { toast } from 'react-toastify';

interface StudentInfoProps {
    studentData: any;
    refetch: any;
    getUploadFile?: any;
}

const StudentInfo: React.FC<StudentInfoProps> = ({ studentData, refetch, getUploadFile }) => {
    const { control, handleSubmit, setError } = useForm({
        defaultValues: {
            fullName: studentData.fullName,
            desciption: studentData.description
        }
    });
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const onSubmit = async (values: any) => {
        const loading = toast.loading('Đang cập nhật');
        setIsSubmitting(true);
        try {
            const formDataPayload = new FormData();

            if (getUploadFile !== undefined) {
                formDataPayload.append('avatar', getUploadFile[0]);
            }
            formDataPayload.append('editUserRequest', new Blob([JSON.stringify(values)], { type: 'application/json' }));
            const res = await userApi.edit(formDataPayload);
            toast.dismiss(loading);
            toast.success('Cập nhật thành công');
            refetch();
            setIsSubmitting(false);
        } catch (error) {
            console.log({ error });
            toast.dismiss(loading);
            toast.error('Đã có lỗi xảy ra, vui lòng thử lại sau');
            setIsSubmitting(false);
        }
    };

    if (!studentData) return <Loader />;

    return (
        <Card className="text-sm p-4 sm:p-8">
            <h4 className="text-lg sm:text-xl text-blue-500 font-semibold mb-8">Thông tin cá nhân</h4>
            <form encType="multipart/form-data" onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <div className="xl:flex items-center mt-4">
                        <p className="w-[160px] font-semibold">Họ và tên</p>
                        <InputText
                            name="fullName"
                            variant="underlined"
                            size="sm"
                            className="max-w-xs"
                            color="primary"
                            control={control}
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
                        <div className="flex-[1]">
                            <InputDescription
                                placeholder="Giới thiệu về bạn một chút đi nào"
                                control={control}
                                name="desciption"
                            />
                        </div>
                    </div>
                </div>
                {/* )} */}
                <div className="flex flex-row-reverse mt-16">
                    <Button color="primary" type="submit" isLoading={isSubmitting}>
                        Lưu thay đổi
                    </Button>
                </div>
            </form>
        </Card>
    );
};

export default StudentInfo;
