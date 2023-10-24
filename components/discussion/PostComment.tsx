'use client';

import { User } from '@nextui-org/react';
import { AiOutlineLike } from 'react-icons/ai';

interface PostCommentProps {
    title?: string;
}

const PostComment: React.FC<PostCommentProps> = ({ title = '' }) => {
    return (
        <div className={`my-8 grid sm:grid-cols-10 rounded-xl ${title ? 'bg-blue-50' : ''}`}>
            <div className="hidden sm:block p-4 border-1 border-l-blue-500 border-t-blue-500 border-b-blue-500 col-span-2 rounded-s-xl">
                <User
                    name="Jane Doe"
                    description="2 giờ trước"
                    avatarProps={{
                        src: 'https://i.pravatar.cc/150?u=a04258114e29026702d'
                    }}
                />
            </div>
            <div className="p-4 border-1 border-blue-500 col-span-8 relative rounded-r-xl rounded-l-xl sm:rounded-l-none">
                <User
                    name="Jane Doe"
                    description="2 giờ trước"
                    avatarProps={{
                        src: 'https://i.pravatar.cc/150?u=a04258114e29026702d'
                    }}
                    className="sm:hidden"
                />
                <div className="text-sm">
                    <h4 className="font-bold mb-2">{title}</h4>
                    <span>Hello how are you</span>
                </div>
                <div className="absolute flex items-center gap-2 bottom-2 right-4">
                    <AiOutlineLike className="cursor-pointer text-blue-500" />
                    <span className="text-sm text-blue-500">4</span>
                </div>
            </div>
        </div>
    );
};

export default PostComment;
