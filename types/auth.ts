export type LoginPayload = {
    email: string;
    password: string;
};

export type TeacherRegisterPayload = {
    userRegister: { email: string; fullName: string; password: string; confirmPassword: string };
    subjectIds: number[];
};

export type StudentRegisterPayload = {
    userRegister: { email: string; fullName: string; password: string; confirmPassword: string };
    combinationIds: number[];
};

export type SafeUser = {
    sub: string;
    role: 'STUDENT' | 'TEACHER' | 'ADMIN';
    fullname: string;
    avatar: null | string;
    exp: number;
    iat: number;
    email: string;
};
