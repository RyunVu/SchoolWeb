using System.Collections.Generic;
using System.Linq;
using VNPT.Core.Models;
using VNPT.Web.Portal.Base;

namespace VNPT.Web.Portal.Api.Models
{
    public interface IRoleModel<T>
    {
        string Id { get; set; }
        string ParentId { get; set; }
        List<T> Children { get; set; }
        int OrderNo { get; set; }
    }
    public class AdminRoleModel : PagingModel, IRoleModel<AdminRoleModel>
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public string Id { get; set; }
        public int RoleLevel { get; set; }
        public string ParentName { get; set; }
        public string ParentId { get; set; }
        public List<AdminRoleModel> Children { get; set; }
        public int OrderNo { get; set; }

        public AdminRoleModel()
        {

        }
        public AdminRoleModel(Role model)
        {
            Name = model.Name;
            Id = model.Id;
            RoleLevel = model.RoleLevel;
            Description = model.Description;
            ParentId = model.ParentId;
            ParentName = model.Parent?.Name;
            Children = new List<AdminRoleModel>();
        }
    }

    public class RoleDal<T> where T : IRoleModel<T>
    {
        public static List<T> GroupByParent(List<T> roles)
        {
            var result = new List<T>();

            foreach (var item in roles)
            {
                if (string.IsNullOrEmpty(item.ParentId))
                {
                    var oldParentId = result.FirstOrDefault(s => s.Id == item.Id);
                    if (oldParentId == null)
                    {
                        result.Add(item);
                        result = result.OrderBy(s => s.OrderNo).ToList();
                    }
                }
                else
                {
                    // kiểm tra có phải role con của kết quả
                    var parent = GetParent(item.ParentId, result);
                    if (parent != null)
                    {
                        // có trong kết quả
                        parent.Children.Add(item);
                        parent.Children = parent.Children.OrderBy(s => s.OrderNo).ToList();
                    }
                    else
                    {
                        // kiếm kết quả trong list tổng
                        parent = GetParent(item.ParentId, roles);
                        if (parent == null)
                        {
                            result.Add(item);
                            result = result.OrderBy(s => s.OrderNo).ToList();
                        }
                        else
                        {
                            parent.Children.Add(item);
                            parent.Children = parent.Children.OrderBy(s => s.OrderNo).ToList();
                        }
                    }
                }
            }

            return result;
        }
        private static T GetParent(string parentId, List<T> menus)
        {
            if (menus == null || parentId == null) return default(T);
            var parentMenu = menus.FirstOrDefault(s => s.Id == parentId);

            if (parentMenu == null)
            {
                foreach (var menu in menus)
                {
                    parentMenu = GetParent(parentId, menu.Children);
                    if (parentMenu != null)
                    {
                        return parentMenu;
                    }
                }
            }

            return parentMenu;
        }
    }
}