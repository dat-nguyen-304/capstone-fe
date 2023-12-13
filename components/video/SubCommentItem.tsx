'use client';

import { discussionApi } from '@/api-client';
import { Avatar, Tooltip } from '@nextui-org/react';
import { AiOutlineLike } from 'react-icons/ai';
import { BiDotsHorizontalRounded } from 'react-icons/bi';
import { CiFlag1 } from 'react-icons/ci';
import { toast } from 'react-toastify';

interface SubCommentItemProps {
    subCommentInfo: any;
    refetch?: any;
}

const SubCommentItem: React.FC<SubCommentItemProps> = ({ subCommentInfo, refetch }) => {
    const handleLikeClick = async () => {
        let toastLoading;
        try {
            toastLoading = toast.loading('Đang xử lí yêu cầu');
            // Assuming postContent.id is the discussionId
            if (subCommentInfo?.reacted) {
                const response = await discussionApi.commentRemoveReact(subCommentInfo?.id);
                refetch();
                if (response) {
                    toast.success('Tương tác thành công');
                }
                toast.dismiss(toastLoading);
            } else {
                const response = await discussionApi.commentReact(subCommentInfo?.id);
                refetch();
                if (response) {
                    toast.success('Tương tác thành công');
                }
                toast.dismiss(toastLoading);
            }
        } catch (error) {
            // Handle errors
            toast.dismiss(toastLoading);
            toast.error('Hệ thống gặp trục trặc, thử lại sau ít phút');
            console.error('Error reacting to discussion:', error);
        }
    };
    const dateValue = subCommentInfo?.createTime ? new Date(subCommentInfo?.createTime) : new Date();

    const formattedDate = new Intl.DateTimeFormat('en-GB', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
    })?.format(dateValue);
    const defaultContent =
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';
    return (
        <li className="flex gap-4 group mb-4">
            <div>
                <Avatar src={subCommentInfo?.ownerAvatar || 'https://i.pravatar.cc/150?u=a04258114e29026708c'} />
            </div>
            <div className="w-full">
                <div className="bg-gray-50 pt-2 pb-4 px-4 rounded-xl">
                    {/* <h4 className="font-semibold">{subCommentInfo?.ownerFullName || 'Nguyễn Văn An'}</h4> */}
                    <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-sm sm:text-base">{subCommentInfo?.ownerFullName}</h4>
                        <p className="text-xs sm:text-sm">{formattedDate}</p>
                    </div>
                    <p className="text-sm"> {subCommentInfo?.content || defaultContent}</p>
                </div>
                <div className="mt-1 flex gap-4 items-center">
                    <span className="flex items-center gap-2">
                        <AiOutlineLike
                            className={`${
                                !subCommentInfo?.reacted
                                    ? 'cursor-pointer hover:scale-110 transition-transform duration-200 ease-in-out'
                                    : subCommentInfo?.reacted
                                    ? 'cursor-pointer text-blue-500 hover:scale-110 transition-transform duration-200 ease-in-out'
                                    : ''
                            }`}
                            onClick={handleLikeClick}
                        />

                        <span className="text-sm">{subCommentInfo?.reactCount}</span>
                    </span>
                    {/* <p className="text-sm">Phản hồi</p> */}
                    {/* <Tooltip
                        placement="right"
                        content={
                            <div className="p-1 cursor-pointer">
                                <span className="flex items-center gap-2">
                                    <CiFlag1 /> Báo cáo vi phạm
                                </span>
                            </div>
                        }
                    >
                        <button type="button" className="group-hover:flex hidden h-[12px] !w-[20px]">
                            <BiDotsHorizontalRounded />
                        </button>
                    </Tooltip> */}
                </div>
            </div>
        </li>
    );
};

export default SubCommentItem;
