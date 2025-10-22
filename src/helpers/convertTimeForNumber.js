function convertTimeForNumber(startTime, endTime) {
    
        const [startHour, startMinute, startSecond] = startTime.split(":").map(Number);
        const [endHour, endMinute, endSecond] = endTime.split(":").map(Number);

        const startInMinutes = startHour * 60 + startMinute + startSecond / 60;
        const endInMinutes = endHour * 60 + endMinute + endSecond / 60;
    
        const hoursToWork = (endInMinutes - startInMinutes) / 60;
        return hoursToWork;
}

export default convertTimeForNumber;