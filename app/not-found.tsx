import Image from 'next/image';

const NotFound = () => {
    return (
        <div className="flex justify-center items-center h-[100vh]">
            <Image src="https://dienmaycongthanh.vn/img/Main/trang_404.png" alt="" width="500" height="500" />;
        </div>
    );
};

export default NotFound;
