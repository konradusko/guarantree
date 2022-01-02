const isValidDate = (dateString)=>{
    
    // Date format: YYYY-MM-DD
    const datePattern = /^([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/;

    // Check if the date string format is a match
   const matchArray = dateString.match(datePattern);
    if (matchArray == null) {
        return false;
    }

    // Remove any non digit characters
    const cleanDateString = dateString.replace(/\D/g, ''); 

    // Parse integer values from date string
    const year = parseInt(cleanDateString.substr(0, 4));
    const month = parseInt(cleanDateString.substr(4, 2));
    const day = parseInt(cleanDateString.substr(6, 2));
   
    // Define number of days per month
    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    // Adjust for leap y ears
    if (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0)) {
        daysInMonth[1] = 29;
    }

    // check month and day range
    if (month < 1 || month > 12 || day < 1 || day > daysInMonth[month - 1]) {
        return false;
    }

    return true;
}
export{isValidDate}