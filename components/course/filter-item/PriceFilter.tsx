'use client';

import { Slider } from 'antd';
import { Dispatch, SetStateAction } from 'react';

interface PriceFilterProps {
    filterPriceStart: number;
    filterPriceEnd: number;
    setFilterPriceStart: Dispatch<SetStateAction<number>>;
    setFilterPriceEnd: Dispatch<SetStateAction<number>>;
    setFilterChange: Dispatch<SetStateAction<string>>;
}

const PriceFilter: React.FC<PriceFilterProps> = ({
    setFilterPriceStart,
    setFilterPriceEnd,
    setFilterChange,
    filterPriceStart,
    filterPriceEnd
}) => {
    const getMoney = (money?: number) => {
        if (money) return <span>{`${money / 1000000} triệu`}</span>;
        return 0;
    };
    const handleFilterPriceStart = (value: any) => {
        setFilterPriceStart(value);
        if (value > filterPriceEnd) setFilterPriceEnd(value + 500000);
    };
    const handleFilterPriceEnd = (value: any) => {
        setFilterPriceEnd(value);
        if (value < filterPriceStart) setFilterPriceStart(value - 500000);
        setFilterChange('PRICE');
    };
    return (
        <div className="w-[94%] mx-auto">
            <div className="flex mt-8">
                <p className="w-[50px] mt-1 font-semibold text-blue-600">Từ</p>
                <Slider
                    marks={{
                        0: {
                            label: <p className="text-orange-400 mt-1">0</p>
                        },
                        4500000: {
                            label: <p className="text-orange-400 font-semibold mt-1">4.5tr</p>
                        }
                    }}
                    min={0}
                    max={4500000}
                    step={500000}
                    tooltip={{ open: false, placement: 'top', formatter: getMoney }}
                    defaultValue={0}
                    value={filterPriceStart}
                    className="w-full text-orange-400"
                    trackStyle={{ backgroundColor: 'orange' }}
                    onChange={event => handleFilterPriceStart(event)}
                />
            </div>
            <div className="flex mt-8">
                <p className="w-[50px] mt-1 font-semibold text-blue-600">Đến</p>
                <Slider
                    marks={{
                        500000: {
                            label: <p className="text-orange-400 mt-1">500k</p>
                        },
                        5000000: {
                            label: <p className="text-orange-400 font-semibold mt-1">5tr</p>
                        }
                    }}
                    min={500000}
                    max={5000000}
                    step={500000}
                    value={filterPriceEnd}
                    tooltip={{ open: false, placement: 'top', formatter: getMoney }}
                    defaultValue={5000000}
                    className="w-full text-orange-400"
                    trackStyle={{ backgroundColor: 'orange' }}
                    onChange={event => handleFilterPriceEnd(event)}
                />
            </div>
        </div>
    );
};

export default PriceFilter;
