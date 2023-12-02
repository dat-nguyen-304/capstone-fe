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
    chartData?: any;
}

const RevenueChart: React.FC<BarChartProps> = ({ chartData }) => {
    console.log(chartData);

    const [userData, setUserData] = useState({
        labels: chartData?.map((data: any) => data.monthOfYear),
        datasets: [
            {
                label: 'Doanh thu',
                data: chartData?.map((data: any) => data.amount / 100),
                backgroundColor: ['#6395fa'],
                borderColor: 'black',
                borderWidth: 2
            }
        ]
    });

    return <Bar data={userData} />;
};

export default RevenueChart;
