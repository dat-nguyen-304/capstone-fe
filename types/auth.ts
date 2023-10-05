export type LoginPayload = {
    email: string;
    fullName: string;
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
