using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using VNPT.Core.Media.DAL.Models;
using VNPT.Core.Models;

namespace VNPT.Web.Portal.Api.Models
{
    public class FileModelV2 : FileModel
    {
        public string Caption { get; set; }
    }
}