const verifyTel = (tel: string): boolean => {
    const regex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/
    return regex.test(tel);
};
export default verifyTel;