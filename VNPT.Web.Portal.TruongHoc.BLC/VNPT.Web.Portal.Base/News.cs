using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using VNPT.Core.Extentions;
using VNPT.Core.Models;

namespace VNPT.Web.Portal.Base
{
    public class News : BaseModel
    {
        public Guid Id { get; set; }
        public Guid NewTypeId { get; set; }


        [MaxLength(200)]
        public string Code { get; set; }

        [MaxLength(2000)]
        public string Alias { get; set; }


        [MaxLength(1000)]
        public string Title { get; set; }

        [DataType(DataType.MultilineText)]
        public string Content { get; set; }

        [MaxLength(2000)]
        public string ShortContent { get; set; }
        [MaxLength(1000)]
        public string Title_En { get; set; }
        public string Content_En { get; set; }
        [MaxLength(2000)]
        public string ShortContent_En { get; set; }
        [MaxLength(2000)]
        public string ImageUrl { get; set; }
        public string AudioUrl { get; set; }
        public DateTime? AudioCreateDate { get; set; }
        public long? Order { get; set; }
        public long? CountView { get; set; }


        [MaxLength(2000)]
        public string OtherUrl { get; set; }
        public bool IsNewsImage { get; set; }
        public bool IsOpenBlankPage { get; set; }
        public bool IsOpenImageOnly { get; set; }

        public string GetAlias()
        {
            var title = Title?.RemoveUnicode() ?? "";
            title = Regex.Replace(title, @"[^\w\d ]", "",
                RegexOptions.None, TimeSpan.FromSeconds(1.5));
            title = title.Replace(' ', '-');
            return title;
        }

        public string GetTitle()
        {
            var title = Title?.RemoveUnicode() ?? "";
            title = Regex.Replace(title, @"[^\w\d ]", "",
                RegexOptions.None, TimeSpan.FromSeconds(1.5));
            title = title.Replace(' ', '-');
            return title;
        }
        public string GetDetaiId()
        {
            return Alias;
        }

        public News Clone()
        {
            var result = this.CloneValue<News>(ignoreProperties: new List<string>() { });
            return result;
        }
    }
}
