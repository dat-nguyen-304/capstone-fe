'use client';

import { Avatar, AvatarGroup, Button } from '@nextui-org/react';
import { motion } from 'framer-motion';
import { horizontal, vertical } from '@/animations';

interface TitleProps {}

const Title: React.FC<TitleProps> = () => {
    return (
        <div className="w-full sm:w-6/12 lg:w-5/12 flex items-center justify-center">
            <div>
                <motion.div {...horizontal(-100, 0.5, 0)} className="text-center sm:text-left">
                    <h1 className="flex flex-col">
                        <b className="text-black text-3xl lg:text-5xl font-bold mb-4 mt-16 sm:mt-0">
                            Lộ Trình Luyện Thi
                        </b>
                        <b className="font-bold text-3xl lg:text-5xl mb-4 sm:mt-0 text-[#0071f9]">THPTQG</b>
                        <b className="text-3xl lg:text-5xl text-black font-bold mb-4 sm:mt-0">Toàn diện!</b>
                    </h1>
                    <div className="text-black font-semibold text-[15px]">
                        <p>Học ngay đỗ ngay đại học</p>
                    </div>
                </motion.div>
                <motion.div {...vertical(-100, 0.5, 0)} className="flex flex-col justify-start">
                    <Button
                        size="lg"
                        className="!text-white font-bold w-full sm:w-auto rounded-xl py-7 text-lg my-5 text-20 bg-[#0071F9]"
                    >
                        Xây lộ trình cho tôi
                    </Button>
                </motion.div>
                <motion.div {...vertical(-100, 0.5, 0)} className="flex items-center justify-center sm:justify-start">
                    <AvatarGroup isBordered max={3} total={10}>
                        <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026024d" />
                        <Avatar src="https://i.pravatar.cc/150?u=a04258a2462d826712d" />
                        <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026704d" />
                        <Avatar src="https://i.pravatar.cc/150?u=a04258114e29026302d" />
                        <Avatar src="https://i.pravatar.cc/150?u=a04258114e29026702d" />
                        <Avatar src="https://i.pravatar.cc/150?u=a04258114e29026708c" />
                    </AvatarGroup>
                    <div className="ml-6 text-left">
                        <p className="text-black font-extrabold text-xl sm:text-2xl">500+</p>
                        <p className="text-black text-sm">Học sinh đã tham gia với chúng tôi</p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Title;
