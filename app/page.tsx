import Header from '@/components/header/Header';

export default function Home() {
    return (
        <>
            <Header currentUser={{ email: 'a@gmail.com' }} />
            <div>Trang chủ</div>
        </>
    );
}
