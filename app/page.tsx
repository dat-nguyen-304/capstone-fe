import Banner from '@/components/homepage/Banner';
import Question from '@/components/homepage/Question';
import AboutMe from '@/components/homepage/AboutMe';
import Comment from '@/components/homepage/Comment';
import Steps from '@/components/homepage/Steps';
import StudentLayout from '@/components/header/StudentLayout';

export default function Home() {
    return (
        <StudentLayout>
            <Banner />
            <AboutMe />
            <Steps />
            <Comment />
            <Question />
        </StudentLayout>
    );
}
