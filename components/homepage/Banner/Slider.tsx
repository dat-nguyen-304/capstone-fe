'use client';

import { Carousel } from 'antd';
import Image from 'next/image';

interface SliderProps {}

const Slider: React.FC<SliderProps> = () => {
    return (
        <div className="mt-10 sm:mt-0 w-full sm:w-6/12 lg:w-7/12 flex items-center justify-center">
            <Carousel autoplay className="w-[280px] sm:w-[392px] lg:w-[560px] xl:w-[700px]">
                <div>
                    <div className="h-[200px] sm:h-[280px] lg:h-[400px] xl:h-[500px] w-[280px] sm:w-[392px] lg:w-[560px] xl:w-[700px] flex items-center justify-center">
                        <Image
                            src="https://www.ninjatropic.com/wp-content/uploads/2022/11/BloR13-2.png"
                            alt=""
                            width={1000}
                            height={562}
                            className="object-cover"
                        />
                    </div>
                </div>
                <div>
                    <div className="h-[200px] sm:h-[280px] lg:h-[400px] xl:h-[500px] w-[280px] sm:w-[392px] lg:w-[560px] xl:w-[700px] flex items-center justify-center">
                        <Image
                            src="https://www.ninjatropic.com/wp-content/uploads/2022/11/BloR9-4.png"
                            alt=""
                            width={1000}
                            height={562}
                        />
                    </div>
                </div>
                <div>
                    <div className="h-[200px] sm:h-[280px] lg:h-[400px] xl:h-[500px] w-[280px] sm:w-[392px] lg:w-[560px] xl:w-[700px] flex items-center justify-center">
                        <Image
                            src="https://www.ninjatropic.com/wp-content/uploads/2022/11/BloR10-1.png"
                            alt=""
                            width={951}
                            height={466}
                        />
                    </div>
                </div>
                <div>
                    <div className="h-[200px] sm:h-[280px] lg:h-[400px] xl:h-[500px] w-[280px] sm:w-[392px] lg:w-[560px] xl:w-[700px] flex items-center justify-center">
                        <Image
                            src="https://www.ninjatropic.com/wp-content/uploads/2022/12/RED-Blog-R25_BloF1-4.png"
                            alt=""
                            width={951}
                            height={466}
                        />
                    </div>
                </div>
                <div>
                    <div className="h-[200px] sm:h-[280px] lg:h-[400px] xl:h-[500px] w-[280px] sm:w-[392px] lg:w-[560px] xl:w-[700px] flex items-center justify-center">
                        <Image
                            src="https://www.ninjatropic.com/wp-content/uploads/2022/12/BloR25-2.png"
                            alt=""
                            width={951}
                            height={466}
                        />
                    </div>
                </div>
            </Carousel>
        </div>
    );
};

export default Slider;
