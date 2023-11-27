'use client';

import Image from 'next/image';

import { Button, Card, Input, Select, Tab, useDisclosure } from '@nextui-org/react';
import Loader from '../Loader';
import { useQuery } from '@tanstack/react-query';
import { combinationApi, studentApi } from '@/api-client';
import { toast } from 'react-toastify';
import { useState } from 'react';

interface UpdatingTargetTabProps {
    target: any;
}

const UpdatingTargetTab: React.FC<UpdatingTargetTabProps> = ({ target }) => {
    const [subjectTarget, setSubjectTarget] = useState<any[]>(
        target.subjectTargetResponses.map((subject: any) => ({
            subjectId: subject.subjectId,
            grade: subject.grade,
            isValid: true // Initialize isValid property
        }))
    );
    const { data: combinationsData, isLoading } = useQuery({
        queryKey: ['combinations'],
        queryFn: combinationApi.getAll,
        staleTime: Infinity
    });
    const getSubjectList = (id: number) => {
        const combination = combinationsData?.find(combination => combination.id === id);
        return combination?.subjects;
    };

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
        let toastLoading;
        console.log('hello');
        console.log(subjectTarget);

        try {
            toastLoading = toast.loading('Đang cập nhật');
            const founded = subjectTarget.find((subject: any) => subject.isValid === false);
            if (founded) toast.error('Vui lòng điền đúng thông tin');
            else {
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
                console.log({ res });
                toast.dismiss(toastLoading);
                toast.success('Cập nhật thành công');
            }
        } catch (error) {
            toast.dismiss(toastLoading);
            toast.error('Hệ thống gặp trục trặc. Vui lòng thử lại sau ít phút.');
        }
    };
    if (!target) return <Loader />;

    return (
        <>
            {getSubjectList(target.id)?.map(subject => (
                <Input
                    key={subject.id}
                    name={subject.id.toString()}
                    label={subject.name}
                    className="my-4"
                    onChange={e => setTargetObject(target.id, subject.id, e.target.value)}
                />
            ))}
            <div className="flex flex-row-reverse mt-8">
                <Button color="primary" onClick={() => onSubmit()}>
                    Lưu mục tiêu {target.name}
                </Button>
            </div>
        </>
    );
};

export default UpdatingTargetTab;
