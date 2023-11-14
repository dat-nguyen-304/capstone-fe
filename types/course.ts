export type CourseCardType = {
    id: number;
    thumbnial: string;
    courseName: string;
    teacherName: string;
    rating: number;
    numberOfRate: number;
    totalVideo: number;
    subject: string;
    level: string;
    price: number;
};

export type ChangeCourseStatus = {
    id: number;
    verifyStatus: string;
};
