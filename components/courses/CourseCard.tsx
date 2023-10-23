import { Card, CardBody, CardHeader } from '@nextui-org/react';
import { Progress, Rate } from 'antd';
import Image from 'next/image';
import styles from '@/app/courses/page.module.css';
import Link from 'next/link';

interface CourseCardProps {
    isMyCourse?: boolean;
}

const CourseCard: React.FC<CourseCardProps> = ({ isMyCourse }) => {
    return (
        <div className="flex justify-center w-full">
            <Card shadow="sm" isPressable className="w-full max-w-[320px] mt-4 mx-1">
                <Link href={isMyCourse ? '/my-courses/1' : '/courses/1'}>
                    <CardHeader className="overflow-visible p-0 h-[200px] ">
                        <Image
                            height={300}
                            width={300}
                            alt=""
                            className="w-full object-cover h-[140px]"
                            src="/banner/slide-1.png"
                        />
                    </CardHeader>
                    <CardBody className="text-small justify-between">
                        <b className={`text-[15px] h-[40px] ${styles.truncate}`}>Khóa học lấy gốc thần tốc</b>
                        <p className="mt-2 text-sm">Nguyễn Văn An</p>
                        <div className="flex items-baseline mt-1">
                            <span className="text-base mr-2 font-bold">4.7</span>
                            <Rate disabled allowHalf defaultValue={4.7} className="!text-xs" />
                            <span className="text-xs ml-2">(100)</span>
                        </div>
                        <div className="mt-1 text-xs">
                            <span>50 bài giảng</span>
                            <span className="before:content-['•'] before:inline-block before:text-gray-500 before:mx-2">
                                Cơ bản
                            </span>
                        </div>
                        {isMyCourse ? (
                            <div className="w-full mt-2">
                                <Progress className="w-full" percent={30} />
                            </div>
                        ) : (
                            <p className="mt-1 text-[#333] font-bold text-base">₫ 400.000</p>
                        )}
                    </CardBody>
                </Link>
            </Card>
        </div>
    );
};

export default CourseCard;
