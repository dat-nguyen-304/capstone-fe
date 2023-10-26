'use client';

import {
    Badge,
    Button,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownSection,
    DropdownTrigger
} from '@nextui-org/react';
import React from 'react';
import { BsBell, BsBook, BsCashCoin } from 'react-icons/bs';
import { GoCommentDiscussion } from 'react-icons/go';

interface NotificationProps {}

const Notification: React.FC<NotificationProps> = () => {
    return (
        <div className="cursor-pointer h-[40px]">
            <Dropdown
                showArrow
                classNames={{
                    base: 'py-1 px-1 border border-default-200 bg-gradient-to-br from-white to-default-200 dark:from-default-50 dark:to-black',
                    arrow: 'bg-default-200'
                }}
            >
                <DropdownTrigger>
                    <Button className="bg-transparent">
                        <Badge color="danger" content={5} shape="circle">
                            <BsBell size={20} className="text-blue-500" />
                        </Badge>
                    </Button>
                </DropdownTrigger>
                <DropdownMenu variant="faded" aria-label="Dropdown menu with description">
                    <DropdownSection title="Thông báo">
                        <DropdownItem
                            key="new"
                            description="Mua khóa học thành công"
                            startContent={<BsBook className="mr-2 text-blue-500" />}
                        >
                            Mua khóa học
                        </DropdownItem>
                        <DropdownItem
                            key="copy"
                            description="Nạp tiền thành công"
                            startContent={<BsCashCoin className="mr-2 text-yellow-600" />}
                        >
                            Nạp tiền
                        </DropdownItem>
                        <DropdownItem
                            key="edit"
                            description="ABC đã trả lời bình luận của bạn"
                            startContent={<GoCommentDiscussion className="mr-2" />}
                        >
                            Bình luận
                        </DropdownItem>
                    </DropdownSection>
                </DropdownMenu>
            </Dropdown>
        </div>
    );
};

export default Notification;
