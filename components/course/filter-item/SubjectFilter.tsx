'use client';

import { subjectApi } from '@/api-client';
import { Subject } from '@/types';
import { Checkbox, CheckboxGroup } from '@nextui-org/react';
import { useQuery } from '@tanstack/react-query';
import { Dispatch, SetStateAction } from 'react';
import { PuffLoader } from 'react-spinners';

interface SubjectFilterProps {
    setFilterSubject: Dispatch<SetStateAction<string[]>>;
    setFilterChange: Dispatch<SetStateAction<string>>;
}

const SubjectFilter: React.FC<SubjectFilterProps> = ({ setFilterSubject, setFilterChange }) => {
    const { data, isLoading } = useQuery({
        queryKey: ['subjects'],
        queryFn: subjectApi.getAll,
        staleTime: Infinity
    });
    const handleFilterSubject = (value: any) => {
        setFilterSubject(value);
        setFilterChange('SUBJECT');
    };
    return (
        <CheckboxGroup size="sm" label="" className="mb-4" onValueChange={handleFilterSubject}>
            {isLoading ? (
                <PuffLoader size={100} color="red" />
            ) : (
                <>
                    {data?.map((SubjectFilter: Subject) => (
                        <Checkbox key={SubjectFilter.name} value={SubjectFilter.name.toString()}>
                            {SubjectFilter.name}
                        </Checkbox>
                    ))}
                </>
            )}
        </CheckboxGroup>
    );
};

export default SubjectFilter;
