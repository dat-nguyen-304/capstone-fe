'use client';

import { useState } from 'react';
import RegisterChooseRole from './RegisterChooseRole';
import RegisterChooseSubject from './RegisterChooseSubject';
import RegisterForm from './RegisterForm';
import RegisterChooseCombination from './RegisterChooseCombination';
import RegisterCheckEmail from './RegisterCheckEmail';

interface RegisterRootProps {}

enum STEPS {
    ROLE = 1,
    SUBJECT_COMBINATION = 2,
    FORM = 3,
    CHECK_EMAIL = 4
}

export enum ROLES {
    NONE = 1,
    TEACHER = 2,
    STUDENT = 3
}

const RegisterRoot: React.FC<RegisterRootProps> = ({}) => {
    const [role, setRole] = useState<ROLES>(ROLES.NONE);
    const [subjectIds, setSubjectIds] = useState<number[]>([]);
    const [combinationIds, setCombinationIds] = useState<number[]>([]);
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
        if (role === ROLES.TEACHER) {
            body = (
                <RegisterChooseSubject
                    subjectIds={subjectIds}
                    setSubjectIds={setSubjectIds}
                    nextStep={nextStep}
                    backStep={backStep}
                />
            );
        } else if (role === ROLES.STUDENT)
            body = (
                <RegisterChooseCombination
                    combinationIds={combinationIds}
                    setCombinationIds={setCombinationIds}
                    nextStep={nextStep}
                    backStep={backStep}
                />
            );
    }

    if (step === STEPS.FORM) {
        body = (
            <RegisterForm
                role={role}
                setRole={setRole}
                combinationIds={combinationIds}
                subjectIds={subjectIds}
                nextStep={nextStep}
                backStep={backStep}
            />
        );
    }

    if (step === STEPS.CHECK_EMAIL) {
        body = <RegisterCheckEmail />;
    }

    return body;
};

export default RegisterRoot;
