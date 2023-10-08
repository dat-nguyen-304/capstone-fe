export const vertical = (percent: number, duration: number, delay: number) => {
    return {
        initial: {
            y: `${percent}%`,
            opacity: 0
        },
        whileInView: {
            y: 0,
            opacity: 1
        },
        transition: {
            duration,
            delay
        }
    };
};

export const horizontal = (percent: number, duration: number, delay: number) => {
    return {
        initial: {
            x: `${percent}%`,
            opacity: 0
        },
        whileInView: {
            x: 0,
            opacity: 1
        },
        transition: {
            duration,
            delay
        }
    };
};
