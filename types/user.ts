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
