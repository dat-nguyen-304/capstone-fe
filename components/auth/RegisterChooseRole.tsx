import styles from '@/app/auth/page.module.css';
import { Dispatch, SetStateAction } from 'react';
import Image from 'next/image';
import { BsArrowRight } from 'react-icons/bs';
import { motion } from 'framer-motion';
import { ROLES } from './RegisterRoot';
import { Card } from '@nextui-org/react';

interface RegisterChooseRoleProps {
    role: ROLES;
    setRole: Dispatch<SetStateAction<ROLES>>;
    nextStep: () => void;
}

const RegisterChooseRole: React.FC<RegisterChooseRoleProps> = ({ role, setRole, nextStep }) => {
    const animations = {
        div: {
            initial: {
                x: '-100%',
                opacity: 0
            },
            whileInView: {
                x: 0,
                opacity: 1
            }
        }
    };

    const handleNextStep = () => {
        if (role) nextStep();
    };

    return (
        <div className={styles.signUpForm}>
            <motion.div {...animations.div}>
                <h2 className={styles.title}>Bạn là</h2>
                <div className="flex flex-col sm:flex-row gap-6 my-2 sm:my-8">
                    <Card
                        isPressable
                        className={`w-[240px] h-[180px] md:w-[200px] md:h-[140px] lg:w-[280px] lg:h-[200px] rounded-xl border-2 p-4 items-center flex flex-col gap-3 hover:border-blue-500 transition cursor-pointer
                    ${role === ROLES.STUDENT ? 'border-blue-500 bg-blue-100 text-blue-500' : 'border-neutral-200'}`}
                        onPress={() => setRole(ROLES.STUDENT)}
                    >
                        <Image
                            alt=""
                            width={100}
                            height={100}
                            src="https://cdn3d.iconscout.com/3d/premium/thumb/illustration-students-are-using-laptops-5589412-4652813.png"
                        />
                        <div className="font-semibold mt-4 ">Học sinh</div>
                    </Card>

                    <Card
                        isPressable
                        className={`w-[240px] h-[180px] md:w-[200px] md:h-[140px] lg:w-[280px] lg:h-[200px] rounded-xl border-2 p-4 items-center flex flex-col gap-3 hover:border-blue-500 transition cursor-pointer
                    ${role === ROLES.TEACHER ? 'border-blue-500 bg-blue-100 text-blue-500' : 'border-neutral-200'}`}
                        onPress={() => setRole(ROLES.TEACHER)}
                    >
                        <Image
                            alt=""
                            width={100}
                            height={100}
                            src="https://cdn3d.iconscout.com/3d/premium/thumb/female-teacher-7640039-6186490.png"
                        />
                        <div className="font-semibold mt-4">Giáo viên</div>
                    </Card>
                </div>
                <div className="flex justify-center">
                    <button
                        onClick={handleNextStep}
                        className={`flex justify-center items-center w-[120px] h-[40px] sm:w-[200px] sm:h-[48px] text-xs sm:text-sm bg-blue-500 border-none outline-none rounded-full uppercase sm:font-semibold my-[10px] cursor-pointer 
                    ${role ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
                    >
                        <span className="mr-2">Tiếp theo</span>
                        <BsArrowRight size={20} color={role ? '#fff' : '#000'} className="w-[16px] sm:w-[20px]" />
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default RegisterChooseRole;
