using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using VNPT.Core.Constants;
using VNPT.Core.Models;
using VNPT.Web.Portal.Base;

namespace VNPT.Web.Portal.Api.Models
{
	public class SysThemeLayoutModel : SysThemeLayout
    {
        public SysThemeLayoutModel()
        {
            
        }

        public SysThemeLayoutModel(SysThemeLayout theme)
        {
            Id = theme.Id;
            Name = theme.Name;
        }
    }
}