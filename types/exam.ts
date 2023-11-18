export type ExamCardType = {
    id: number;
    attempted: boolean;
    courseId: number;
    createTime: string;
    description: string;
    duration: number;
    examType: string;
    lastUpdateTime: string;
    level: string;
    name: string;
    owner: boolean;
    ownerFullName: string;
    ownerId: number;
    questionList: QuestionType[];
    reactCount: number;
    reacted: false;
    status: string;
    subject: string;
};

export type QuestionType = {
    answerList: Array<string>;
    correctAnswer: string;
    createTime: string;
    examId: number;
    explanation: string;
    imageUrl: string;
    level: string;
    statement: string;
    status: string;
    topic: TopicExamType;
};

export type TopicExamType = {
    description: string;
    id: number;
    level: string;
    name: string;
    status: string;
    subject: string;
};
