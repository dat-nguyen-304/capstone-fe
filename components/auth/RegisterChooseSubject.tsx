import styles from '@/app/auth/page.module.css';
import { Dispatch, SetStateAction } from 'react';
import { BsArrowLeft, BsArrowRight } from 'react-icons/bs';
import { allSubjects } from '@/constants';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Subject } from '@/types';

interface RegisterChooseSubjectProps {
    role: string;
    setRole: Dispatch<SetStateAction<string>>;
    subjects: Subject[];
    setSubjects: Dispatch<SetStateAction<Subject[]>>;
    setIsFillForm: Dispatch<SetStateAction<boolean>>;
}

const RegisterChooseSubject: React.FC<RegisterChooseSubjectProps> = ({
    subjects,
    setSubjects,
    role,
    setRole,
    setIsFillForm
}) => {
    const title = role === 'student' ? 'Bạn muốn học môn' : 'Bạn là giáo viên môn';

    const animations = {
        div: {
            initial: {
                opacity: 0
            },
            whileInView: {
                opacity: 1
            }
        }
    };

    const addSubject = (subject: Subject) => {
        if (role === 'student') {
            let newSubjects = [...subjects];
            if (subjects.includes(subject)) {
                newSubjects = subjects.filter(s => s !== subject);
            } else {
                newSubjects = [...newSubjects, subject];
            }
            setSubjects(newSubjects);
        } else {
            setSubjects([subject]);
        }
    };

    const goToRegister = () => {
        if (subjects.length) setIsFillForm(true);
    };

    return (
        <motion.div {...animations.div} className={styles.signUpForm}>
            <h2 className={styles.title}>{title}</h2>

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

            <button
                onClick={goToRegister}
                className={`mt-8 w-[80%] flex items-center justify-center py-4 rounded-full 
                ${subjects.length > 0 ? 'text-white bg-blue-500' : 'text-black bg-gray-200'}`}
            >
                <span className="mr-4">Tiếp tục</span>
                <BsArrowRight size={20} color={subjects.length > 0 ? '#fff' : '#000'} />
            </button>

            <button onClick={() => setRole('')} className="flex justify-start items-center mt-8 cursor-pointer">
                <BsArrowLeft size={20} color="#333" />
                <span className="ml-4 text-gray-600">Quay lại</span>
            </button>
        </motion.div>
    );
};

export default RegisterChooseSubject;
