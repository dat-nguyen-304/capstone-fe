import Footer from '@/components/footer/Footer';
import Header from '@/components/header/Header';
import Banner from '@/components/homepage/Banner/Banner';

export default function Home() {
    return (
        <>
            <Header currentUser={{ email: 'a@gmail.com' }} />
            <Banner />
            <Footer />
        </>
    );
}
