'use client';

import { combinationApi, studentApi } from '@/api-client';
import { Combination } from '@/types';
import {
    Button,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Select,
    SelectItem,
    SelectedItems,
    useDisclosure
} from '@nextui-org/react';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { QueryObserverResult, RefetchOptions, RefetchQueryFilters } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

interface AddTargetModalProps {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
    onOpenChange: () => void;
    addTargetItems: any;
    refetch: <TPageData>(
        options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined
    ) => Promise<QueryObserverResult<AxiosResponse<any, any>, unknown>>;
}

export const AddTargetModal: React.FC<AddTargetModalProps> = ({
    isOpen,
    onOpen,
    onClose,
    onOpenChange,
    addTargetItems,
    refetch
}) => {
    const [combinationId, setCombinationId] = useState<string>(addTargetItems[0].name);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [subjectTarget, setSubjectTarget] = useState<any[3]>([{}, {}, {}]);
    const { data: combinationsData, isLoading } = useQuery({
        queryKey: ['combinations'],
        queryFn: combinationApi.getAll,
        staleTime: Infinity
    });

    const combination = combinationsData?.find(c => c.name === combinationId);

    const setTargetObject = (index: number, subjectId: number, value: string) => {
        const grade = Number(value);
        let isSubjectValid = true;
        const newSubjectTarget = [...subjectTarget];
        if (subjectId === 1) {
            if (grade <= 0 || grade > 10 || (grade * 10) % 2 !== 0) isSubjectValid = false;
        } else {
            if (grade <= 0 || grade > 10 || (grade * 4) % 1 !== 0) isSubjectValid = false;
        }
        newSubjectTarget[index] = {
            subjectId,
            grade,
            isValid: isSubjectValid
        };
        setSubjectTarget(newSubjectTarget);
    };

    const onSubmit = async () => {
        const founded = subjectTarget.find((target: any) => !target.isValid);
        if (founded) toast.error('Vui lòng điền đúng thông tin');
        else {
            setIsSubmitting(true);
            let toastLoading;
            try {
                toastLoading = toast.loading('Đang xử lí yêu cầu');
                const res = await studentApi.addTarget({
                    combinationId: combination?.id,
                    studentTargetRequest: subjectTarget
                });
                if (res) {
                    refetch();
                    setIsSubmitting(false);
                    toast.success('Thêm tổ hợp môn thành công');
                    onClose();
                }
                toast.dismiss(toastLoading);
            } catch (error) {
                toast.dismiss(toastLoading);
                setIsSubmitting(false);
                toast.error('Hệ thống gặp trục trặc, thử lại sau ít phút');
                console.log(error);
            }
        }
    };

    return (
        <Modal isOpen={isOpen} size="2xl" onOpenChange={onOpenChange}>
            <ModalContent>
                {onClose => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">Thêm mục tiêu mới</ModalHeader>
                        <ModalBody>
                            <Select
                                color="primary"
                                items={addTargetItems}
                                disallowEmptySelection
                                selectionMode="single"
                                className="max-w-xs"
                                variant="underlined"
                                size="sm"
                                defaultSelectedKeys={[combinationId]}
                                onChange={e => setCombinationId(e.target.value)}
                                renderValue={(combinations: SelectedItems<Combination>) => {
                                    return (
                                        <div className="flex gap-2">
                                            {combinations.map(combination => (
                                                <span className="mr-1 text-sm" key={combination.data?.id}>
                                                    {combination.data?.name}
                                                </span>
                                            ))}
                                        </div>
                                    );
                                }}
                            >
                                {combination => (
                                    <SelectItem key={combination.name} value={combination.name}>
                                        {combination.name} - {combination.description}
                                    </SelectItem>
                                )}
                            </Select>
                            {combination?.subjects?.map((subject, index) => (
                                <Input
                                    key={subject.id}
                                    name={subject.id}
                                    label={subject.name}
                                    className="my-2"
                                    size="sm"
                                    type="number"
                                    onChange={e => setTargetObject(index, subject.id, e.target.value)}
                                    errorMessage={subjectTarget[index].isValid === false && 'Điểm số không hợp lệ'}
                                    isInvalid={subjectTarget[index].isValid === false}
                                />
                            ))}
                        </ModalBody>
                        <ModalFooter>
                            <Button className="bg-white" variant="bordered" onPress={onClose} isLoading={isSubmitting}>
                                Đóng
                            </Button>
                            <Button color="primary" onClick={onSubmit} isLoading={isSubmitting}>
                                Thêm mục tiêu
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};
