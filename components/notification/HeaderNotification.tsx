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
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { BsBell, BsCashCoin } from 'react-icons/bs';
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
                            as={Link}
                            href="/notification"
                            key="new"
                            description="Mua khóa học thành công"
                            startContent={<BsCashCoin className="mr-2 text-blue-500" />}
                            className="flex bg-blue-200 my-1 hover:!bg-blue-200"
                        >
                            Mua khóa học
                        </DropdownItem>
                        <DropdownItem
                            as={Link}
                            href="/notification"
                            key="copy"
                            description="Nạp tiền thành công"
                            startContent={
                                <Image
                                    src="https://intaadvising.gatech.edu/wp-content/uploads/2020/11/cepa.png"
                                    alt=""
                                    width={30}
                                    height={30}
                                    className="mr-2 text-yellow-600 "
                                />
                            }
                            className="flex bg-blue-200 my-1 hover:!bg-blue-200"
                        >
                            Nạp tiền
                        </DropdownItem>
                        <DropdownItem
                            as={Link}
                            href="/notification"
                            key="edit"
                            description="ABC đã trả lời bình luận của bạn"
                            startContent={<GoCommentDiscussion className="mr-2" />}
                        >
                            Bình luận
                        </DropdownItem>
                        <DropdownItem
                            as={Link}
                            href="/notification"
                            key="view-all"
                            className="text-center"
                            color="primary"
                            variant="solid"
                        >
                            Xem tất cả
                        </DropdownItem>
                    </DropdownSection>
                </DropdownMenu>
            </Dropdown>
        </div>
    );
};

export default Notification;
