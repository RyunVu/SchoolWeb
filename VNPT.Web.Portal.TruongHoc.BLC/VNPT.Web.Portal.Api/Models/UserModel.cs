using System;
using System.Collections.Generic;
using VNPT.Core.Constants;
using VNPT.Core.Models;
using VNPT.Web.Portal.Base;

namespace VNPT.Web.Portal.Api.Models
{
    public class UserSearchModel : PagingModel
    {
        public Guid? UnitId { get; set; }
        public string UnitCode { get; set; }
        public string Type { get; set; }
        public string Id { get; set; }
    }

    public class UserStoreModel
    {
        public string Id { get; set; }
        public string FullName { get; set; }
        public string AvatarUrl { get; set; }

      
        public string UserName { get; set; }

        public string PhoneNumber { get; set; }

        public string OtherPositionName { get; set; }

        public string Email { get; set; }

        public string PositionName { get; set; }

        public string UnitName { get; set; }

        public string Fields { get; set; }
        public bool? EnableOtp { get; set; }
    }

    public class UserResultDto
    {

        public string Id { get; set; }

        public string Email { get; set; }

        public string PhoneNumber { get; set; }

        public string UserName { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }
       
        public string UnitCode { get; set; }

        public StatusEnum Status { get; set; }

        public string Role { get; set; }
        public Guid? PlaceId { get; set; }
		public Guid? DepartmentId { get; set; }
        public List<UserRole> UserRole { get; set; }

    }
}