import Header from '@/components/header';
import Footer from '@/components/footer';
import Banner from '@/components/homepage/Banner';
import Question from '@/components/homepage/Question';
import AboutMe from '@/components/homepage/AboutMe';
import Comment from '@/components/homepage/Comment';

export default function Home() {
    return (
        <>
            <Header currentUser={{ email: 'a@gmail.com' }} />
            <Banner />
            <AboutMe />
            <Comment />
            <Question />
            <Footer />
        </>
    );
}
