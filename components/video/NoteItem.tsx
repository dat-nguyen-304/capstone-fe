'use client';

import { Chip } from '@nextui-org/react';
import { BiSolidPencil } from 'react-icons/bi';
import { BsTrash3 } from 'react-icons/bs';

interface NoteItemProps {
    time: string;
}

const NoteItem: React.FC<NoteItemProps> = ({ time }) => {
    return (
        <li className="mt-8">
            <div className="flex justify-between items-center">
                <Chip className="text-sm sm:text-base cursor-pointer" color="primary">
                    {time}
                </Chip>
                <div className="flex items-center text-lg gap-5">
                    <div className="flex justify-center items-center p-2 my-1 rounded-full bg-yellow-50 cursor-pointer">
                        <BiSolidPencil className="text-yellow-500 text-sm sm:text-base" />
                    </div>
                    <div className="flex justify-center items-center p-2 my-1 rounded-full bg-red-50 cursor-pointer">
                        <BsTrash3 className="text-red-700 text-sm sm:text-base" />
                    </div>
                </div>
            </div>
            <div className="bg-blue-50 rounded-xl p-4">
                <span className="text-xs sm:text-sm">Hello how are you</span>
            </div>
        </li>
    );
};

export default NoteItem;
