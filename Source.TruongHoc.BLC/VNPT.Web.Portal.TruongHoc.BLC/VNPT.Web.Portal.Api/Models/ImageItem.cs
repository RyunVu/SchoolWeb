using DocumentFormat.OpenXml.Spreadsheet;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace VNPT.Web.Portal.Api.Models
{
    public class ImageItem
    {
        public string Description { get; set; }

        public string Url { get; set; }
    }
}