'use client';

import { NavbarContent, NavbarItem, Button } from '@nextui-org/react';
import Link from 'next/link';

interface SignInSignUpProps {}

const SignInSignUp: React.FC<SignInSignUpProps> = () => {
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

export default SignInSignUp;
