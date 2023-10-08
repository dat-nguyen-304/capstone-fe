import styles from '@/app/auth/page.module.css';
import { Dispatch, SetStateAction } from 'react';
import { BsArrowLeft, BsArrowRight } from 'react-icons/bs';
import { motion } from 'framer-motion';
import { Combination } from '@/types';
import { combinationApi } from '@/api-client';
import { useQuery } from '@tanstack/react-query';
import { Card, Skeleton, Tooltip } from '@nextui-org/react';
import { horizontal } from '@/animations';

interface RegisterChooseCombinationProps {
    combinationIds: number[];
    setCombinationIds: Dispatch<SetStateAction<number[]>>;
    backStep: () => void;
    nextStep: () => void;
}

const RegisterChooseCombination: React.FC<RegisterChooseCombinationProps> = ({
    combinationIds,
    setCombinationIds,
    backStep,
    nextStep
}) => {
    const { data, isLoading } = useQuery({
        queryKey: ['combinationIds'],
        queryFn: combinationApi.getAll
    });

    const skeletonArray: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];

    const handleNextStep = () => {
        if (combinationIds.length) nextStep();
    };

    const addCombination = (combinationId: number) => {
        let newCombinationIds = [...combinationIds];
        if (combinationIds.includes(combinationId)) {
            newCombinationIds = combinationIds.filter(s => s !== combinationId);
        } else {
            newCombinationIds = [...newCombinationIds, combinationId];
        }
        setCombinationIds(newCombinationIds);
    };

    return (
        <div className={styles.signUpForm}>
            <motion.div {...horizontal(50, 0.3, 0)}>
                <h2 className={styles.title}>Bạn muốn thi tổ hợp</h2>

                <ul className="flex gap-3 mt-8 flex-wrap justify-center">
                    {!isLoading ? (
                        <>
                            {data?.map((combination: Combination) => (
                                <Tooltip key={combination.id} color="primary" content={combination.description}>
                                    <li>
                                        <Card
                                            isPressable
                                            onPress={() => addCombination(combination.id)}
                                            className={`w-[80px] sm:w-[120px] rounded-xl border-2 px-2 py-2 sm:py-4 sm:px-4 items-center flex flex-col gap-3 hover:border-blue-500 transition cursor-pointer
                                    ${
                                        combinationIds.includes(combination.id)
                                            ? 'border-blue-500 bg-blue-100 text-blue-500'
                                            : 'border-neutral-200'
                                    }`}
                                        >
                                            <div className="sm:font-semibold text-sm sm:text-md">
                                                {combination.name}
                                            </div>
                                        </Card>
                                    </li>
                                </Tooltip>
                            ))}
                        </>
                    ) : (
                        <>
                            {skeletonArray.map((i: number) => (
                                <Skeleton key={i} isLoaded={false} className="rounded-xl">
                                    <li className="w-[80px] sm:w-[120px] h-[52px] rounded-xl px-2 py-2 sm:py-4 sm:px-4"></li>
                                </Skeleton>
                            ))}
                        </>
                    )}
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
                    ${combinationIds.length ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
                    >
                        <span className="mr-2">Tiếp theo</span>
                        <BsArrowRight
                            size={20}
                            color={combinationIds.length > 0 ? '#fff' : '#000'}
                            className="w-[16px] sm:w-[20px]"
                        />
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default RegisterChooseCombination;
