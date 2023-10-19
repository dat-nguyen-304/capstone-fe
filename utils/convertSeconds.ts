export const convertSeconds = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const timeString = `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;

    return timeString;
};
