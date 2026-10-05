using System;
using System.Collections.Generic;
using VNPT.Core.Models;

namespace VNPT.Web.Portal.Api.Models
{
    public class HistoryModel
    {
        public string Id { get; set; }

        public string ChildId { get; set; }

        public string CreateDate { get; set; }
        public string CreateUserId { get; set; }

        public string Description { get; set; }

        public string Action { get; set; }
        public string NewVersion { get; set; }
        public string OldVersion { get; set; }
        public string ChildDescription { get; set; }

        public string ChildAction { get; set; }
        public string ChildNewVersion { get; set; }
        public string ChildOldVersion { get; set; }
        public string Name { get; set; }
        public string CurrentIp { get; set; }
        public string ParentId { get; set; }

        public string TableName { get; set; }
        public List<HistoryModel> Children { get; set; }
    }


    public class HistoryInputModel : PagingModel
    {
        public Guid? ItemId { get; set; }
        public string StartDate { get; set; }
        public string EndDate { get; set; }
        public string UserId { get; set; }
    }
}