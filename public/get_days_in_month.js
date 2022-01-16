export default function get_days_from_month(year,month){
    // zdefinowane dni po miesiacach
    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    if (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0)) {
        daysInMonth[1] = 29;
    }
    return daysInMonth[month-1]

}