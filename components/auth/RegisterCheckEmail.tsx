import styles from '@/app/auth/page.module.css';
import Image from 'next/image';

interface RegisterCheckEmailProps {}

const RegisterCheckEmail: React.FC<RegisterCheckEmailProps> = () => {
    return (
        <div className={styles.signUpForm}>
            <h2 className="text-center mb-2 sm:mb-4 text-sm sm:text-2xl text-[#444]">Cảm ơn bạn đã tin tưởng CEPA</h2>
            <h2 className="text-center sm:mb-4 text-sm sm:text-2xl text-[#444]">
                Vui lòng kiểm tra email để kích hoạt tài khoản
            </h2>
            <Image src="/check-email.gif" width={300} height={200} alt="" />
        </div>
    );
};

export default RegisterCheckEmail;
