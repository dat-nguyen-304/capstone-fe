'use client';
import { Rate } from 'antd';

interface CourseInfoProps {}

const CourseInfo: React.FC<CourseInfoProps> = ({}) => {
    return (
        <>
            <h3 className="text-2xl font-semibold truncate">Lập trình C++ cơ bản</h3>
            <h3 className="text-l my-4 font-semibold truncate">Toán học - Cơ bản</h3>
            <div className="flex items-baseline my-2">
                <span className="text-base mr-2 font-bold">4.7</span>
                <Rate disabled allowHalf defaultValue={4.7} className="!text-xs" />
                <span className="text-xs ml-2">(100 đánh giá)</span>
                <span className="text-sm ml-2">200 học viên</span>
            </div>
            <p className="my-2 text-sm">Được tạo bởi Nguyễn Văn A</p>
            <p className="my-2 text-sm">Cập nhật gần đây nhất 9/2023</p>
            <p className="mt-8 text-sm">
                Khóa học lập trình C++ từ cơ bản tới nâng cao dành cho người mới bắt đầu. Mục tiêu của khóa học này nhằm
                giúp các bạn nắm được các khái niệm căn cơ của lập trình, giúp các bạn có nền tảng vững chắc để chinh
                phục con đường trở thành một lập trình viên.
            </p>
        </>
    );
};

export default CourseInfo;
