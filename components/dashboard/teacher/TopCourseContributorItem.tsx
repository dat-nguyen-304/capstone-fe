'use client';

import { User } from '@nextui-org/react';

interface BarChartProps {
    topIncome: any;
    index: number;
}
const formatCurrency = (value: number) => {
    const formattedValue = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0
    }).format(value);

    return formattedValue.replace('₫', ' VND');
};
const TopCourseContributorItem: React.FC<BarChartProps> = ({ topIncome, index }) => {
    return (
        <li className="flex items-center w-full justify-between mt-4">
            <div className="flex items-center">
                <span className={`font-semibold mr-4`}>{index + 1}</span>
                <p className="w-[300px] truncate" title={topIncome?.courseName}>
                    {topIncome?.courseName}
                </p>
                {/* <User
                    name="Jane Doe"
                    description="Đã mua 5 khóa học"
                    avatarProps={{
                        src: 'https://i.pravatar.cc/150?u=a04258114e29026702d'
                    }}
                /> */}
            </div>
            <p>{formatCurrency(Number(topIncome?.revenue) / 100)}</p>
        </li>
    );
};

export default TopCourseContributorItem;
