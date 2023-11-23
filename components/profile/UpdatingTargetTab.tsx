'use client';

import Image from 'next/image';

import { Button, Card, Input, Select, Tab, useDisclosure } from '@nextui-org/react';
import Loader from '../Loader';
import { useQuery } from '@tanstack/react-query';
import { combinationApi } from '@/api-client';

interface UpdatingTargetTabProps {
    target: any;
}

const UpdatingTargetTab: React.FC<UpdatingTargetTabProps> = ({ target }) => {
    const { data: combinationsData, isLoading } = useQuery({
        queryKey: ['combinations'],
        queryFn: combinationApi.getAll,
        staleTime: Infinity
    });
    const getSubjectList = (id: number) => {
        const combination = combinationsData?.find(combination => combination.id === id);
        return combination?.subjects;
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
                    // onChange={e => setTargetObject(target.id, subject.id, e.target.value)}
                />
            ))}
            <div className="flex flex-row-reverse mt-8">
                <Button color="primary">
                    {/* onClick={() => onSubmit(target.id)} */}
                    Lưu mục tiêu {target.name}
                </Button>
            </div>
        </>
    );
};

export default UpdatingTargetTab;
