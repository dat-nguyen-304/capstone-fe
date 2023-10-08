'use client';

import Image from 'next/image';

interface AboutMeProps {}

const AboutMe: React.FC<AboutMeProps> = () => {
    return (
        <div className="mx-auto w-full sm:w-[80%] my-16">
            <h1 className="my-4 font-bold md:text-3xl text-2xl md:leading-normal text-center text-black">
                Về <span className="text-primary">Cepa</span>
            </h1>
            <div className="flex">
                <div className="hidden md:w-1/3 xl:w-1/2 md:flex justify-center items-center">
                    <Image src="/about-me/about-me.webp" alt="" width={200} height={500} />
                </div>
                <div className="w-full md:w-2/3 xl:w-1/2">
                    <div className="grid grid-cols-6 p-2 sm:p-4 sm:p-4 items-center">
                        <div className="p-2 sm:p-4 col-span-1">
                            <Image src="/about-me/teacher.png" alt="" width={100} height={100} />
                        </div>
                        <div className="p-2 sm:p-4 text-xs sm:text-sm col-span-5">
                            Tại CEPA, chúng tôi tin tưởng vào việc cá nhân hóa trải nghiệm học tập. Nền tảng của chúng
                            tôi mang đến hướng tiếp cận toàn diện với lịch sử kỳ thi, giúp bạn xác định điểm mạnh và
                            điểm yếu của mình và cung cấp tài liệu cần thiết để đạt được thành công.
                        </div>
                    </div>
                    <div className="grid grid-cols-6 p-2 sm:p-4 sm:p-4 items-center">
                        <div className="p-2 sm:p-4 col-span-1">
                            <Image src="/about-me/book.png" alt="" width={100} height={100} />
                        </div>
                        <div className="p-2 sm:p-4 text-xs sm:text-sm col-span-5">
                            Với CEPA, bạn có cơ hội tiếp cận tài liệu đa dạng, bao gồm các bài kiểm tra mẫu dựa trên
                            tiêu chuẩn của Bộ Giáo dục, kế hoạch học tập cá nhân và các diễn đàn theo chuyên ngành. Phản
                            hồi chi tiết và gợi ý cá nhân đảm bảo rằng việc chuẩn bị của bạn diễn ra đúng hướng
                        </div>
                    </div>
                    <div className="grid grid-cols-6 p-2 sm:p-4 sm:p-4 items-center">
                        <div className="p-2 sm:p-4 col-span-1">
                            <Image src="/about-me/exam.png" alt="" width={100} height={100} />
                        </div>
                        <div className="p-2 sm:p-4 text-xs sm:text-sm col-span-5">
                            Ứng dụng Luyện thi Đại học CEPA được thiết kế để giúp sinh viên trên hành trình đến thành
                            công học thuật. Nền tảng của chúng tôi là hướng dẫn toàn diện của bạn để vượt qua các kỳ thi
                            đại học.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutMe;
