'use client';

import { CommonUser } from '@/types';
import { NavbarContent } from '@nextui-org/react';
import React from 'react';
import Notification from '../notification/HeaderNotification';
import UserMenu from './UserMenu';

interface UserItemsProps {
    currentUser: CommonUser;
}

const UserItems: React.FC<UserItemsProps> = ({ currentUser }) => {
    return (
        <NavbarContent as="div" justify="center" className="flex gap-[48px] items-center">
            {currentUser.role === 'STUDENT' && <Notification />}
            <UserMenu currentUser={currentUser} />
        </NavbarContent>
    );
};

export default UserItems;
