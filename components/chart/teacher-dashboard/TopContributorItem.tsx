'use client';

import { User } from '@nextui-org/react';

interface BarChartProps {}

const TopContributorItem: React.FC<BarChartProps> = () => {
    return (
        <li className="flex items-center w-full justify-between mt-4">
            <div className="flex items-center">
                <span className={`font-semibold mr-4`}>1</span>
                <User
                    name="Jane Doe"
                    description="Đã mua 5 khóa học"
                    avatarProps={{
                        src: 'https://i.pravatar.cc/150?u=a04258114e29026702d'
                    }}
                />
            </div>
            <p>5.00.000</p>
        </li>
    );
};

export default TopContributorItem;
