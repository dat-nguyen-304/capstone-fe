export type VideoCardType = {
    id: number;
    thumbnail: string;
    name: string;
    duration: number;
    like: number;
    createDate: string;
    status: string;
    videoStatus: string;
};

export type ChangeVideoStatus = {
    id: number;
    verifyStatus: string;
};
