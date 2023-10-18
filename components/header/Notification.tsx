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
import { BsBook, BsCashCoin } from 'react-icons/bs';
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
                            <svg
                                fill="none"
                                height={24}
                                viewBox="0 0 24 24"
                                width={24}
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    clipRule="evenodd"
                                    d="M18.707 8.796c0 1.256.332 1.997 1.063 2.85.553.628.73 1.435.73 2.31 0 .874-.287 1.704-.863 2.378a4.537 4.537 0 01-2.9 1.413c-1.571.134-3.143.247-4.736.247-1.595 0-3.166-.068-4.737-.247a4.532 4.532 0 01-2.9-1.413 3.616 3.616 0 01-.864-2.378c0-.875.178-1.682.73-2.31.754-.854 1.064-1.594 1.064-2.85V8.37c0-1.682.42-2.781 1.283-3.858C7.861 2.942 9.919 2 11.956 2h.09c2.08 0 4.204.987 5.466 2.625.82 1.054 1.195 2.108 1.195 3.745v.426zM9.074 20.061c0-.504.462-.734.89-.833.5-.106 3.545-.106 4.045 0 .428.099.89.33.89.833-.025.48-.306.904-.695 1.174a3.635 3.635 0 01-1.713.731 3.795 3.795 0 01-1.008 0 3.618 3.618 0 01-1.714-.732c-.39-.269-.67-.694-.695-1.173z"
                                    fill="#333"
                                    fillRule="evenodd"
                                />
                            </svg>
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
