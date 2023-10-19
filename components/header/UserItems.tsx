'use client';

import { Student } from '@/types';
import { NavbarContent } from '@nextui-org/react';
import React from 'react';
import Notification from './Notification';
import UserMenu from './UserMenu';

interface UserItemsProps {
    currentStudent: Student;
}

const UserItems: React.FC<UserItemsProps> = ({ currentStudent }) => {
    return (
        <NavbarContent as="div" justify="center" className="flex gap-[48px] items-center">
            <Notification />
            <UserMenu currentStudent={currentStudent} />
        </NavbarContent>
    );
};

export default UserItems;
