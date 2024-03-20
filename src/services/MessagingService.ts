export const GAME_EVENTS = {
    GAME_MOUNT: 'GAME_MOUNT',
    GAME_END: 'GAME_END',
}
export const getParentOrigin = () => {
    const parentOrigin =
        window.location !== window.parent.location
            ? document.referrer
            : document.location.href
    return parentOrigin.endsWith('/')
        ? parentOrigin.slice(0, -1)
        : parentOrigin
}
export const sendGameLoadMessage = () => {
    const message = {status: GAME_EVENTS.GAME_MOUNT};
    sendMessage(message);
};
export const sendGameEndMessage = (data) => {
    const message = {status: GAME_EVENTS.GAME_END, data};
    sendMessage(message);
};
const sendMessage = (message) => {
    const url = getParentOrigin();
    window.parent.postMessage(message, url);
};
export const MessageService = {
    sendGameEndMessage,
    sendGameLoadMessage
}
