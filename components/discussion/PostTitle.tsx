'use client';

import { Button, User } from '@nextui-org/react';
import Image from 'next/image';
import { AiOutlineLike } from 'react-icons/ai';
import { BiSolidPencil } from 'react-icons/bi';
import { Gallery, Item } from 'react-photoswipe-gallery';
import 'photoswipe/dist/photoswipe.css';
import Link from 'next/link';
import HTMLReactParser from 'html-react-parser';

interface PostTitleProps {
    postContent: {
        id: number;
        title: string;
        content: string;
        image?: string;
        owner?: boolean;
        auth: string;
    };
    from: 'student' | 'teacher' | 'admin';
}

const PostTitle: React.FC<PostTitleProps> = ({ postContent, from }) => {
    return (
        <div className={`my-8 grid sm:grid-cols-10 rounded-xl ${postContent.title ? 'bg-blue-50' : ''}`}>
            <div className="hidden sm:block p-4 border-1 border-l-blue-500 border-t-blue-500 border-b-blue-500 col-span-2 rounded-s-xl">
                <User
                    name={'Jane Doe'}
                    description="2 giờ trước"
                    avatarProps={{
                        src: 'https://i.pravatar.cc/150?u=a04258114e29026702d'
                    }}
                />
            </div>
            <div className="p-4 border-1 border-blue-500 col-span-8 relative rounded-r-xl rounded-l-xl sm:rounded-l-none">
                <User
                    name={'Jane Doe'}
                    description="2 giờ trước"
                    avatarProps={{
                        src: 'https://i.pravatar.cc/150?u=a04258114e29026702d'
                    }}
                    className="sm:hidden"
                />
                <div>
                    <h4 className="font-semibold text-base mb-2">{postContent.title}</h4>
                    <div className="my-2">
                        <Gallery>
                            <Item original="/banner/slide-1.png" width="1024" height="768">
                                {({ open }) => (
                                    <Image
                                        onClick={open}
                                        src={postContent?.image || '/banner/slide-1.png'}
                                        width={100}
                                        height={80}
                                        alt=""
                                    />
                                )}
                            </Item>
                        </Gallery>
                    </div>
                    <span className="text-xs sm:text-sm">{HTMLReactParser(String(postContent?.content))}</span>
                </div>
                <div className="absolute flex items-center gap-2 bottom-2 right-4">
                    {postContent?.owner ? (
                        <Button
                            as={Link}
                            href={`${
                                from === 'student'
                                    ? '/discussion/edit/' + postContent?.id
                                    : '/teacher/discussion/edit/' + postContent?.id
                            }`}
                            size="sm"
                            variant="light"
                            className="text-yellow-500"
                        >
                            <span className="text-sm">Chỉnh sửa</span>
                            <BiSolidPencil className="cursor-pointer " />
                        </Button>
                    ) : null}

                    <AiOutlineLike className="cursor-pointer text-blue-500" />
                    <span className="text-sm text-blue-500">4</span>
                </div>
            </div>
        </div>
    );
};

export default PostTitle;
