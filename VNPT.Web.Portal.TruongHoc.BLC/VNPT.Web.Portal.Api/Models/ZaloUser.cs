namespace VNPT.Web.Portal.Api.Models
{
    public class ZaloLoginModel
    {
        public string uid { get; set; }

        public string Code { get; set; }

        public string scope { get; set; }
    }
    public class ZaloUserModel
    {
        public string name { get; set; }

        public string id { get; set; }
        public int error { get; set; }
        public string message { get; set; }

        public ZaloPicModel picture { get; set; }
    }
    public class ZaloPicModel
    {
        public ZaloPicUrlModel data { get; set; }
    }

    public class ZaloPicUrlModel
    {
        public string url { get; set; }
    }
}