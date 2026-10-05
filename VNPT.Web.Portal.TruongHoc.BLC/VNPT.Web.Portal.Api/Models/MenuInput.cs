using System.Collections.Generic;

namespace VNPT.Web.Portal.Api.Models
{
    public class MenuInput
    {
        public string Lang { get; set; }
        public string MenuId { get; set; }

        public List<string> MenuChildren { get; set; }

        public string Code { get; set; }
        public string Icon { get; set; }
        public string RoleId { get; set; }
        public string UnitCode { get; set; }
        public string MenuCode { get; set; }
        public string Command { get; set; }
        public bool Value { get; set; }
    }
}