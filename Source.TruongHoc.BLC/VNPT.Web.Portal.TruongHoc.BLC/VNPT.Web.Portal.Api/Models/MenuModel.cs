using System.Collections.Generic;
using System.Linq;
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

        public MenuModel(SystemMenu menu, WebDbContext context = null, string userId = "")
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
            IsOpenImageOnly = menu.IsOpenImageOnly;
            MenuPosition = menu.MenuPosition;
            ConfigMenu = menu.ConfigMenu;
            IsNewsImage = menu.IsNewsImage;
            IsOpenBlankPage = menu.IsOpenBlankPage;
            CreateDate = menu.CreateDate.ToString("dd/MM/yyyy HH:mm");
            MenuType = menu.MenuType;
            if (context != null)
            {
                var createUser = context.Users.FirstOrDefault(s => s.Id == menu.CreateUserId);
                if (createUser != null)
                {
                    CreateUserName = createUser.FullName;
                }

                if (!string.IsNullOrEmpty(userId))
                {
                    var user = context.Users.FirstOrDefault(s => s.Id == userId);
                    if (user != null)
                    {
                        CountNewsApprove = context.News.Count(s => s.Status == Core.Constants.StatusEnum.NotReadyOrPending && s.Code == menu.Parameter && s.UnitCode == user.UnitCode);
                    }
                }
                else
                {
                    CountNewsApprove = context.News.Count(s => s.Status == Core.Constants.StatusEnum.NotReadyOrPending && s.Code == menu.Parameter);
                }
            }
        }

        /// <summary>
        /// Constructor tối ưu — NHẬN DATA ĐÃ LOAD SẴN, KHÔNG query thêm DB.
        /// Dùng cho LeftMenu với N menu để tránh N+1 query.
        /// </summary>
        public MenuModel(SystemMenu menu, Dictionary<string, string> creatorNamesByUserId, string currentUserUnitCode, Dictionary<string, int> pendingCountsByCode)
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
            IsOpenImageOnly = menu.IsOpenImageOnly;
            MenuPosition = menu.MenuPosition;
            ConfigMenu = menu.ConfigMenu;
            IsNewsImage = menu.IsNewsImage;
            IsOpenBlankPage = menu.IsOpenBlankPage;
            CreateDate = menu.CreateDate.ToString("dd/MM/yyyy HH:mm");
            MenuType = menu.MenuType;

            // Lấy tên người tạo từ dictionary đã pre-load
            if (!string.IsNullOrEmpty(menu.CreateUserId) && creatorNamesByUserId != null
                && creatorNamesByUserId.TryGetValue(menu.CreateUserId, out var creatorName))
            {
                CreateUserName = creatorName;
            }

            // Lấy số tin chờ duyệt từ dictionary đã pre-load (case-insensitive)
            if (!string.IsNullOrEmpty(menu.Parameter) && pendingCountsByCode != null
                && pendingCountsByCode.TryGetValue(menu.Parameter, out var count))
            {
                CountNewsApprove = count;
            }
        }

        public string CreateDate { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string CreateUserName { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public bool IsOpenBlankPage { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public bool IsNewsImage { get; set; }
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public bool IsOpenImageOnly { get; set; }
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public int MenuPosition { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string ConfigMenu { get; set; }
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public bool IsUseParameterUrl { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public bool IsShowMenu { get; set; }
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public List<string> GoiYs { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public int? MenuType { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string TypeId { get; set; }
        public int CountNewsApprove { get; set; }
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