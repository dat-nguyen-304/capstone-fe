'use client';

import { subjectApi } from '@/api-client';
import { Subject } from '@/types';
import { Checkbox, CheckboxGroup } from '@nextui-org/react';
import { useQuery } from '@tanstack/react-query';
import { Dispatch, SetStateAction } from 'react';
import { PuffLoader } from 'react-spinners';

interface SubjectFilterProps {
    setFilterSubject: Dispatch<SetStateAction<number[]>>;
    filterSubject: any[];
}

const SubjectFilter: React.FC<SubjectFilterProps> = ({ setFilterSubject, filterSubject }) => {
    const { data, isLoading } = useQuery({
        queryKey: ['subjects'],
        queryFn: subjectApi.getAll,
        staleTime: Infinity
    });
    const handleFilterSubject = (value: any) => {
        setFilterSubject(value);
    };
    return (
        <CheckboxGroup
            size="sm"
            label=""
            className="mb-4"
            onValueChange={handleFilterSubject}
            defaultValue={filterSubject}
        >
            {isLoading ? (
                <PuffLoader size={100} color="blue" />
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
