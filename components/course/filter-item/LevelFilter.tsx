'use client';

import { Checkbox, CheckboxGroup } from '@nextui-org/react';
import { Dispatch, SetStateAction } from 'react';

interface LevelFilterProps {
    setFilterLevel: Dispatch<SetStateAction<string[]>>;
    setFilterChange: Dispatch<SetStateAction<string>>;
}

const LevelFilter: React.FC<LevelFilterProps> = ({ setFilterLevel, setFilterChange }) => {
    const handleFilterLevel = (value: any) => {
        setFilterLevel(value);
        setFilterChange('LEVEL');
    };
    return (
        <CheckboxGroup size="sm" label="" className="mb-4" onValueChange={handleFilterLevel}>
            <Checkbox value="1">Cơ bản</Checkbox>
            <Checkbox value="2">Trung bình</Checkbox>
            <Checkbox value="3">Nâng cao</Checkbox>
        </CheckboxGroup>
    );
};

export default LevelFilter;
