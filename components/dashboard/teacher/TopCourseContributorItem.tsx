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

    return formattedValue;
};
const TopCourseContributorItem: React.FC<BarChartProps> = ({ topIncome, index }) => {
    return (
        <li className="flex items-center w-full justify-between mt-4">
            <div className="flex items-center">
                <span className={`font-semibold mr-4`}>{index + 1}</span>
                <p className="flex-[1] max-w-[250px] text-xs sm:text-sm truncate" title={topIncome?.courseName}>
                    {topIncome?.courseName}
                </p>
            </div>
            <p className="text-end font-semibold text-orange-500">
                {formatCurrency(Number(topIncome?.receivedMoney) / 100)}
            </p>
        </li>
    );
};

export default TopCourseContributorItem;
