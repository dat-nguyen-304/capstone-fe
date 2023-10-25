'use client';

import { InputText } from '@/components/form-input';
import React, { useState } from 'react';
import { BiUpArrowAlt } from 'react-icons/bi';
import { useForm } from 'react-hook-form';
import { Button, Checkbox, Select, SelectItem } from '@nextui-org/react';
import { InputDescription } from '@/components/form-input/InputDescription';

const UploadVideo: React.FC = () => {
    const { control, handleSubmit, setError } = useForm({
        defaultValues: {
            name: '',
            course: '',
            description: ''
        }
    });
    return (
        <div>
            <h3 className="font-semibold text-lg mb-4">Đăng tải video mới</h3>
            <div className="grid grid-cols-6 gap-2">
                <div className="col-span-1">
                    <label
                        htmlFor="upload-video"
                        className="w-full h-[120px] border-1 border-gray-400 border-dashed flex flex-col justify-center items-center cursor-pointer"
                    >
                        <BiUpArrowAlt size={24} />
                        <span className="text-sm">Tải lên video</span>
                    </label>
                    <input type="file" className="hidden" id="upload-video" />
                </div>
                <div className="col-span-1">
                    <label
                        htmlFor="upload-video"
                        className="w-full h-[120px] border-1 border-gray-400 border-dashed flex flex-col justify-center items-center cursor-pointer"
                    >
                        <BiUpArrowAlt size={24} />
                        <span className="text-sm">Tải lên ảnh thu nhỏ</span>
                    </label>
                    <input type="file" className="hidden" id="upload-video" />
                </div>
            </div>
            <div className="grid grid-cols-3 gap-2 flex items-center">
                <div className="col-span-1">
                    <InputText variant="bordered" name="name" size="sm" label="Tên Video" control={control} />
                </div>
                <div className="col-span-1">
                    <Select size="sm" label="Khóa học" color="primary" variant="bordered" defaultSelectedKeys={['0']}>
                        <SelectItem key={0} value={0}>
                            Mặc định
                        </SelectItem>
                        <SelectItem key={1} value={1}>
                            Đánh giá cao nhất
                        </SelectItem>
                        <SelectItem key={2} value={2}>
                            Giá mua cao nhất
                        </SelectItem>
                        <SelectItem key={3} value={3}>
                            Giá mua thấp nhất
                        </SelectItem>
                        <SelectItem key={4} value={4}>
                            Nhiều đánh giá nhất
                        </SelectItem>
                    </Select>
                </div>
                <div className="col-span-1">
                    <Select size="sm" label="Thêm vào" color="primary" variant="bordered" defaultSelectedKeys={['0']}>
                        <SelectItem key={0} value={0}>
                            Cuối danh sách
                        </SelectItem>
                        <SelectItem key={1} value={1}>
                            Đầu danh sách
                        </SelectItem>
                    </Select>
                </div>
            </div>
            <div>
                <InputDescription name="description" control={control} />
            </div>
            <div className="flex items-start my-8">
                <div className="flex items-center h-5">
                    <Checkbox />
                </div>
                <label htmlFor="remember" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                    Tôi đồng ý{' '}
                    <a href="#" className="text-blue-600 hover:underline dark:text-blue-500">
                        với chính sách và điều khoản của CEPA
                    </a>
                    .
                </label>
            </div>
            <Button color="primary">Xác nhận video mới</Button>
        </div>
    );
};

export default UploadVideo;
