export type Topic = {
    id: number;
    name: string;
};

export type TopicType = {
    id: number;
    name: string;
    description: string;
};

export type CreateTopicObject = {
    name: string;
    description: string;
};
