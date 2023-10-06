'use client';

import Image from 'next/image';
import Slider from './Slider';
import Title from './Title';

interface TitleAndSliderProps {}

const TitleAndSlider: React.FC<TitleAndSliderProps> = () => {
    return (
        <div className=" md:py-20 lg:py-0 lg:pb-20 bg-blue-50">
            <div className="mx-auto px-5 md:px-20 flex flex-col sm:flex-row py-10">
                <Title />
                <Slider />
            </div>
        </div>
    );
};

export default TitleAndSlider;
