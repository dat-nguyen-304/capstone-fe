'use client';

import { Card } from '@nextui-org/react';
import { useQuery } from '@tanstack/react-query';

import 'react-quill/dist/quill.snow.css';
import { PuffLoader } from 'react-spinners';
import { studentApi } from '@/api-client';
import { useUser } from '@/hooks';
import StudentAvatar from '@/components/profile/StudentAvatar';
import StudentInfo from '@/components/profile/StudentInfo';
import StudentTarget from '@/components/profile/StudentTarget';
import Loader from '@/components/Loader';
import { useState } from 'react';
import { FileWithPath } from 'react-dropzone';
interface StudentProfileProps {}

const StudentProfile: React.FC<StudentProfileProps> = ({}) => {
    const { user } = useUser();
    const { data: studentData, refetch } = useQuery({
        queryKey: ['student-detail'],
        queryFn: () => studentApi.getStudent()
    });
    const [getUploadFile, setGetUploadedFiles] = useState<FileWithPath[]>([]);

    if (!studentData) return <Loader />;

    return (
        <Card className="w-[94%] xl:w-[90%] 3xl:w-[80%] mx-auto md:grid grid-cols-9 gap-8 my-8 p-2 sm:p-8">
            <div className="col-span-4 xl:col-span-3">
                <StudentAvatar studentData={studentData?.data} setGetUploadedFiles={setGetUploadedFiles} />
            </div>
            <div className="col-span-5 xl:col-span-6 mt-8 md:mt-0">
                <StudentInfo studentData={studentData?.data} getUploadFile={getUploadFile} refetch={refetch} />
                <StudentTarget targets={studentData?.data.targets} refetch={refetch} />
            </div>
        </Card>
    );
};

export default StudentProfile;
