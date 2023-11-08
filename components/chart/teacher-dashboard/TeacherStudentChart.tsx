'use client';

import { useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import 'chart.js/auto';

const UserData = [
    {
        id: 1,
        month: '05/2023',
        revenue: 80
    },
    {
        id: 2,
        month: '06/2023',
        revenue: 90
    },
    {
        id: 3,
        month: '07/2023',
        revenue: 95
    },
    {
        id: 4,
        month: '08/2023',
        revenue: 25
    },
    {
        id: 5,
        month: '09/2023',
        revenue: 45
    },
    {
        id: 1,
        month: '05/2023',
        revenue: 80
    },
    {
        id: 2,
        month: '06/2023',
        revenue: 90
    },
    {
        id: 3,
        month: '07/2023',
        revenue: 95
    },
    {
        id: 4,
        month: '08/2023',
        revenue: 25
    },
    {
        id: 5,
        month: '09/2023',
        revenue: 45
    }
];

interface BarChartProps {}

const TeacherStudentChart: React.FC<BarChartProps> = () => {
    const [userData, setUserData] = useState({
        labels: UserData.map(data => data.month),
        datasets: [
            {
                label: 'Giáo viên',
                data: UserData.map(data => data.revenue - 10),
                backgroundColor: ['#18c964'],
                borderColor: '#18c964',
                borderWidth: 2
            },
            {
                label: 'Học sinh',
                data: UserData.map(data => data.revenue),
                backgroundColor: ['#0070f0'],
                borderColor: '#0070f0',
                borderWidth: 2
            }
        ]
    });

    return <Line data={userData} />;
};

export default TeacherStudentChart;
