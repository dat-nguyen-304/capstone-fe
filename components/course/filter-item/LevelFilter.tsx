'use client';

import { Checkbox, CheckboxGroup } from '@nextui-org/react';
import { Dispatch, SetStateAction } from 'react';

interface LevelFilterProps {
    setFilterLevel: Dispatch<SetStateAction<number[]>>;
    filterLevel: any[];
}

const LevelFilter: React.FC<LevelFilterProps> = ({ setFilterLevel, filterLevel }) => {
    const handleFilterLevel = (value: any) => {
        setFilterLevel(value);
    };

    return (
        <CheckboxGroup size="sm" label="" className="mb-4" defaultValue={filterLevel} onValueChange={handleFilterLevel}>
            <Checkbox value="1">Cơ bản</Checkbox>
            <Checkbox value="2">Trung bình</Checkbox>
            <Checkbox value="3">Nâng cao</Checkbox>
        </CheckboxGroup>
    );
};

export default LevelFilter;
