using System;
using System.Collections.Generic;

namespace VNPT.Web.Portal.Api.Models
{
    public class ControllerModel
    {
        public string Name { get; set; }
        public Guid MenuId { get; set; }
        public List<ActionModel> Actions { get; set; }
        public string Method { get; set; }
        public string Controller { get; set; }
        public string Action { get; set; }
    }

    public class ActionModel
    {
        public string Name { get; set; }
        public List<ActionModel> Actions { get; set; }
        public bool Checked { get; set; }
    }
    public class MenuRoleModel
    {
        public Guid MenuId { get; set; }
        public string RoleId { get; set; }
        public string Command { get; set; }
    }
}