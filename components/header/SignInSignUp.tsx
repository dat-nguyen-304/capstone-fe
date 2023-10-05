'use client';

import { NavbarContent, NavbarItem, Button } from '@nextui-org/react';
import Link from 'next/link';

interface SignInSignUpProps {}

const SignInSignUp: React.FC<SignInSignUpProps> = () => {
    return (
        <NavbarContent justify="end">
            <NavbarItem className="hidden lg:flex">
                <Link href="#">Đăng nhập</Link>
            </NavbarItem>
            <NavbarItem>
                <Button as={Link} color="primary" href="#" variant="flat">
                    Đăng ký
                </Button>
            </NavbarItem>
        </NavbarContent>
    );
};

export default SignInSignUp;
