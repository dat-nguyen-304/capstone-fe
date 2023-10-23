import { authApi } from '@/api-client';
import { SafeUser } from '@/types';

export const handleUserReload = async (onChangeUser: (user: SafeUser | null) => void) => {
    const res = await authApi.refreshToken();
    console.log(res);

    if (res.status === 200 && !res.data.code) {
        const userSession: SafeUser = res.data.userSession;

        if (userSession.role === 'STUDENT') {
            if (!userSession.avatar) userSession.avatar = '/student.png';
            onChangeUser(userSession);
        } else if (userSession.role === 'TEACHER') {
            if (!userSession.avatar) userSession.avatar = '/teacher.png';
            onChangeUser(userSession);
        }
    }
    return res;
};
