'use client';

import { dashboardApi, teacherIncomeApi } from '@/api-client';
import Loader from '@/components/Loader';
import RevenueChartMonth from '@/components/chart/teacher-dashboard/RevenueChartMonth';
import TopCourseContributorItem from '@/components/dashboard/teacher/TopCourseContributorItem';
import { useSelectedSidebar } from '@/hooks';
import { Card, Tab, Tabs } from '@nextui-org/react';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

const formatCurrency = (value: number) => {
    const formattedValue = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0
    }).format(value);

    return formattedValue.replace('₫', ' VND');
};

const TeacherDashboard: React.FC = () => {
    const { data: topIncomeData } = useQuery<any>({
        queryKey: ['teacher-top-income'],
        queryFn: () => teacherIncomeApi.getTeacherTopIncome('RECEIVED', 0, 5, 'revenue', 'DESC')
    });
    const { data: dashboardData } = useQuery({
        queryKey: ['teacherDashboard'],
        queryFn: dashboardApi.getAllTeacher
    });
    const { onTeacherKeys } = useSelectedSidebar();

    useEffect(() => {
        onTeacherKeys(['1']);
    }, []);

    if (!dashboardData) return <Loader />;

    return (
        <div>
            <div className="sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4 px-4">
                <Card className="p-4 mt-4 sm:mt-0 coin-bg">
                    <div>
                        <h1 className="text-[14px] text-primary">Doanh thu tháng</h1>
                    </div>
                    <div className="my-2">
                        <span className="text-[30px]">
                            {formatCurrency(Number(dashboardData?.monthlyIncome / 100))}
                        </span>
                    </div>
                </Card>
                <Card className="p-4 mt-4 sm:mt-0 course-bg">
                    <div>
                        <h1 className="text-[14px] text-primary">Khóa học</h1>
                    </div>
                    <div className="my-2">
                        <span className="text-[30px]">{dashboardData?.totalCourse || 0}</span>
                    </div>
                </Card>
                <Card className="p-4 mt-4 sm:mt-0 video-bg">
                    <div>
                        <h1 className="text-[14px] text-primary">Video</h1>
                    </div>
                    <div className="my-2">
                        <span className="text-[30px]">{dashboardData?.totalVideo || 0}</span>
                    </div>
                </Card>
                <Card className="p-4 mt-4 sm:mt-0 student-bg">
                    <div>
                        <h1 className="text-[14px] text-primary">Học sinh mới</h1>
                    </div>
                    <div className="my-2">
                        <span className="text-[30px]">{dashboardData?.totalStudent || 0}</span>
                    </div>
                </Card>
            </div>
            <div className="lg:grid lg:grid-cols-10 gap-4 mt-8 px-0">
                <Card className="lg:col-span-7 p-4">
                    <Tabs color="primary" variant="underlined" aria-label="Tabs variants">
                        <Tab key="revenue" title="Doanh thu">
                            <RevenueChartMonth revenueData={dashboardData?.courseRevenueByMonths} />
                        </Tab>
                    </Tabs>
                </Card>
                <Card className="lg:col-span-3 p-4 mt-8 lg:mt-0">
                    <h3 className="text-lg font-semibold">Khóa học đã thanh toán</h3>
                    <ul>
                        {topIncomeData?.data?.map((topIncome: any, index: number) => (
                            <TopCourseContributorItem key={topIncome?.id} topIncome={topIncome} index={index} />
                        ))}
                    </ul>
                </Card>
            </div>
        </div>
    );
};

export default TeacherDashboard;
