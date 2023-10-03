export type Subject = {
    id: number;
    label: string;
    value: string;
    img: string;
};

export type Combination = {
    id: number;
    label: string;
    subjects: string[];
    value: string;
};
