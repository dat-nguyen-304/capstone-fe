export type CommonUser = {
    role: string;
    email: string;
    fullName: string;
    avatar: string;
};

export type ChangePasswordPayload = {
    email: string;
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
};

export type ChangeUserStatus = {
    userId: number;
    userStatus: string;
};
