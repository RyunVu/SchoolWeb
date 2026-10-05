using System;
using VNPT.Core.Constants;
using VNPT.Core.Models;
using VNPT.Web.Portal.Base;

namespace VNPT.Web.Portal.Api.Models
{
    public class UserLoginHistoryModel : PagingModel
    {
        public Guid Id { get; set; }

        public LoginHistory LoginHistory { get; set; }

        public string UserId { get; set; }

        public string DeviceId { get; set; }

        public string AccessToken { get; set; }

        public DateTime ExpiredDate { get; set; }
        public string ExpiredDateString => ExpiredDate.ToString("dd/MM/yyyy hh:mm:ss");
        public DateTime CreateDate { get; set; }
        public string CreateDateString => CreateDate.ToString("dd/MM/yyyy hh:mm:ss");
        public StatusEnum Status { get; set; }

        public bool IsUserLogin { get; set; }
        public UserLoginHistoryModel()
        {

        }

        public UserLoginHistoryModel(UserLoginHistory model)
        {
            Id = model.Id;
            LoginHistory = model.LoginHistory;
            UserId = model.UserId;
            DeviceId = model.DeviceId;
            AccessToken = model.AccessToken;
            ExpiredDate = model.ExpiredDate;
            Status = model.Status;
            CreateDate = model.CreateDate;
        }
    }
}