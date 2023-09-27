import styles from '@/app/auth/page.module.css';
import { Dispatch, SetStateAction } from 'react';
import { BsArrowLeft, BsArrowRight } from 'react-icons/bs';
import { allCombinations } from '@/constants';
import { motion } from 'framer-motion';
import { Combination } from '@/types';

interface RegisterChooseCombinationProps {
    combinations: Combination[];
    setCombinations: Dispatch<SetStateAction<Combination[]>>;
    backStep: () => void;
    nextStep: () => void;
}

const RegisterChooseCombination: React.FC<RegisterChooseCombinationProps> = ({
    combinations,
    setCombinations,
    backStep,
    nextStep
}) => {
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

    const handleNextStep = () => {
        if (combinations.length) nextStep();
    };

    const addCombination = (combination: Combination) => {
        let newCombinations = [...combinations];
        if (combinations.includes(combination)) {
            newCombinations = combinations.filter(s => s !== combination);
        } else {
            newCombinations = [...newCombinations, combination];
        }
        setCombinations(newCombinations);
    };

    return (
        <motion.div {...animations.div} className={styles.signUpForm}>
            <h2 className={styles.title}>Bạn muốn thi tổ hợp</h2>

            <ul className="flex gap-3 mt-8 flex-wrap justify-center">
                {allCombinations.map(combination => (
                    <li
                        key={combination.value}
                        onClick={() => addCombination(combination)}
                        className={`w-[80px] sm:w-[120px] rounded-xl border-2 px-2 py-2 sm:py-4 sm:px-4 items-center flex flex-col gap-3 hover:border-blue-500 transition cursor-pointer
                        ${combinations.includes(combination) ? 'border-blue-500 bg-blue-100' : 'border-neutral-200'}`}
                    >
                        <div className="sm:font-semibold text-sm sm:text-md">{combination.label}</div>
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
                    ${combinations.length ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
                >
                    <span className="mr-2">Tiếp theo</span>
                    <BsArrowRight
                        size={20}
                        color={combinations.length > 0 ? '#fff' : '#000'}
                        className="w-[16px] sm:w-[20px]"
                    />
                </button>
            </div>
        </motion.div>
    );
};

export default RegisterChooseCombination;
