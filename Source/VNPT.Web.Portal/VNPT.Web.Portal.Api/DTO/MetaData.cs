using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace VNPT.Web.Portal.Api.DTO
{
	public enum MetaDataType
    {
        Portal,
        News,
        Place,
        Utility,
        Business,
        DetailTravel
    }
    public class MetaData
    {
        public string FacebookId;

        public string Id;
        public string Alias;
        public string UnitCode { get; set; }

        public MetaDataType Type { get; set; }

        public string Title { get; set; }

        public string Tag { get; set; }

        public string Description { get; set; }
        public string Robots { get; set; }
        public string Keywords { get; set; }
        public string SiteName { get; set; }
        public string FanPageFacebook { get; set; }
        public string ImageThumbFacebook { get; set; }
        public int ImageThumbFacebookWidth { get; set; }
        public int ImageThumbFacebookHeigth { get; set; }
        public string Language { get; set; }
    }
}