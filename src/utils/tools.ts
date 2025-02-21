export const call = (phoneNumber: string) => {
    window.location.href = `tel:${phoneNumber}`;
};