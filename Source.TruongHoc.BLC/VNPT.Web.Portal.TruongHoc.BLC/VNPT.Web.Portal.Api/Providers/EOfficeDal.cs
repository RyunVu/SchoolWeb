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
    public class EOfficeDal
    {
        public static List<EOffice> GetEOffice(HttpSessionStateBase session, HttpRequestBase request, int pageSize, int pageIndex = 1)
        {
            var information = session["PortalInformation"] as PortalInformation;

            if (information != null && !string.IsNullOrEmpty(information.PortalCode))
            {
                using (var db = new WebDbContext())
                {
                    var cmd = db.Database.Connection.CreateCommand();

                    cmd.CommandText = "[dbo].[Portal_EOffice_GetDocuments]";
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add(new SqlParameter("@p_unitcode", information.PortalCode.ToUpper()));
                    cmd.Parameters.Add(new SqlParameter("@p_status", 1));
                    cmd.Parameters.Add(new SqlParameter("@p_page_index", pageIndex));
                    cmd.Parameters.Add(new SqlParameter("@p_page_size", pageSize));
                    var connection = db.Database.Connection;
                    if (connection.State != ConnectionState.Open)
                        connection.Open();
                    using (var reader = cmd.ExecuteReader())
                    {
                        List<EOffice> resultTemp = ((IObjectContextAdapter)db).ObjectContext
                            .Translate<EOffice>(reader)
                            .ToList();
                        reader.NextResult();

                        var total = ((IObjectContextAdapter)db).ObjectContext
                            .Translate<int>(reader)
                            .FirstOrDefault();
                        connection.Close();

                        return resultTemp;
                    }
                }
            }

            return new List<EOffice>();
        }

    }
}