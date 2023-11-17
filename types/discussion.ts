export type DiscussionType = {
    id: number;
    topicId: number;
    title: string;
    content: string;
    viewCount: number;
    commentCount: number;
    reactCount: number;
    imageUrl: string;
    createTime: string;
    lastUpdateTime: string;
    ownerEmail: string;
    reacted: string;
    owner: string;
    status: string;
};

export type CreateDiscussion = {
    topicId: number;
    title: string;
    content: string;
};

export type UpdateDiscussion = {
    topicId: number;
    title: string;
    content: string;
};
