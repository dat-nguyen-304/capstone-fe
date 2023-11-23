'use client';

import { User } from '@nextui-org/react';
import Link from 'next/link';

interface TestResultItemProps {
    type: 'quiz' | 'exam';
    examsSubmissionInfo: any;
    index: number;
    examId: number;
}

const TestResultLine: React.FC<TestResultItemProps> = ({ type, examsSubmissionInfo, index, examId }) => {
    const finishTime = examsSubmissionInfo ? new Date(examsSubmissionInfo?.finishTime) : new Date();

    // Get the user's time zone
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    // Format the 'finishTime' using Intl.DateTimeFormat with time zone
    const formattedFinishTime = finishTime.toLocaleTimeString('en-GB', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        timeZone: userTimeZone
    });

    return (
        <li className="flex items-center justify-between border-t-1 border-gray-300 p-4 my-2">
            <User
                name={`Làm bài lần ${index + 1}`}
                description={`Nộp bài lúc ${formattedFinishTime}`}
                avatarProps={{
                    src: examsSubmissionInfo?.ownerAvatar
                        ? examsSubmissionInfo?.ownerAvatar
                        : 'https://i.pravatar.cc/150?u=a04258114e29026702d'
                }}
                className="hidden md:flex"
            />
            <h3 className="md:hidden text-xs sm:text-sm">Làm bài lần {index + 1}</h3>
            <div className="text-xs sm:text-sm">
                Điểm số <span className="font-bold mr-4">{examsSubmissionInfo?.grade.toFixed(1)}</span>
                <Link
                    className="text-xs sm:text-sm underline text-blue-500"
                    href={`/${type}/${examId}/result/${examsSubmissionInfo?.id}`}
                >
                    Xem chi tiết
                </Link>
            </div>
        </li>
    );
};

export default TestResultLine;
