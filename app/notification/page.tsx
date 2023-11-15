'use client';

import NotificationItem from '@/components/notification/NotificationItem';
import { Tab, Tabs } from '@nextui-org/react';
import { useUser } from '@/hooks';
import NotFound from '../not-found';

interface UserNotificationProps {}

const UserNotification: React.FC<UserNotificationProps> = ({}) => {
    const { user } = useUser();

    if (user?.role !== 'STUDENT') return <NotFound />;

    return (
        <div className="w-[90%] xl:w-4/5 mx-auto my-8">
            <h3 className="text-xl text-blue-500 font-semibold my-4 sm:mt-0">Thông báo</h3>
            <Tabs aria-label="Options" color="primary" variant="underlined">
                <Tab key="note" title="Tất cả">
                    <ul>
                        <NotificationItem
                            type="transaction"
                            content="Mua khóa học abcxyz thành công"
                            money={-100000}
                            time="22/12/2023"
                        />
                        <NotificationItem
                            type="system"
                            content="Khóa học abcxyz đã được kích hoạt thành công"
                            time="22/12/2023"
                        />
                        <NotificationItem
                            type="comment"
                            content="Abcxyz đã trả lời bình luận của bạn"
                            time="22/12/2023"
                        />
                    </ul>
                </Tab>
                <Tab key="transaction" title="Giao dịch">
                    <NotificationItem
                        type="transaction"
                        content="Mua khóa học abcxyz thành công"
                        money={-100000}
                        time="22/12/2023"
                    />
                    <NotificationItem
                        type="transaction"
                        content="Nạp tiền thành công"
                        money={100000}
                        time="22/12/2023"
                    />
                </Tab>
                <Tab key="system" title="Hệ thống">
                    <NotificationItem
                        type="system"
                        content="Khóa học abcxyz đã được kích hoạt thành công"
                        time="22/12/2023"
                    />
                    <NotificationItem
                        type="system"
                        content="Khóa học abcxyz đã được kích hoạt thành công"
                        time="22/12/2023"
                    />
                </Tab>
                <Tab key="comment" title="Bình luận">
                    <NotificationItem type="comment" content="Abcxyz đã trả lời bình luận của bạn" time="22/12/2023" />
                    <NotificationItem type="comment" content="Abcxyz đã trả lời bình luận của bạn" time="22/12/2023" />
                </Tab>
            </Tabs>
        </div>
    );
};

export default UserNotification;
