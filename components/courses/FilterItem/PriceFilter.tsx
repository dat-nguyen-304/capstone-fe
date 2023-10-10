'use client';

import { Slider } from 'antd';

interface PriceFilterProps {}

const PriceFilter: React.FC<PriceFilterProps> = () => {
    const getMoney = (money?: number) => {
        if (money) return <span>{`${money / 1000000} triệu`}</span>;
        return 0;
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
                    className="w-full text-orange-400"
                    trackStyle={{ backgroundColor: 'orange' }}
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
                    tooltip={{ open: false, placement: 'top', formatter: getMoney }}
                    defaultValue={500000}
                    className="w-full text-orange-400"
                    trackStyle={{ backgroundColor: 'orange' }}
                />
            </div>
        </div>
    );
};

export default PriceFilter;
