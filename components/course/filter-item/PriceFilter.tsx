'use client';

import { Slider } from 'antd';
import { Dispatch, SetStateAction } from 'react';

interface PriceFilterProps {
    filterPriceStart: number;
    filterPriceEnd: number;
    setFilterPriceStart: Dispatch<SetStateAction<number>>;
    setFilterPriceEnd: Dispatch<SetStateAction<number>>;
}

const PriceFilter: React.FC<PriceFilterProps> = ({
    setFilterPriceStart,
    setFilterPriceEnd,

    filterPriceStart,
    filterPriceEnd
}) => {
    const getMoney = (money?: number) => {
        if (money) return <span>{`${money / 1000000} triệu`}</span>;
        return 0;
    };
    const handleFilterPriceStart = (value: any) => {
        setFilterPriceStart(value);
        if (value > filterPriceEnd) setFilterPriceEnd(value + 100000);
    };
    const handleFilterPriceEnd = (value: any) => {
        setFilterPriceEnd(value);
        if (value < filterPriceStart) setFilterPriceStart(value - 100000);
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
                        1900000: {
                            label: <p className="text-orange-400 font-semibold mt-1">1.9tr</p>
                        }
                    }}
                    min={0}
                    max={1900000}
                    step={100000}
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
                        100000: {
                            label: <p className="text-orange-400 mt-1">100k</p>
                        },
                        2000000: {
                            label: <p className="text-orange-400 font-semibold mt-1">2tr</p>
                        }
                    }}
                    min={100000}
                    max={2000000}
                    step={100000}
                    value={filterPriceEnd}
                    tooltip={{ open: false, placement: 'top', formatter: getMoney }}
                    defaultValue={2000000}
                    className="w-full text-orange-400"
                    trackStyle={{ backgroundColor: 'orange' }}
                    onChange={event => handleFilterPriceEnd(event)}
                />
            </div>
        </div>
    );
};

export default PriceFilter;
