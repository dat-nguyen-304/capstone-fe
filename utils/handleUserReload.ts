import { authApi } from '@/api-client';
import { studentApi } from '@/api-client/student-api';
import { SafeUser } from '@/types';

export const handleUserReload = async (onChangeUser: (user: SafeUser | null) => void) => {
    const res = await authApi.refreshToken();
    // const res = await studentApi.getStudent('nguyenphatdat3004@gmail.com');
    console.log({ res });
    /*if (res.status === 200 && !res.data.code) {
        const userSession: SafeUser = res.data.userSession;
        console.log({ userSession });

        if (userSession.role === 'STUDENT') {
            if (!userSession.avatar) userSession.avatar = '/student.png';
            onChangeUser(userSession);
        } else if (userSession.role === 'TEACHER') {
            if (!userSession.avatar) userSession.avatar = '/teacher.png';
            onChangeUser(userSession);
        }
    }
    return res;*/
};
