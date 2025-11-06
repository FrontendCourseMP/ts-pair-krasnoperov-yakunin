"use strict";
function parseFIO(input) {
    const trimmed = input.trim();
    if (!trimmed)
        return null;
    const parts = trimmed.split(/\s+/).filter(part => part.length > 0);
    if (parts.length < 2 || parts.length > 3)
        return null;
    const isValidPart = (str) => /^[А-ЯЁ][а-яё]*$/.test(str);
    if (!parts.every(isValidPart))
        return null;
    const [lastName, firstName, middleName] = parts;
    return { lastName, firstName, middleName: parts.length === 3 ? middleName : undefined };
}
function formatSignature(fio) {
    const firstInitial = fio.firstName[0] + '.';
    const middleInitial = fio.middleName ? ' ' + fio.middleName[0] + '.' : '';
    return `${firstInitial}${middleInitial} ${fio.lastName}`;
}
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('fioForm');
    const input = document.getElementById('fullName');
    const output = document.getElementById('result');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const rawValue = input.value;
        const parsed = parseFIO(rawValue);
        if (!parsed) {
            output.textContent = 'Ошибка: введите корректное ФИО (Фамилия Имя [Отчество])';
            output.style.color = 'red';
            return;
        }
        const signature = formatSignature(parsed);
        output.textContent = signature;
        output.style.color = 'inherit';
    });
});
