'use client';

import { NavbarContent, NavbarItem, Button } from '@nextui-org/react';
import Link from 'next/link';

interface StartNowProps {}

const StartNow: React.FC<StartNowProps> = () => {
    return (
        <NavbarContent justify="center">
            <NavbarItem>
                <Button as={Link} color="primary" href="/auth" variant="flat">
                    Bắt đầu học ngay
                </Button>
            </NavbarItem>
        </NavbarContent>
    );
};

export default StartNow;
