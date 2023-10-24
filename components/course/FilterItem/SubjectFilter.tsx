'use client';

import { subjectApi } from '@/api-client';
import { Subject } from '@/types';
import { AccordionItem, Checkbox, CheckboxGroup, Radio, RadioGroup } from '@nextui-org/react';
import { useQuery } from '@tanstack/react-query';
import { Rate } from 'antd';
import { AiFillStar } from 'react-icons/ai';
import { PuffLoader } from 'react-spinners';

interface SubjectFilterProps {}

const SubjectFilter: React.FC<SubjectFilterProps> = () => {
    const { data, isLoading } = useQuery({
        queryKey: ['SubjectFilters'],
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
