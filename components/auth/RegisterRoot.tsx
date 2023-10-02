'use client';

import { useEffect, useState } from 'react';
import RegisterChooseRole from './RegisterChooseRole';
import RegisterChooseSubject from './RegisterChooseSubject';
import RegisterForm from './RegisterForm';
import { Subject, Combination } from '@/types';
import RegisterChooseCombination from './RegisterChooseCombination';
import RegisterCheckEmail from './RegisterCheckEmail';

interface RegisterRootProps {}

enum STEPS {
    ROLE = 1,
    SUBJECT_COMBINATION = 2,
    FORM = 3,
    CHECK_EMAIL = 4
}

const RegisterRoot: React.FC<RegisterRootProps> = ({}) => {
    const [role, setRole] = useState<string>('');
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [combinations, setCombinations] = useState<Combination[]>([]);
    const [step, setStep] = useState<number>(STEPS.ROLE);

    let body;

    const nextStep = () => {
        setStep(step + 1);
    };

    const backStep = () => {
        setStep(step - 1);
    };

    if (step === STEPS.ROLE) {
        body = <RegisterChooseRole role={role} setRole={setRole} nextStep={nextStep} />;
    }

    if (step === STEPS.SUBJECT_COMBINATION) {
        if (role === 'teacher') {
            body = (
                <RegisterChooseSubject
                    subjects={subjects}
                    setSubjects={setSubjects}
                    nextStep={nextStep}
                    backStep={backStep}
                />
            );
        } else
            body = (
                <RegisterChooseCombination
                    combinations={combinations}
                    setCombinations={setCombinations}
                    nextStep={nextStep}
                    backStep={backStep}
                />
            );
    }

    if (step === STEPS.FORM) {
        body = (
            <RegisterForm role={role} setRole={setRole} subjects={subjects} nextStep={nextStep} backStep={backStep} />
        );
    }

    if (step === STEPS.CHECK_EMAIL) {
        body = <RegisterCheckEmail />;
    }

    return body;
};

export default RegisterRoot;
