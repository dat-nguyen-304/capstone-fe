'use client';

import { useReportModal } from '@/hooks';
import {
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Select,
    SelectItem,
    Textarea
} from '@nextui-org/react';
import Image from 'next/image';
import { useCallback } from 'react';
import { DropzoneRootProps, FileWithPath, useDropzone } from 'react-dropzone';
import { RiImageAddLine, RiImageEditLine } from 'react-icons/ri';

interface ReportModalProps {}

export const ReportModal: React.FC<ReportModalProps> = () => {
    const { isOpen, onOpen, onClose, file, onFile, onReportType } = useReportModal();

    const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
        onFile(acceptedFiles[0]);
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
        <Modal isOpen={isOpen} size="xl" onOpenChange={onClose}>
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1 text-center">Báo lỗi cho nhân viên hỗ trợ</ModalHeader>
                <ModalBody>
                    <div className="flex justify-center">
                        <Image src="/modal/danger.png" alt="" width={80} height={80} />
                    </div>
                    <Select
                        isRequired
                        label="Phân lọai lỗi"
                        className="w-full"
                        onChange={e =>
                            onReportType(e.target.value as 'integrity' | 'academic' | 'technical' | 'opinion' | 'other')
                        }
                    >
                        <SelectItem key="integrity" value="integrity">
                            Vi phạm chuẩn mực
                        </SelectItem>
                        <SelectItem key="academic" value="academic" onClick={onOpen}>
                            Lỗi học thuật
                        </SelectItem>
                        <SelectItem key="technical" value="technical">
                            Lỗi kỹ thuật
                        </SelectItem>
                        <SelectItem key="opinion" value="opinion">
                            Đóng góp ý kiến
                        </SelectItem>
                        <SelectItem key="other" value="other">
                            Khác
                        </SelectItem>
                    </Select>
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
                    <Textarea isRequired label="Mô tả" placeholder="" />
                </ModalBody>
                <ModalFooter>
                    <Button color="danger" variant="light" onPress={onClose}>
                        Hủy bỏ
                    </Button>
                    <Button color="primary" onPress={onClose}>
                        Gửi
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};
