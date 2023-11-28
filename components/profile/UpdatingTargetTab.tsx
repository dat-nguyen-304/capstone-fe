'use client';

import { Button, Input } from '@nextui-org/react';
import Loader from '../Loader';
import { useQuery } from '@tanstack/react-query';
import { combinationApi, studentApi } from '@/api-client';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { QueryObserverResult, RefetchOptions, RefetchQueryFilters } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

interface UpdatingTargetTabProps {
    target: any;
    refetch: <TPageData>(
        options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined
    ) => Promise<QueryObserverResult<AxiosResponse<any, any>, unknown>>;
}

const UpdatingTargetTab: React.FC<UpdatingTargetTabProps> = ({ target, refetch }) => {
    const [subjectTarget, setSubjectTarget] = useState<any[]>([{}, {}, {}]);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const { data: combinationsData, isLoading } = useQuery({
        queryKey: ['combinations'],
        queryFn: combinationApi.getAll,
        staleTime: Infinity
    });
    const getSubjectList = (name: string) => {
        const combination = combinationsData?.find(combination => combination.name === name);
        return combination?.subjects;
    };

    const setTargetObject = (index: number, subjectId: number, value: string) => {
        const grade = Number(value);
        console.log({ index, subjectId, grade });
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

    const onSave = async () => {
        let toastLoading;

        try {
            const founded = subjectTarget.find((subject: any) => subject.isValid === false);
            if (founded) toast.error('Vui lòng điền đúng thông tin');
            else {
                setIsSubmitting(true);
                toastLoading = toast.loading('Đang cập nhật');
                const subjectTargetBody = subjectTarget.map((subject: any) => ({
                    subjectId: subject.subjectId,
                    grade: subject.grade
                }));
                console.log({
                    hello: {
                        targetId: target.id,
                        studentSubjectTargetRequests: subjectTargetBody
                    }
                });
                const res = await studentApi.updateTarget({
                    targetId: target.id,
                    studentSubjectTargetRequests: subjectTarget
                });
                setIsSubmitting(false);
                refetch();
                toast.dismiss(toastLoading);
                toast.success('Cập nhật thành công');
            }
        } catch (error) {
            setIsSubmitting(false);
            toast.dismiss(toastLoading);
            toast.error('Hệ thống gặp trục trặc. Vui lòng thử lại sau ít phút.');
        }
    };

    const onRemove = async () => {
        let toastLoading;

        try {
            const founded = subjectTarget.find((subject: any) => subject.isValid === false);
            if (founded) toast.error('Vui lòng điền đúng thông tin');
            else {
                setIsSubmitting(true);
                toastLoading = toast.loading('Đang cập nhật');
                const subjectTargetBody = subjectTarget.map((subject: any) => ({
                    subjectId: subject.subjectId,
                    grade: subject.grade
                }));
                console.log({
                    hello: {
                        targetId: target.id,
                        studentSubjectTargetRequests: subjectTargetBody
                    }
                });
                const res = await studentApi.updateTarget({
                    targetId: target.id,
                    studentSubjectTargetRequests: subjectTarget
                });
                setIsSubmitting(false);
                refetch();
                toast.dismiss(toastLoading);
                toast.success('Cập nhật thành công');
            }
        } catch (error) {
            setIsSubmitting(false);
            toast.dismiss(toastLoading);
            toast.error('Hệ thống gặp trục trặc. Vui lòng thử lại sau ít phút.');
        }
    };

    // console.log({ subjects: getSubjectList(target.id) });
    console.log({ target });
    console.log({ subjectTarget });

    if (!target) return <Loader />;

    return (
        <>
            {getSubjectList(target.name)?.map((subject, index) => (
                <Input
                    key={subject.id}
                    name={subject.id.toString()}
                    label={subject.name}
                    className="my-4"
                    onChange={e => setTargetObject(index, subject.id, e.target.value)}
                />
            ))}
            <div className="flex flex-row-reverse mt-8 gap-3">
                <Button color="primary" isLoading={isSubmitting} onClick={() => onSave()}>
                    Lưu mục tiêu {target.name}
                </Button>
                <Button color="danger" isLoading={isSubmitting} onClick={() => onRemove()}>
                    Xóa mục tiêu {target.name}
                </Button>
            </div>
        </>
    );
};

export default UpdatingTargetTab;
