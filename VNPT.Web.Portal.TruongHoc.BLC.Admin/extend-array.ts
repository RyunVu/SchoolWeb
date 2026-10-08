import moment from 'moment';

declare global {
    interface Array<T> {
        htcConvert(elem: any, elemDay: any): Array<T>;
    }
}

export const extendArray = () => {
    if (!Array.prototype.htcConvert) {

        Array.prototype.htcConvert = function <T>(this: T[], elem: any, elemDate: any): any {

            switch (elem) {
                case 6:
                    return this.map(function (e) {
                        var dateOfWeek = getDateOfWeek(e, moment(elemDate, "DD/MM/YYYY").year());
                        var obj = { Id: e, Name: 'Tuần ' + e + ' (' + dateOfWeek.dateFrom + ' - ' + dateOfWeek.dateTo + ')', FromDate: dateOfWeek.dateFrom, ToDate: dateOfWeek.dateTo };
                        return obj;
                    });
                    break;
                case 7:
                    return this.map(function (e) {
                        var dateOfMidMonth = getDateOfMidMonth(e, moment(elemDate, "DD/MM/YYYY").year());
                        var obj = { Id: e, Name: 'Giữa tháng ' + e + ' (' + dateOfMidMonth.dateFrom + ' - ' + dateOfMidMonth.dateTo + ')', FromDate: dateOfMidMonth.dateFrom, ToDate: dateOfMidMonth.dateTo };
                        return obj;
                    });
                    break;
                case 3:
                    return this.map(function (e) {
                        var dateOfMonth = getDateOfMonth(e, moment(elemDate, "DD/MM/YYYY").year());
                        var obj = { Id: e, Name: 'Tháng ' + e + ' (' + dateOfMonth.dateFrom + ' - ' + dateOfMonth.dateTo + ')', FromDate: dateOfMonth.dateFrom, ToDate: dateOfMonth.dateTo };
                        return obj;
                    });
                    break;
                case 4:
                    return this.map(function (e) {
                        var dateOfQuarter = getDateOfQuarter(e, moment(elemDate, "DD/MM/YYYY").year());
                        var obj = { Id: e, Name: 'Quý ' + e + ' (' + dateOfQuarter.dateFrom + ' - ' + dateOfQuarter.dateTo + ')', FromDate: dateOfQuarter.dateFrom, ToDate: dateOfQuarter.dateTo };
                        return obj;
                    });
                    break;
                case 5:
                    return this.map(function (e) {
                        var obj = { Id: e, Name: 'Năm (' + e + ')', FromDate: '01/01/' + e, ToDate: '31/12/' + e };
                        return obj;
                    });
                    break;
            }
        }

        function getDateOfMidMonth(m: any, y: number) {
            var dateFrom = new Date(y, m - 2, 16);;
            var dateTo = new Date(y, m - 1, 15);

            var n1 = moment(dateFrom).format('DD/MM/YYYY');
            var n2 = moment(dateTo).format('DD/MM/YYYY');
            return {
                dateFrom: n1,
                dateTo: n2
            }
        }

        function getDateOfMonth(m: any, y: number) {
            var dateFrom = new Date(y, m - 1, 1)
            var dateTo = new Date(y, m, 0)
            var n1 = moment(dateFrom).format('DD/MM/YYYY');
            var n2 = moment(dateTo).format('DD/MM/YYYY');
            return {
                dateFrom: n1,
                dateTo: n2
            }
        }

        function getDateOfWeek(w: any, y: any) {
            var d = new Date("Jan 01, " + y + " 01:00:00");
            var dayMs = (24 * 60 * 60 * 1000);
            var offSetTimeStart = dayMs * (d.getDay() - 1);
            var week = d.getTime() + 604800000 * (w - 1) - offSetTimeStart; //reducing the offset here
            var n1 = moment(new Date(week)).format('DD/MM/YYYY');
            var n2 = moment(new Date(week + 518400000)).format('DD/MM/YYYY');
            return {
                dateFrom: n1,
                dateTo: n2
            }
        }

        function getDateOfQuarter(q: any, y: number) {
            var dateFrom;
            var dateTo;
            switch (q) {
                case 1:
                    dateFrom = new Date(y, 0, 1)
                    dateTo = new Date(y, 3, 0)
                    break;
                case 2:
                    dateFrom = new Date(y, 3, 1)
                    dateTo = new Date(y, 6, 0)
                    break;
                case 3:
                    dateFrom = new Date(y, 6, 1)
                    dateTo = new Date(y, 9, 0)
                    break;
                case 4:
                    dateFrom = new Date(y, 9, 1)
                    dateTo = new Date(y, 12, 0)
                    break;
            }

            var n1 = moment(dateFrom).format('DD/MM/YYYY');
            var n2 = moment(dateTo).format('DD/MM/YYYY');

            return {
                dateFrom: n1,
                dateTo: n2
            }
        }
    }
}

