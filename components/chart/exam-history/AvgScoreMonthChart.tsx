'use client';

import { useEffect, useState } from 'react';
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

interface BarChartProps {
    avgGrade: any[] | any;
    times: any[] | any;
}

const AvgScoreMonthChart: React.FC<BarChartProps> = ({ avgGrade, times }) => {
    const [userData, setUserData] = useState({
        labels: times || [],
        datasets: [
            {
                label: 'Điểm số trung bình',
                data: avgGrade || [],
                backgroundColor: ['#6395fa'],
                borderColor: 'black',
                borderWidth: 2
            }
        ]
    });

    useEffect(() => {
        console.log('AvgScoreMonthChart useEffect triggered');
        console.log('avgGrade:', avgGrade);
        console.log('times:', times);

        setUserData({
            labels: times || [],
            datasets: [
                {
                    label: 'Điểm số trung bình',
                    data: avgGrade || [],
                    backgroundColor: ['#6395fa'],
                    borderColor: 'black',
                    borderWidth: 2
                }
            ]
        });
    }, [avgGrade, times]);

    return <Bar data={userData} />;
};

export default AvgScoreMonthChart;
