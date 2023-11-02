'use client';

import { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const AvgScoreData = [
    {
        id: 1,
        month: '05/2023',
        score: 8.3
    },
    {
        id: 2,
        month: '06/2023',
        score: 5.2
    },
    {
        id: 3,
        month: '07/2023',
        score: 4.3
    },
    {
        id: 4,
        month: '08/2023',
        score: 7.1
    },
    {
        id: 5,
        month: '09/2023',
        score: 6.9
    },
    {
        id: 1,
        month: '05/2023',
        score: 5.6
    },
    {
        id: 2,
        month: '06/2023',
        score: 9.1
    },
    {
        id: 3,
        month: '07/2023',
        score: 9.2
    },
    {
        id: 4,
        month: '08/2023',
        score: 8.8
    },
    {
        id: 5,
        month: '09/2023',
        score: 9.4
    }
];

interface BarChartProps {}

const AvgScoreMonthChart: React.FC<BarChartProps> = () => {
    const [userData, setUserData] = useState({
        labels: AvgScoreData.map(data => data.month),
        datasets: [
            {
                label: 'Điểm số trung bình',
                data: AvgScoreData.map(data => data.score),
                backgroundColor: ['#6395fa'],
                borderColor: 'black',
                borderWidth: 2
            }
        ]
    });

    return <Bar data={userData} />;
};

export default AvgScoreMonthChart;
