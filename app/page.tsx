import Header from '@/components/header/Header';
import TitleAndSlider from '@/components/homepage/Banner/Banner';

export default function Home() {
    return (
        <>
            <Header currentUser={{ email: 'a@gmail.com' }} />
            <TitleAndSlider />
        </>
    );
}
