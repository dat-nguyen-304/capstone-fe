'use client';

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
                <p className="w-[250px] truncate2line" title={topIncome?.courseName}>
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
            <p className="w-[100px] truncate">{formatCurrency(Number(topIncome?.receivedMoney) / 100)}</p>
        </li>
    );
};

export default TopCourseContributorItem;
