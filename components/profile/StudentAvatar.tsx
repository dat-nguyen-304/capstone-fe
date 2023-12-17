'use client';

import Image from 'next/image';
import { BiSolidPencil } from 'react-icons/bi';
import { Chip, useDisclosure } from '@nextui-org/react';
import Loader from '../Loader';
import { Dispatch, SetStateAction, useCallback, useState } from 'react';
import { DropzoneRootProps, FileWithPath, useDropzone } from 'react-dropzone';
interface StudentAvatarProps {
    studentData: any;
    setGetUploadedFiles: Dispatch<SetStateAction<FileWithPath[]>>;
}

const StudentAvatar: React.FC<StudentAvatarProps> = ({ studentData, setGetUploadedFiles }) => {
    const [uploadedFiles, setUploadedFiles] = useState<FileWithPath[]>([]);

    const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
        setUploadedFiles(acceptedFiles);
        setGetUploadedFiles(acceptedFiles);
    }, []);

    const { getRootProps, getInputProps, fileRejections }: DropzoneRootProps = useDropzone({
        onDrop,
        accept: {
            'image/png': ['.png', '.jpg', '.jpeg']
        },
        maxFiles: 1,
        multiple: false
    });

    if (!studentData) return <Loader />;

    return (
        <>
            <h4 className="md:hidden text-lg sm:text-xl text-blue-500 font-semibold mb-8">Ảnh đại diện</h4>
            <div className="rounded-xl">
                <div className="w-[200px] lg:w-[300px] h-[200px] lg:h-[300px] mx-auto relative object-contain">
                    <div className="group relative object-contain ">
                        <Image
                            src={
                                uploadedFiles.length > 0
                                    ? URL.createObjectURL(uploadedFiles[0])
                                    : studentData?.url
                                    ? studentData?.url
                                    : '/student.png'
                            }
                            width={300}
                            height={300}
                            alt=""
                            className="border-1 rounded-lg"
                        />
                    </div>

                    <div {...getRootProps()}>
                        <div className="absolute right-2 top-2 shadow-lg rounded-full border-2 border-blue-700 bg-blue-300 cursor-pointer w-[40px] h-[40px] flex items-center justify-center">
                            <div {...getInputProps()}></div>
                            <BiSolidPencil size={20} className="text-blue-500" />
                        </div>
                    </div>
                    {/* <div
                        onClick={onOpen}
                        className="absolute right-2 top-2 shadow-lg rounded-full border-2 border-blue-700 bg-blue-300 cursor-pointer w-[40px] h-[40px] flex items-center justify-center"
                    >
                        <BiSolidPencil size={20} className="text-blue-500" />
                    </div>
                    <UploadImageModal
                        image={studentData.url || '/student.png'}
                        isOpen={isOpen}
                        onOpen={onOpen}
                        onOpenChange={onOpenChange}
                    /> */}

                    <div className="hidden md:block">
                        <h3 className="text-blue-500 text-2xl font-semibold mt-8">{studentData.fullName}</h3>
                        <p className="mt-4 text-sm">Ngày tham gia: 21/10/2023</p>
                        <span className="mt-4 text-sm flex  items-center">
                            Tổ hợp môn:
                            <ul className="flex gap-2  mx-2 text-sm">
                                {studentData.targets.map((target: any) => (
                                    <li key={target.name}>
                                        <Chip color="primary" className=" text-xs sm:text-sm">
                                            {target.name}
                                        </Chip>
                                    </li>
                                ))}
                            </ul>
                        </span>
                    </div>
                </div>
            </div>
        </>
    );
};

export default StudentAvatar;
