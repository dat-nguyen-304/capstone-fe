'use client';

import PostComment from '@/components/discussion/PostComment';
import { InputFormula } from '@/components/form-input/InputFormula';
import CommentItem from '@/components/video/CommentItem';
import { Button, Card, Pagination, Select, SelectItem } from '@nextui-org/react';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useState } from 'react';
import { DropzoneRootProps, FileWithPath, useDropzone } from 'react-dropzone';
import { useForm } from 'react-hook-form';
import { BsArrowLeft } from 'react-icons/bs';
import { RiImageAddLine, RiImageEditLine } from 'react-icons/ri';

interface PostDetailProps {}

const PostDetail: React.FC<PostDetailProps> = ({}) => {
    const { control, handleSubmit, setError } = useForm({
        defaultValues: {
            title: '',
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
    return (
        <div className="w-[90%] sm:w-4/5 mx-auto my-8">
            <div className="flex justify-between items-center mt-2">
                <Link href="/discuss" className="flex items-center gap-2 text-sm">
                    <BsArrowLeft />
                    <span>Quay lại</span>
                </Link>
                <Button size="sm" color="danger">
                    Báo cáo vi phạm
                </Button>
            </div>
            <PostComment title="Bàn luận về abcxyz" />
            <div className="flex gap-4 items-center">
                <div className="h-[100px] w-[160px] border-2 border-neutral-300 border-dashed flex flex-col justify-center items-center cursor-pointer mt-4">
                    <div {...getRootProps()}>
                        <input {...getInputProps()} name="avatar" />
                        {uploadedFiles.length ? (
                            <div className="group relative">
                                <Image
                                    className="object-cover w-full h-[100px]"
                                    key={uploadedFiles[0].path}
                                    src={URL.createObjectURL(uploadedFiles[0])}
                                    alt={uploadedFiles[0].path as string}
                                    width={160}
                                    height={100}
                                />
                                <div className="absolute top-0 right-0 bottom-0 left-0 hidden text-white group-hover:flex flex-col justify-center items-center bg-[rgba(0,0,0,0.4)]">
                                    <RiImageEditLine size={28} />
                                    <span className="text-sm">Cập nhật ảnh</span>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col justify-center items-center">
                                <RiImageAddLine size={28} />
                                <span className="text-sm">Thêm ảnh</span>
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex-[1]">
                    <InputFormula name="response" placeholder="Viết suy nghĩ của bạn" control={control} />
                </div>
                <Button className="mt-8" color="primary">
                    Gửi
                </Button>
            </div>
            <div className="w-full mt-12">
                <Select
                    size="sm"
                    label="Sắp xếp theo"
                    color="primary"
                    variant="bordered"
                    defaultSelectedKeys={['0']}
                    className="w-[240px] mt-4"
                >
                    <SelectItem key={0} value={0}>
                        Thời gian
                    </SelectItem>
                    <SelectItem key={1} value={1}>
                        Tương tác
                    </SelectItem>
                </Select>
                <Card className="mt-8 p-8">
                    <ul>
                        <CommentItem />
                        <CommentItem />
                        <CommentItem />
                        <CommentItem />
                        <CommentItem />
                        <CommentItem />
                    </ul>
                    <Button className="w-full">Xem thêm</Button>
                </Card>
            </div>
        </div>
    );
};

export default PostDetail;
