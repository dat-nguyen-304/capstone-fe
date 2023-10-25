'use client';

import { subjectApi } from '@/api-client';
import { Subject } from '@/types';
import { Checkbox, CheckboxGroup } from '@nextui-org/react';
import { useQuery } from '@tanstack/react-query';
import { PuffLoader } from 'react-spinners';

interface SubjectFilterProps {}

const SubjectFilter: React.FC<SubjectFilterProps> = () => {
    const { data, isLoading } = useQuery({
        queryKey: ['subjects'],
        queryFn: subjectApi.getAll
    });
    return (
        <CheckboxGroup size="sm" label="" className="mb-4">
            {isLoading ? (
                <PuffLoader size={100} color="red" />
            ) : (
                <>
                    {data?.map((SubjectFilter: Subject) => (
                        <Checkbox key={SubjectFilter.id} value={SubjectFilter.id.toString()}>
                            {SubjectFilter.name}
                        </Checkbox>
                    ))}
                </>
            )}
        </CheckboxGroup>
    );
};

export default SubjectFilter;
