'use client';

import { useState } from 'react';
import { PuffLoader } from 'react-spinners';

interface LoaderLayerProps {
    isOpen: boolean;
}

const LoaderLayer: React.FC<LoaderLayerProps> = ({ isOpen }) => {
    if (!isOpen) return <></>;
    return (
        <div className="fixed z-[1000] top-0 left-0 right-0 bottom-0 bg-[rgba(0,0,0,0.2)] flex flex-col justify-center items-center">
            <PuffLoader size={100} color="blue" />
        </div>
    );
};

export default LoaderLayer;
