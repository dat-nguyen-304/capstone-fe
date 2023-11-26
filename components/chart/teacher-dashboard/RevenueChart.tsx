'use client';

import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import { useQuery } from '@tanstack/react-query';
import { teacherApi, teacherIncomeApi } from '@/api-client';

const UserData = [
    {
        id: 1,
        month: '05/2023',
        revenue: 800000
    },
    {
        id: 2,
        month: '06/2023',
        revenue: 900000
    },
    {
        id: 3,
        month: '07/2023',
        revenue: 950000
    },
    {
        id: 4,
        month: '08/2023',
        revenue: 250000
    },
    {
        id: 5,
        month: '09/2023',
        revenue: 450000
    },
    {
        id: 1,
        month: '05/2023',
        revenue: 800000
    },
    {
        id: 2,
        month: '06/2023',
        revenue: 900000
    },
    {
        id: 3,
        month: '07/2023',
        revenue: 950000
    },
    {
        id: 4,
        month: '08/2023',
        revenue: 250000
    },
    {
        id: 5,
        month: '09/2023',
        revenue: 450000
    }
];
const formatCurrency = (value: number) => {
    const formattedValue = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0
    }).format(value);

    return formattedValue.replace('₫', ' VND');
};
interface BarChartProps {
    courseId?: number | undefined;
}

const RevenueChart: React.FC<BarChartProps> = ({ courseId }) => {
    const [userData, setUserData] = useState({
        labels: UserData.map(data => data.month),
        datasets: [
            {
                label: 'Doanh thu',
                data: UserData.map(data => data.revenue),
                backgroundColor: ['#6395fa'],
                borderColor: 'black',
                borderWidth: 2
            }
        ]
    });
    const { data: incomeCourseData, isLoading } = useQuery<any>({
        queryKey: ['teacher-income-course', { courseId }],
        queryFn: () => {
            if (courseId) {
                return teacherIncomeApi.getTeacherIncomeByCourse(courseId);
            } else {
                return [];
            }
        }
    });
    console.log(incomeCourseData);
    useEffect(() => {
        if (incomeCourseData?.data?.length) {
            setUserData({
                labels: incomeCourseData?.data?.map((incomeData: any) => incomeData?.monthOfYear),
                datasets: [
                    {
                        label: 'Doanh thu',
                        data: incomeCourseData?.data?.map((incomeData: any) => incomeData?.revenue),
                        backgroundColor: ['#6395fa'],
                        borderColor: 'black',
                        borderWidth: 2
                    }
                ]
            });
        }
    }, [incomeCourseData]);

    return <Bar data={userData} />;
};

export default RevenueChart;
