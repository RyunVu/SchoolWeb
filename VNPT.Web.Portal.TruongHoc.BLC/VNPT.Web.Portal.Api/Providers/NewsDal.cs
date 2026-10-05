using System.Collections.Generic;
using System.Data.Entity.Infrastructure;
using System.Data.SqlClient;
using System.Data;
using System.Linq;
using System.Web;
using VNPT.Web.Portal.Api.Models;
using VNPT.Web.Portal.Base;

namespace VNPT.Web.Portal.Api.Providers
{
    public class NewsDal
    {
        public static List<News> GetNews(string code, int pageSize, int type, HttpSessionStateBase session, HttpRequestBase request,int pageIndex = 1)
        {
            var information = session["PortalInformation"] as PortalInformation;

            if (information != null && !string.IsNullOrEmpty(information.PortalCode))
            {
                information.PortalCode = information.PortalCode.ToLower();

                HttpCookie cookie = request.Cookies["Language_Portal"];

                string lang = "vi";

                if (cookie != null)
                {
                    lang = cookie.Value;
                    // Use the cookie value as needed
                }
                var codes = code.Split('.');
                var code1 = codes[0];
                string typeCode = null;
                if (codes.Length > 1)
                {
                    typeCode = codes[1];
                }

                code = code1;
                using (var context = new WebDbContext())
                {
                    var cmd = context.Database.Connection.CreateCommand();

                    cmd.CommandText = "[dbo].[Portal_CongDoan_GetNews]";
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add(new SqlParameter("@p_code", code.ToLower()));
                    cmd.Parameters.Add(new SqlParameter("@p_unitcode", information.PortalCode));
                    cmd.Parameters.Add(new SqlParameter("@p_lang", lang));
                    cmd.Parameters.Add(new SqlParameter("@p_type", type));
                    cmd.Parameters.Add(new SqlParameter("@p_type_code", typeCode));
                    cmd.Parameters.Add(new SqlParameter("@p_page_index", pageIndex));
                    cmd.Parameters.Add(new SqlParameter("@p_page_size", pageSize));
                    var connection = context.Database.Connection;

                    if (connection.State != ConnectionState.Open)
                        connection.Open();

                    using (var reader = cmd.ExecuteReader())
                    {
                        List<News> listNews = ((IObjectContextAdapter)context).ObjectContext
                            .Translate<News>(reader)
                            .ToList();

                        connection.Close();

                        return listNews;
                    }
                }
            }

            return new List<News>();
        }

    }
}