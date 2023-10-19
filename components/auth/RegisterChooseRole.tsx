import styles from '@/app/auth/page.module.css';
import { Dispatch, SetStateAction } from 'react';
import Image from 'next/image';
import { BsArrowRight } from 'react-icons/bs';
import { motion } from 'framer-motion';
import { ROLES } from './RegisterRoot';
import { Card } from '@nextui-org/react';
import { horizontal } from '@/animations';

interface RegisterChooseRoleProps {
    role: ROLES;
    setRole: Dispatch<SetStateAction<ROLES>>;
    nextStep: () => void;
}

const RegisterChooseRole: React.FC<RegisterChooseRoleProps> = ({ role, setRole, nextStep }) => {
    const handleNextStep = () => {
        if (role !== ROLES.NONE) nextStep();
    };

    return (
        <div className={styles.signUpForm}>
            <motion.div {...horizontal(50, 0.3, 0)}>
                <h2 className={styles.title}>Bạn là</h2>
                <div className="flex flex-col sm:flex-row gap-6 my-2 sm:my-8">
                    <Card
                        isPressable
                        className={`w-[240px] h-[180px] md:w-[200px] md:h-[158px] lg:w-[240px] lg:h-[180px] xl:w-[280px] xl:h-[200px] rounded-xl border-2 p-4 md:p-0 lg:p-4 items-center flex flex-col gap-3 hover:border-blue-500 transition cursor-pointer
                    ${role === ROLES.STUDENT ? 'border-blue-500 bg-blue-100 text-blue-500' : 'border-neutral-200'}`}
                        id="student"
                        onPress={() => setRole(ROLES.STUDENT)}
                    >
                        <Image alt="" width={100} height={100} src="/student.png" />
                        <div className="font-semibold mt-4 md:mt-2 lg:mt-4">Học sinh</div>
                    </Card>

                    <Card
                        isPressable
                        className={`w-[240px] h-[180px] md:w-[200px] md:h-[158px] lg:w-[240px] lg:h-[180px] xl:w-[280px] xl:h-[200px] rounded-xl border-2 p-4 md:p-0 lg:p-4 items-center flex flex-col gap-3 hover:border-blue-500 transition cursor-pointer
                    ${role === ROLES.TEACHER ? 'border-blue-500 bg-blue-100 text-blue-500' : 'border-neutral-200'}`}
                        id="teacher"
                        onPress={() => setRole(ROLES.TEACHER)}
                    >
                        <Image alt="" width={100} height={100} src="/teacher.png" />
                        <div className="font-semibold mt-4 md:mt-2 lg:mt-4">Giáo viên</div>
                    </Card>
                </div>
                <div className="flex justify-center">
                    <button
                        onClick={handleNextStep}
                        className={`flex justify-center items-center w-[120px] h-[40px] sm:w-[200px] sm:h-[48px] text-xs sm:text-sm bg-blue-500 border-none outline-none rounded-full uppercase sm:font-semibold my-[10px] cursor-pointer 
                    ${role !== ROLES.NONE ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
                        id="next-page"
                    >
                        <span className="mr-2">Tiếp theo</span>
                        <BsArrowRight
                            size={20}
                            color={role !== ROLES.NONE ? '#fff' : '#000'}
                            className="w-[16px] sm:w-[20px]"
                        />
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default RegisterChooseRole;
