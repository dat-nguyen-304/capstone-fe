import { authApi } from '@/api-client';
import { SafeUser } from '@/types';

export const handleUserReload = async () => {
    const res = await authApi.refreshToken();
    if (res.status === 200) {
        const userSession: SafeUser = res.data.userSession;
        if (userSession.role === 'STUDENT') {
            if (!userSession.avatar) userSession.avatar = '/student.png';

            return userSession;
        } else if (userSession.role === 'TEACHER' || userSession.role === 'ADMIN') {
            if (!userSession.avatar) userSession.avatar = '/teacher.png';
            return userSession;
        }
    }
    return null;
};
