'use client';

import { Student } from '@/types';
import { NavbarContent } from '@nextui-org/react';
import React from 'react';
import Notification from './Notification';
import UserMenu from './UserMenu';

interface UserItemsProps {
    currentUser: Student;
}

const UserItems: React.FC<UserItemsProps> = ({ currentUser }) => {
    return (
        <NavbarContent as="div" justify="center" className="flex gap-[48px] items-center">
            <Notification />
            <UserMenu currentUser={currentUser} />
        </NavbarContent>
    );
};

export default UserItems;
