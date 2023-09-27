import styles from '@/app/auth/page.module.css';
import { Dispatch, SetStateAction } from 'react';
import { BsArrowLeft, BsArrowRight } from 'react-icons/bs';
import { allSubjects } from '@/constants';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Subject } from '@/types';

interface RegisterChooseSubjectProps {
    subjects: Subject[];
    setSubjects: Dispatch<SetStateAction<Subject[]>>;
    backStep: () => void;
    nextStep: () => void;
}

const RegisterChooseSubject: React.FC<RegisterChooseSubjectProps> = ({ subjects, setSubjects, nextStep, backStep }) => {
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
        if (subjects.length) nextStep();
    };

    const addSubject = (subject: Subject) => {
        let newSubjects = [...subjects];
        if (subjects.includes(subject)) {
            newSubjects = subjects.filter(s => s !== subject);
        } else {
            newSubjects = [...newSubjects, subject];
        }
        setSubjects(newSubjects);
    };

    return (
        <div className={styles.signUpForm}>
            <motion.div {...animations.div}>
                <h2 className={styles.title}>Bạn là giáo viên môn</h2>
                <ul className="flex gap-3 mt-8 flex-wrap justify-center">
                    {allSubjects.map(subject => (
                        <li
                            key={subject.value}
                            onClick={() => addSubject(subject)}
                            className={`w-[100px] sm:w-[120px] rounded-xl border-2 px-2 py-2 sm:py-4 sm:px-4 items-center flex flex-col gap-3 hover:border-blue-500 transition cursor-pointer
                        ${subjects.includes(subject) ? 'border-blue-500 bg-blue-100' : 'border-neutral-200'}`}
                        >
                            <Image alt="" width={30} height={30} src={subject.img} />
                            <div className="sm:font-semibold text-sm sm:text-md">{subject.label}</div>
                        </li>
                    ))}
                </ul>

                <div className="flex justify-center items-center gap-2 sm:gap-4 mt-8">
                    <button
                        onClick={backStep}
                        className="flex justify-center items-center w-[120px] h-[40px] sm:w-[200px] sm:h-[48px] text-xs sm:text-sm border-2 border-gray-300 rounded-full text-white uppercase sm:font-semibold my-[10px] cursor-pointer"
                    >
                        <BsArrowLeft size={20} color="#333" className="w-[16px] sm:w-[20px]" />
                        <span className="ml-2 text-gray-600">Quay lại</span>
                    </button>
                    <button
                        onClick={handleNextStep}
                        className={`flex justify-center items-center w-[120px] h-[40px] sm:w-[200px] sm:h-[48px] text-xs sm:text-sm bg-blue-500 border-none outline-none rounded-full uppercase sm:font-semibold my-[10px] cursor-pointer 
                    ${subjects.length ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
                    >
                        <span className="mr-2">Tiếp theo</span>
                        <BsArrowRight
                            size={20}
                            color={subjects.length > 0 ? '#fff' : '#000'}
                            className="w-[16px] sm:w-[20px]"
                        />
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default RegisterChooseSubject;
