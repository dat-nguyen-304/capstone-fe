'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { vertical } from '@/animations';

interface StepsProps {}

const Steps: React.FC<StepsProps> = () => {
    return (
        <motion.div {...vertical(100, 0.5, 0)} className="my-16 md:px-16 px-0 container mx-auto relative">
            <h2 className="text-center font-bold md:text-3xl text-2xl md:leading-normal mb-10">
                Bắt đầu
                <span className="text-primary"> dễ dàng</span> với 3 bước
            </h2>
            <div className="flex justify-center md:flex-row flex-col">
                <motion.div {...vertical(100, 0.5, 0.1)} className="flex flex-col items-center">
                    <div className="bg-blue-600 inline-block p-4 rounded-md">
                        <Image src="/steps/choose.png" alt="" width={40} height={40} />
                    </div>
                    <div className="mt-4 relative flex flex-col items-center">
                        <p className="font-semibold relative z-10 text-center">
                            Chọn chương trình <br /> học bạn mong muốn
                        </p>
                        <span className="font-bold block text-9xl relative z-0 -mt-14 text-gray-200">1</span>
                    </div>
                </motion.div>
                <motion.div {...vertical(100, 0.5, 0.25)} className="md:flex flex-col items-center pt-10 hidden">
                    <Image src="/steps/arrow-1.avif" alt="" width={200} height={80} />
                </motion.div>
                <motion.div {...vertical(100, 0.5, 0.4)} className="flex flex-col items-center pt-16">
                    <div className="bg-blue-600 inline-block p-4 rounded-md">
                        <Image src="/steps/pay.png" alt="" width={40} height={40} />
                    </div>
                    <div className="mt-4 relative flex flex-col items-center">
                        <p className="font-semibold relative z-10 text-center">
                            Tiến hành thanh toán <br /> học phí
                        </p>
                        <span className="font-bold block text-9xl relative z-0 -mt-14 text-gray-200">2</span>
                    </div>
                </motion.div>
                <motion.div {...vertical(100, 0.5, 0.55)} className="md:flex flex-col items-center pt-16 hidden">
                    <Image src="/steps/arrow-2.avif" alt="" width={200} height={80} />
                </motion.div>
                <motion.div {...vertical(100, 0.5, 0.7)} className="flex flex-col items-center md:pt-40 pt-16">
                    <div className="bg-blue-600 inline-block p-4 rounded-md">
                        <Image src="/steps/screen.png" alt="" width={40} height={40} />
                    </div>
                    <div className="mt-4 relative flex flex-col items-center">
                        <p className="font-semibold relative z-10 text-center">
                            Vào Khoá học của tôi
                            <br /> để bắt đầu học ngay
                        </p>
                        <span className="font-bold block text-9xl relative z-0 -mt-14 text-gray-200">3</span>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default Steps;
