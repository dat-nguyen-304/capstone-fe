'use client';

import { Button, Card, Tab, Tabs, useDisclosure } from '@nextui-org/react';
import Loader from '../Loader';
import { useQuery } from '@tanstack/react-query';
import { combinationApi } from '@/api-client';
import { AddTargetModal } from '../modal/AddTargetModal';
import { useState } from 'react';
import UpdatingTargetTab from './UpdatingTargetTab';
import TargetTab from './TargetTab';
import { QueryObserverResult, RefetchOptions, RefetchQueryFilters } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

interface StudentTargetProps {
    targets: any;
    refetch: <TPageData>(
        options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined
    ) => Promise<QueryObserverResult<AxiosResponse<any, any>, unknown>>;
}

const StudentTarget: React.FC<StudentTargetProps> = ({ targets, refetch }) => {
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const [targetData, setTargetData] = useState(targets);

    const { data: combinationsData, isLoading } = useQuery({
        queryKey: ['combinations'],
        queryFn: combinationApi.getAll,
        staleTime: Infinity
    });

    const targetNameList = targets?.map((target: any) => target.name);
    const addTargetItems = combinationsData?.filter(combination => !targetNameList.includes(combination.name));

    if (!targets || !addTargetItems) return <Loader />;

    return (
        <Card className="text-sm p-4 sm:p-8 mt-8">
            <div className="flex justify-between items-center mb-8">
                <h4 className="text-xl text-blue-500 font-semibold ">Mục tiêu</h4>
                <Button onClick={onOpen} color="success" variant="flat" className="text-xs sm:text-sm">
                    Thêm tổ hợp môn mới
                </Button>
            </div>
            <Tabs color="primary" variant="underlined" aria-label="Tabs variants">
                {targetData?.map((target: any) =>
                    target.grade === 0 ? (
                        <Tab key={target.id} title={`${target.name} (Chưa cập nhật)`}>
                            <UpdatingTargetTab refetch={refetch} target={target} />
                        </Tab>
                    ) : (
                        <Tab key={target.id} title={`${target.name} (${target.grade})`}>
                            <TargetTab refetch={refetch} target={target} />
                        </Tab>
                    )
                )}
            </Tabs>

            <AddTargetModal
                refetch={refetch}
                isOpen={isOpen}
                onOpen={onOpen}
                onClose={onClose}
                onOpenChange={onOpenChange}
                addTargetItems={addTargetItems}
            />
        </Card>
    );
};

export default StudentTarget;
