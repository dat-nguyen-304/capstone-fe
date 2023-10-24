'use client';

import { Checkbox, CheckboxGroup } from '@nextui-org/react';

interface LevelFilterProps {}

const LevelFilter: React.FC<LevelFilterProps> = () => {
    return (
        <CheckboxGroup size="sm" label="" className="mb-4">
            <Checkbox value="buenos-aires">Cơ bản</Checkbox>
            <Checkbox value="sydney">Trung bình</Checkbox>
            <Checkbox value="san-francisco">Nâng cao</Checkbox>
        </CheckboxGroup>
    );
};

export default LevelFilter;
