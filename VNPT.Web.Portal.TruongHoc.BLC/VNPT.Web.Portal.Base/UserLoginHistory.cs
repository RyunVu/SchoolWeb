using System;
using System.ComponentModel.DataAnnotations;
using VNPT.Core.Models;

namespace VNPT.Web.Portal.Base
{
    public enum LoginHistory
    {
        CanBoNhaNuoc = 1,
        NguoiDan = 2
    }
    public class UserLoginHistory : BaseModel
    {
        public Guid Id { get; set; }

        public LoginHistory LoginHistory { get; set; }

        [MaxLength(128)]
        public string UserId { get; set; }

        [MaxLength(200)]
        public string DeviceId { get; set; }

        [MaxLength(2000)]
        public string AccessToken { get; set; }

        public DateTime ExpiredDate { get; set; }
    }
}
