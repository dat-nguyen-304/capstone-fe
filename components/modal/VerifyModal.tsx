'use client';

import { useVerifyModal } from '@/hooks/useVerifyModal';
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react';
import Image from 'next/image';
import { useCallback } from 'react';
import { DropzoneRootProps, FileWithPath, useDropzone } from 'react-dropzone';
import { RiImageAddLine, RiImageEditLine } from 'react-icons/ri';
import { toast } from 'react-toastify';

interface VerifyModalProps {
    onVerify: () => void;
}

export const VerifyModal: React.FC<VerifyModalProps> = ({ onVerify }) => {
    const { isOpen, onOpen, onClose, file, onFile, onCardNumber, onSubjectId, isSubmitting, cardNumber } =
        useVerifyModal();

    const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
        onFile(acceptedFiles[0]);
    }, []);
    const isValidInput = () => {
        return cardNumber.trim().length >= 6 && file;
    };
    const { getRootProps, getInputProps, fileRejections }: DropzoneRootProps = useDropzone({
        onDrop,
        accept: {
            'image/png': ['.png', '.jpg', '.jpeg']
        },
        maxFiles: 1,
        multiple: false
    });

    return (
        <Modal isOpen={isOpen} size="xl" onOpenChange={onClose}>
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1 text-center">Xin xác nhận giáo viên</ModalHeader>
                <ModalBody>
                    <span>Mã ngân hàng</span>
                    <Input
                        isRequired
                        value={cardNumber}
                        label="Mã ngân hàng"
                        placeholder=""
                        onChange={event => onCardNumber(event.target.value)}
                    />
                    <span>Môn</span>
                    <span>Ảnh xác nhận</span>
                    <div
                        {...getRootProps()}
                        className="relative group h-[100px] w-[160px] my-4 border-2 border-neutral-300 border-dashed flex flex-col justify-center items-center cursor-pointer"
                    >
                        <input {...getInputProps()} name="avatar" />
                        {file ? (
                            <>
                                <div className="">
                                    <Image
                                        className="object-cover w-full h-[100px]"
                                        key={file.path}
                                        src={URL.createObjectURL(file)}
                                        alt={file.path as string}
                                        width={240}
                                        height={240}
                                    />
                                </div>
                                <div className="absolute top-0 right-0 bottom-0 left-0 hidden text-white group-hover:flex flex-col justify-center items-center bg-[rgba(0,0,0,0.4)]">
                                    <RiImageEditLine size={40} />
                                    <span className="text-sm">Cập nhật ảnh</span>
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col justify-center items-center">
                                <RiImageAddLine size={40} />
                                <span className="text-sm">Tải ảnh</span>
                            </div>
                        )}
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button color="danger" variant="light" onPress={onClose}>
                        Hủy bỏ
                    </Button>
                    <Button
                        color="primary"
                        onClick={() => {
                            if (isValidInput()) {
                                onVerify();
                            } else {
                                toast.error('Cần điền đầy đủ thông tin');
                            }
                        }}
                        isLoading={isSubmitting}
                    >
                        Gửi
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};
