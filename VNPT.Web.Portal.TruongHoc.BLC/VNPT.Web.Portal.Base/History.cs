using System;
using System.ComponentModel.DataAnnotations;
using VNPT.Core.Models;

namespace VNPT.Web.Portal.Base
{
    public enum HistoryActionEnum
    {
        Add = 1,
        Edit,
        Delete,
        Other,
        Login,
        View
    }
    public class History : BaseModel
    {
        public Guid Id { get; set; }
        public Guid ItemId { get; set; }

        [MaxLength(100)]
        public string TableName { get; set; }

        public HistoryActionEnum Action { get; set; }

        public string OldVersion { get; set; }

        public Guid? ParentId { get; set; }

        public string NewVersion { get; set; }
        [MaxLength(200)]
        public string CurrentIp { get; set; }
    }
}
