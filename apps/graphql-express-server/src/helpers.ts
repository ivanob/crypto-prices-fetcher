
const getTimestampXTimeAgo = (numSecondsAgo: number) => {
    const currentTimestamp = Math.round(Date.now() / 1000);
    return currentTimestamp - numSecondsAgo;
}

export const get24hAgoTimestamp = () => getTimestampXTimeAgo(60*60*24);

export const get1weekAgoTimestamp = () => getTimestampXTimeAgo(7*60*60*24)
