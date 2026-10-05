using System.Collections.Generic;
using Newtonsoft.Json;
using VNPT.Core.Models;
using VNPT.Web.Portal.Base;

namespace VNPT.Web.Portal.Api.Models
{
    public class MenuModel : PagingModel, IRoleModel<MenuModel>
    {

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string Id { get; set; }
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string ParentId { get; set; }
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string Icon { get; set; }
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string Action { get; set; }
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string Parameter { get; set; }
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string Title { get; set; }
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string Title_En { get; set; }
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string Description { get; set; }
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public int OrderNo { get; set; }
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public bool IsAllow { get; set; }
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public List<PermissionMenu> Permissions { get; set; }
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public List<MenuModel> Children { get; set; }
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string Code { get; set; }
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string RoleId { get; set; }
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public int RoleLevel { get; set; }
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string MenuCode { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public bool IsHomePage { get; set; }
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string OtherRole { get; set; }
        public MenuModel()
        {
            
        }

        public MenuModel(SystemMenu menu)
        {
            Id = menu.Id.ToString();
            ParentId = menu.ParentId?.ToString();
            Icon = menu.Icon;
            Action = menu.Action;
            Parameter = menu.Parameter;
            Title = menu.Title;
            Title_En = menu.Title_En;
            Description = menu.Description;
            OrderNo = menu.SortNo;
            Code = menu.MenuCode;
            RoleLevel = menu.RoleLevel;
            Children = new List<MenuModel>();
            MenuCode = menu.MenuCode;
            IsShowMenu = menu.IsShowMenu ?? false;
            IsUseParameterUrl = menu.IsUseParameterUrl ?? false;
            OtherRole = menu.OtherRole;
            UnitCode = menu.UnitCode;
        }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public bool IsUseParameterUrl { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public bool IsShowMenu { get; set; }
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public List<string> GoiYs { get; set; }
    }
    public class PermissionMenu
    {
        public PermissionMenu()
        {

        }

        public PermissionMenu(string command, bool value = true)
        {
            Command = command;
            Value = value;
        }
        //public PermissionMenu(RolePermissionProperty permission)
        //{
        //    Command = permission.Command;
        //    Value = permission.Value;
        //}
        public string Command { get; set; }

        public bool? Value { get; set; }
    }
}