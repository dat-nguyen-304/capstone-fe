'use client';

import { motion } from 'framer-motion';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';
import { Avatar } from '@nextui-org/react';
import { Rate } from 'antd';
import { vertical } from '@/animations';

interface CommentProps {}

const Comment: React.FC<CommentProps> = () => {
    const defaultContent =
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';
    return (
        <motion.div {...vertical(50, 0.5, 0)} className="w-[80%] py-[40px] mx-auto">
            <div className="text-center mb-8">
                <div className="mb-2">
                    <span className="font-bold md:text-3xl text-2xl md:leading-normal text-black">
                        Học sinh nói gì về
                    </span>
                    <span className="font-bold md:text-3xl text-2xl md:leading-normal text-primary"> Cepa.com</span>
                </div>
            </div>
            <Splide
                hasTrack
                options={{
                    type: 'loop',
                    padding: '5rem',
                    autoplay: true
                }}
            >
                <SplideSlide className="md:!w-[500px] rounded-xl h-[240px] sm:border-1 !mx-0 sm:!mx-2">
                    <div className="md:p-4">
                        <div className="p-2 flex">
                            <Avatar src="https://i.pravatar.cc/150?u=a04258114e29026708c" className="w-12 h-12" />
                            <div className="ml-4">
                                <p className="text-sm font-semibold">Nguyễn Văn A</p>
                                <div>
                                    <Rate className="!text-xs sm:text-base" disabled defaultValue={5} />
                                </div>
                            </div>
                        </div>
                        <div className="p-2 text-sm text-justify">{defaultContent}</div>
                    </div>
                </SplideSlide>
                <SplideSlide className="md:!w-[500px] rounded-xl h-[240px] sm:border-1 !mx-0 sm:!mx-2">
                    <div className="md:p-4">
                        <div className="p-2 flex">
                            <Avatar src="https://i.pravatar.cc/150?u=a04258114e29026708c" className="w-12 h-12" />
                            <div className="ml-4">
                                <p className="text-sm font-semibold">Nguyễn Văn A</p>
                                <div>
                                    <Rate className="!text-xs sm:text-base" disabled defaultValue={5} />
                                </div>
                            </div>
                        </div>
                        <div className="p-2 text-sm text-justify">{defaultContent}</div>
                    </div>
                </SplideSlide>
                <SplideSlide className="md:!w-[500px] rounded-xl h-[240px] sm:border-1 !mx-0 sm:!mx-2">
                    <div className="md:p-4">
                        <div className="p-2 flex">
                            <Avatar src="https://i.pravatar.cc/150?u=a04258114e29026708c" className="w-12 h-12" />
                            <div className="ml-4">
                                <p className="text-sm font-semibold">Nguyễn Văn A</p>
                                <div>
                                    <Rate className="!text-xs sm:text-base" disabled defaultValue={5} />
                                </div>
                            </div>
                        </div>
                        <div className="p-2 text-sm text-justify">{defaultContent}</div>
                    </div>
                </SplideSlide>
                <SplideSlide className="md:!w-[500px] rounded-xl h-[240px] sm:border-1 !mx-0 sm:!mx-2">
                    <div className="md:p-4">
                        <div className="p-2 flex">
                            <Avatar src="https://i.pravatar.cc/150?u=a04258114e29026708c" className="w-12 h-12" />
                            <div className="ml-4">
                                <p className="text-sm font-semibold">Nguyễn Văn A</p>
                                <div>
                                    <Rate className="!text-xs sm:text-base" disabled defaultValue={5} />
                                </div>
                            </div>
                        </div>
                        <div className="p-2 text-sm text-justify">{defaultContent}</div>
                    </div>
                </SplideSlide>
                <SplideSlide className="md:!w-[500px] rounded-xl h-[240px] sm:border-1 !mx-0 sm:!mx-2">
                    <div className="md:p-4">
                        <div className="p-2 flex">
                            <Avatar src="https://i.pravatar.cc/150?u=a04258114e29026708c" className="w-12 h-12" />
                            <div className="ml-4">
                                <p className="text-sm font-semibold">Nguyễn Văn A</p>
                                <div>
                                    <Rate className="!text-xs sm:text-base" disabled defaultValue={5} />
                                </div>
                            </div>
                        </div>
                        <div className="p-2 text-sm text-justify">{defaultContent}</div>
                    </div>
                </SplideSlide>
                <SplideSlide className="md:!w-[500px] rounded-xl h-[240px] sm:border-1 !mx-0 sm:!mx-2">
                    <div className="md:p-4">
                        <div className="p-2 flex">
                            <Avatar src="https://i.pravatar.cc/150?u=a04258114e29026708c" className="w-12 h-12" />
                            <div className="ml-4">
                                <p className="text-sm font-semibold">Nguyễn Văn A</p>
                                <div>
                                    <Rate className="!text-xs sm:text-base" disabled defaultValue={5} />
                                </div>
                            </div>
                        </div>
                        <div className="p-2 text-sm text-justify ">{defaultContent}</div>
                    </div>
                </SplideSlide>
            </Splide>
        </motion.div>
    );
};

export default Comment;
