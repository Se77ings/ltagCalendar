
export const formatPhoneNumber = (input) => {
    let maskedValue = input;

    maskedValue = input.replace(/\D/g, "").slice(0, 11); // Remove não números e limita a 11 caracteres
    if (maskedValue.length == 10) {
        maskedValue = maskedValue.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
    } else if (maskedValue.length == 11) {
        maskedValue = maskedValue.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    } else {
        maskedValue = maskedValue.replace(/\D/g, "");
    }
    return maskedValue;
};
