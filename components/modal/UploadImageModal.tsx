'use client';

import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@nextui-org/react';
import Image from 'next/image';
import { useCallback, useState } from 'react';
import { DropzoneRootProps, FileWithPath, useDropzone } from 'react-dropzone';
import { BiSolidPencil } from 'react-icons/bi';

interface UploadImageModalProps {
    image: string;
    isOpen: boolean;
    onOpen: () => void;
    onOpenChange: () => void;
}

export const UploadImageModal: React.FC<UploadImageModalProps> = ({ isOpen, onOpen, onOpenChange, image }) => {
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
        <Modal isOpen={isOpen} size="2xl" onOpenChange={onOpenChange}>
            <ModalContent>
                {onClose => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">Cập nhật ảnh</ModalHeader>
                        <ModalBody>
                            <div className="mx-auto">
                                <div className="w-[200px] lg:w-[300px] h-[200px] lg:h-[300px] mx-auto relative object-contain">
                                    <div className="group relative object-contain ">
                                        <Image
                                            src={
                                                uploadedFiles.length > 0 ? URL.createObjectURL(uploadedFiles[0]) : image
                                            }
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
                                </div>
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button className="bg-white" variant="bordered" onPress={onClose}>
                                Đóng
                            </Button>
                            <Button color="primary" onPress={onClose}>
                                Cập nhật
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};
