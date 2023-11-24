'use client';

import Image from 'next/image';

import { Button, Card, Input, Select, Tab, useDisclosure } from '@nextui-org/react';
import Loader from '../Loader';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { studentApi } from '@/api-client';

interface TargetTabProps {
    target: any;
}

const TargetTab: React.FC<TargetTabProps> = ({ target }) => {
    const [subjectTarget, setSubjectTarget] = useState<any[3]>(
        target.subjectTargetResponses.map((subject: any) => ({
            subjectId: subject.subjectId,
            grade: subject.grade
        }))
    );

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
            {target.subjectTargetResponses.map((subject: any, index: number) => (
                <Input
                    className="my-4"
                    key={subject.id}
                    name={subject.id}
                    defaultValue={subject.grade}
                    label={subject.name}
                    onChange={e => setTargetObject(index, subject.subjectId, e.target.value)}
                    errorMessage={subjectTarget[index].isValid === false && 'Điểm số không hợp lệ'}
                    isInvalid={subjectTarget[index].isValid === false}
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

export default TargetTab;
