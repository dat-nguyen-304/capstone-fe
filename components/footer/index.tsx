import Image from 'next/image';
import Link from 'next/link';

interface FooterProps {}

const Footer: React.FC<FooterProps> = () => {
    return (
        <footer className="w-full h-auto mx-0 bg-[#F9F9F9]">
            <div className="pt-16 mx-auto w-[80%]">
                <div className="grid gap-10 row-gap-6 mb-8 grid-cols-1 md:grid-cols-3">
                    <div className="space-y-1 md:space-y-2">
                        <Link href="/" aria-label="Go home" title="Company" className="inline-flex items-center">
                            <Image
                                src="https://intaadvising.gatech.edu/wp-content/uploads/2020/11/cepa.png"
                                className="w-16 h-9"
                                width={200}
                                height={100}
                                alt=""
                            />
                            <span className="ml-2 text-xl font-bold tracking-wide text-gray-800 uppercase">CEPA</span>
                        </Link>
                        <div className="mt-6">
                            <p className="text-sm text-gray-800">Mã số doanh nghiệp: SE150694</p>
                            <p className="mt-4 text-sm text-gray-800">
                                Nền tảng ôn thi đại học tốt nhất - Công nghệ hàng đầu
                            </p>
                        </div>
                    </div>
                    <div className="space-y-1 md:space-y-2 text-sm">
                        <p className="text-base font-bold tracking-wide text-gray-900">Liên hệ</p>
                        <div className="flex">
                            <p className="mr-1 text-gray-800">Số điện thoại</p>
                            <a
                                href="tel:0522422411"
                                aria-label="Our phone"
                                title="Our phone"
                                className="transition-colors duration-300 text-deep-purple-accent-400 hover:text-deep-purple-800"
                            >
                                (+84)5 224 224 11
                            </a>
                        </div>
                        <div className="flex">
                            <p className="mr-1 text-gray-800">Email:</p>
                            <a
                                href="mailto:info@lorem.mail"
                                aria-label="Our email"
                                title="Our email"
                                className="transition-colors duration-300 text-deep-purple-accent-400 hover:text-deep-purple-800"
                            >
                                cepa.support@gmail.com
                            </a>
                        </div>
                        <div className="">
                            <p className="mr-1 text-gray-800">Địa chỉ:</p>
                            <p className="text-[13px] text-gray-800">
                                Lô E2a-7, Đường D1 Khu Công nghệ cao, Phường Long Thạnh Mỹ, Thủ Đức, TP. Hồ Chí Minh.
                            </p>
                            <br />
                        </div>
                    </div>
                    <div className="space-y-1 md:space-y-2">
                        <span className="text-base font-bold tracking-wide text-gray-900">Kết nối</span>
                        <div className="flex items-center mt-1 space-x-3">
                            <a
                                href="/"
                                className="text-gray-500 transition-colors duration-300 hover:text-deep-purple-accent-400"
                            >
                                <svg viewBox="0 0 24 24" fill="currentColor" className="h-5">
                                    <path d="M22,0H2C0.895,0,0,0.895,0,2v20c0,1.105,0.895,2,2,2h11v-9h-3v-4h3V8.413c0-3.1,1.893-4.788,4.659-4.788 c1.325,0,2.463,0.099,2.795,0.143v3.24l-1.918,0.001c-1.504,0-1.795,0.715-1.795,1.763V11h4.44l-1,4h-3.44v9H22c1.105,0,2-0.895,2-2 V2C24,0.895,23.105,0,22,0z"></path>
                                </svg>
                            </a>
                            <a
                                href="/"
                                className="text-gray-500 transition-colors duration-300 hover:text-deep-purple-accent-400"
                            >
                                <svg viewBox="0 0 30 30" fill="currentColor" className="h-6">
                                    <circle cx="15" cy="15" r="4"></circle>
                                    <path d="M19.999,3h-10C6.14,3,3,6.141,3,10.001v10C3,23.86,6.141,27,10.001,27h10C23.86,27,27,23.859,27,19.999v-10   C27,6.14,23.859,3,19.999,3z M15,21c-3.309,0-6-2.691-6-6s2.691-6,6-6s6,2.691,6,6S18.309,21,15,21z M22,9c-0.552,0-1-0.448-1-1   c0-0.552,0.448-1,1-1s1,0.448,1,1C23,8.552,22.552,9,22,9z"></path>
                                </svg>
                            </a>
                        </div>
                        <p className="mt-4 text-sm text-gray-500">
                            Kết nối và theo dõi CEPA trên các nền tảng xã hội để cập nhật tin tức, xu hướng cùng những
                            ưu đãi mới nhất!
                        </p>
                    </div>
                </div>
                <div className="flex flex-col-reverse justify-between pt-5 pb-10 border-t lg:flex-row">
                    <p className="text-sm text-gray-600">© Copyright 2023 Cepa Inc. All rights reserved.</p>
                    <ul className="flex flex-col mb-3 space-y-2 lg:mb-0 sm:space-y-0 sm:space-x-5 sm:flex-row">
                        <li>
                            <a
                                href="/"
                                className="text-sm text-gray-600 transition-colors duration-300 hover:text-deep-purple-accent-400"
                            >
                                F.A.Q
                            </a>
                        </li>
                        <li>
                            <a
                                href="/"
                                className="text-sm text-gray-600 transition-colors duration-300 hover:text-deep-purple-accent-400"
                            >
                                Chính sách &amp; Điều kiện
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
