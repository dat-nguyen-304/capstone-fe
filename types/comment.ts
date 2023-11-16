export type CreateComment = {
    conversationId: number;
    content: string;
};

export type CommentCardType = {
    id: number;
    commentParentId: number;
    content: string;
    conversationId: number;
    createTime: string;
    imageUrl: string;
    lastUpdateTime: string;
    owner: boolean;
    ownerEmail: boolean;
    reactCount: number;
    reacted: false;
};
