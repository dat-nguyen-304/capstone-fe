export type LoginPayload = {
    email: string;
    password: string;
}

export type TeacherRegisterPayload = {
    userRegister: { email: string; fullName: string; password: string; confirmPassword: string };
    subjectIds: number[];
}
