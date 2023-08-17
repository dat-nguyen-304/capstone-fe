import styles from '@/app/auth/page.module.css';
import { Dispatch, SetStateAction } from 'react';
import Image from 'next/image';

interface RegisterChooseRoleProps {
    setRole: Dispatch<SetStateAction<string>>;
}

const RegisterChooseRole: React.FC<RegisterChooseRoleProps> = ({ setRole }) => {
    return (
        <form className={styles.signUpForm}>
            <h2 className={styles.title}>Bạn là</h2>
            <div className="flex flex-col sm:flex-row gap-6 mt-8">
                <div
                    className="w-[280px] h-[200px] rounded-xl border-2 p-4 items-center flex flex-col gap-3 hover:border-blue-500 transition cursor-pointer"
                    onClick={() => setRole('student')}
                >
                    <Image
                        alt=""
                        width={100}
                        height={100}
                        src="https://cdn3d.iconscout.com/3d/premium/thumb/illustration-students-are-using-laptops-5589412-4652813.png"
                    />
                    <div className="font-semibold mt-4">Học sinh</div>
                </div>

                <div
                    className="w-[280px] h-[200px] rounded-xl border-2 p-4 items-center flex flex-col gap-3 hover:border-blue-500 transition cursor-pointer"
                    onClick={() => setRole('teacher')}
                >
                    <Image
                        alt=""
                        width={100}
                        height={100}
                        src="https://cdn3d.iconscout.com/3d/premium/thumb/female-teacher-7640039-6186490.png"
                    />
                    <div className="font-semibold mt-4">Giáo viên</div>
                </div>
            </div>
        </form>
    );
};

export default RegisterChooseRole;
