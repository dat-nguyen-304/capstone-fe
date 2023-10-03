export interface LoginPayload {
    email: string;
    password: string;
}

export interface TeacherRegisterPayload {
    userRegister: { email: string; fullName: string; password: string; confirmPassword: string };
    subjectIds: number[];
}
