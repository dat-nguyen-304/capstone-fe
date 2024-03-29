export type Course = {
    id: number;
    courseName: string;
};

export type CourseCardType = {
    id: number;
    thumbnail: string;
    courseName: string;
    teacherName: string;
    rating: number;
    numberOfRate: number;
    totalVideo: number;
    subject: string;
    level: string;
    price: number;
    progress?: number;
    status?: 'AVAILABLE' | 'WAITING' | 'REJECT' | 'BANNED' | 'UPDATING' | 'DISABLE' | 'DRAFT' | 'DELETED';
};

export type ChangeCourseStatus = {
    id: number;
    verifyStatus: string;
};

export type CreateCourse = {
    courseRequest: {
        description: string;
        name: string;
        price: number;
        subject: string;
        levelId: number;
        topic: [];
    };
};
