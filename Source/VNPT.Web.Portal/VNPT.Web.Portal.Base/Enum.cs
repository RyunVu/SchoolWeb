using System.ComponentModel;

namespace VNPT.Web.Portal.Base
{
    public enum ScheduleTaskTypeEnum
    {
        [Description("Phút")]
        Minute = 0, //theo phút
        [Description("Giờ")]
        House = 1, //theo giờ
        [Description("Ngày")]
        Day = 2, //theo ngày
        [Description("Tháng")]
        Month = 3, //theo tháng
        [Description("Quý")]
        Quarter = 4, //theo quý
        [Description("Năm")]
        Year = 5, //theo năm
        [Description("Tuần")]
        Week = 6, //theo tuần
        [Description("Giữa tháng")]
        HalfMonth = 7 //giữa tháng đến giữa tháng sau
    }

    public enum PlaceMenuLocation
    {
        Horizontal = 1,
        Vertical = 2
    }
}
