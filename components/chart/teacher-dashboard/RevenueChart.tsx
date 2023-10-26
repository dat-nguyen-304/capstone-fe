'use client';

import { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

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

interface BarChartProps {}

const RevenueChart: React.FC<BarChartProps> = () => {
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

    return <Bar data={userData} />;
};

export default RevenueChart;
