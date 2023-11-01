import { Card, CardBody, CardHeader } from '@nextui-org/react';
import { Progress, Rate } from 'antd';
import Image from 'next/image';
import Link from 'next/link';
import { BiSolidLike } from 'react-icons/bi';

interface VideoCardProps {
    isTeacherVideo?: boolean;
}

const VideoCard: React.FC<VideoCardProps> = ({ isTeacherVideo }) => {
    let detailPage = '';
    if (isTeacherVideo) detailPage = '/teacher/video/1';
    else detailPage = '/video/1';
    return (
        <div className="flex justify-center w-full">
            <Card shadow="sm" isPressable className="w-full max-w-[216px] mt-4 mx-1">
                <Link href={detailPage}>
                    <CardHeader className="overflow-visible p-0 h-[120px] relative">
                        <Image
                            height={200}
                            width={200}
                            alt=""
                            className="w-full object-contain h-[120px]"
                            src="/banner/slide-1.png"
                        />
                        <div className="absolute bottom-0 right-1 text-xs text-white bg-gray-600 rounded-md p-1">
                            12:30
                        </div>
                    </CardHeader>
                    <CardBody className="text-small justify-between p-4">
                        <b className="text-[15px] h-[40px] font-semibold truncate2line text-black">
                            Khóa học lấy gốc thần tốc
                        </b>
                        <div className="mt-1 text-xs">
                            <span className="text-black">2 tháng trước</span>
                            <span className="before:content-['•'] before:inline-block before:text-gray-500 inline-flex item before:mx-2 text-black">
                                <span className="text-black">120</span>
                                <BiSolidLike className="text-sm text-blue-300 ml-2" />
                            </span>
                        </div>
                    </CardBody>
                </Link>
            </Card>
        </div>
    );
};

export default VideoCard;
