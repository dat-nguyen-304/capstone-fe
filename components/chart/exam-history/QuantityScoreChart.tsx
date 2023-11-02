'use client';

import { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const QuantityScoreData = [
    {
        id: 1,
        quantity: 1,
        score: '[0;1)'
    },
    {
        id: 2,
        quantity: 2,
        score: '[1;2)'
    },
    {
        id: 3,
        quantity: 3,
        score: '[2;3)'
    },
    {
        id: 4,
        quantity: 2,
        score: '[3;4)'
    },
    {
        id: 5,
        quantity: 4,
        score: '[4;5)'
    },
    {
        id: 1,
        quantity: 7,
        score: '[5;6)'
    },
    {
        id: 2,
        quantity: 8,
        score: '[6;7)'
    },
    {
        id: 3,
        quantity: 9,
        score: '[7;8)'
    },
    {
        id: 4,
        quantity: 3,
        score: '[8;9)'
    },
    {
        id: 5,
        quantity: 1,
        score: '[9;10]'
    }
];

interface BarChartProps {}

const QuantityScoreChart: React.FC<BarChartProps> = () => {
    const [userData, setUserData] = useState({
        labels: QuantityScoreData.map(data => data.score),
        datasets: [
            {
                label: 'Số lượng điểm số',
                data: QuantityScoreData.map(data => data.quantity),
                backgroundColor: ['#6395fa'],
                borderColor: 'black',
                borderWidth: 2
            }
        ]
    });

    return <Bar data={userData} />;
};

export default QuantityScoreChart;
