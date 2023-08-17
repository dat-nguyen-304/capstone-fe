'use client';

import { useEffect, useState } from 'react';
import RegisterChooseRole from './RegisterChooseRole';
import RegisterChooseSubject from './RegisterChooseSubject';
import RegisterForm from './RegisterForm';
import { Subject } from '@/types';

interface RegisterRootProps {}

const RegisterRoot: React.FC<RegisterRootProps> = ({}) => {
    const [role, setRole] = useState<string>('');
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [isFillForm, setIsFillForm] = useState<boolean>(false);

    useEffect(() => {
        setSubjects([]);
    }, [role]);

    return !role ? (
        <RegisterChooseRole setRole={setRole} />
    ) : !isFillForm ? (
        <RegisterChooseSubject
            role={role}
            setRole={setRole}
            subjects={subjects}
            setSubjects={setSubjects}
            setIsFillForm={setIsFillForm}
        />
    ) : (
        <RegisterForm role={role} setRole={setRole} subjects={subjects} setIsFillForm={setIsFillForm} />
    );
};

export default RegisterRoot;
