export type ChangePasswordPayload = {
    email: string;
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
};
