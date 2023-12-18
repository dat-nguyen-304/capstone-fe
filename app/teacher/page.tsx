'use client';

import { dashboardApi, teacherIncomeApi } from '@/api-client';
import Loader from '@/components/Loader';
import RevenueChartMonth from '@/components/chart/teacher-dashboard/RevenueChartMonth';
import TopCourseContributorItem from '@/components/dashboard/teacher/TopCourseContributorItem';
import { useSelectedSidebar } from '@/hooks';
import { Card, Pagination, Tab, Tabs } from '@nextui-org/react';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

const formatCurrency = (value: number) => {
    const formattedValue = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0
    }).format(value);

    return formattedValue.replace('₫', ' VND');
};

const TeacherDashboard: React.FC = () => {
    const [totalPage, setTotalPage] = useState<number>();
    const [totalRow, setTotalRow] = useState<number>();
    const [page, setPage] = useState(1);
    const [paymentCourse, setPaymentCourse] = useState<[]>([]);

    const { data: topIncomeData } = useQuery<any>({
        queryKey: ['teacher-top-income', { page }],
        queryFn: () => teacherIncomeApi.getTeacherTopIncome('ALL', page - 1, 10, 'revenue', 'DESC')
    });
    const { data: dashboardData } = useQuery({
        queryKey: ['teacherDashboard'],
        queryFn: dashboardApi.getAllTeacher
    });
    const { onTeacherKeys } = useSelectedSidebar();

    useEffect(() => {
        if (topIncomeData?.data) {
            setPaymentCourse(topIncomeData.data);
            setTotalPage(topIncomeData.totalPage);
            setTotalRow(topIncomeData.totalRow);
        }
    }, [topIncomeData]);

    useEffect(() => {
        onTeacherKeys(['1']);
    }, []);

    const scrollToTop = (value: number) => {
        setPage(value);
        window.scrollTo({
            top: 0
        });
    };

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
                <Card className="lg:col-span-3 p-4 mt-8 lg:mt-0  ">
                    <h3 className="text-lg font-semibold">Giao dịch gần đây</h3>
                    <ul>
                        {paymentCourse?.map((topIncome: any, index: number) => (
                            <TopCourseContributorItem key={topIncome?.id} topIncome={topIncome} index={index} />
                        ))}
                        {totalPage && totalPage > 1 ? (
                            <div className="flex justify-center my-8">
                                <Pagination
                                    page={page}
                                    total={totalPage}
                                    onChange={value => scrollToTop(value)}
                                    showControls
                                />
                            </div>
                        ) : (
                            <></>
                        )}
                    </ul>
                </Card>
            </div>
        </div>
    );
};

export default TeacherDashboard;
