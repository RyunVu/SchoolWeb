export const generatePeriodList = (type: 'YEAR' | 'QUARTER' | 'MONTH' | 'DAY'): { Name: string; Id: string }[] => {
    const currentDate = new Date();
    const result: { Name: string; Id: string }[] = [];

    for (let i = -10; i <= 2; i++) {
        let date = new Date(currentDate);
        let name = '';
        let id = '';

        switch (type) {
            case 'YEAR':
                date.setFullYear(currentDate.getFullYear() + i);
                name = id = date.getFullYear().toString();
                break;
            case 'QUARTER':
                date.setMonth(currentDate.getMonth() + i * 3);
                const quarter = Math.floor(date.getMonth() / 3) + 1;
                name = id = `${date.getFullYear()}-Q${quarter}`;
                break;
            case 'MONTH':
                date.setMonth(currentDate.getMonth() + i);
                name = id = date.toISOString().slice(0, 7);
                break;
            case 'DAY':
                date.setDate(currentDate.getDate() + i);
                name = id = date.toISOString().slice(0, 10);
                break;
        }

        result.push({ Name: name, Id: id });
    }

    return result;
}

export const getCurrentPeriodByType = (periodType: any) => {
    const currentDate = new Date();
    let value = '';

    switch (periodType) {
        case 'YEAR':
            value = currentDate.getFullYear().toString();
            break;
        case 'QUARTER':
            const quarter = Math.floor(currentDate.getMonth() / 3) + 1;
            value = `${currentDate.getFullYear()}-Q${quarter}`;
            break;
        case 'MONTH':
            value = currentDate.toISOString().slice(0, 7);
            break;
        case 'DAY':
            value = currentDate.toISOString().slice(0, 10);
            break;
    }

    return value;
}