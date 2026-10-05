using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Data.Entity.Core.Common.CommandTrees.ExpressionBuilder;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;
using System.Web.UI.WebControls;
using VNPT.Core.Constants;
using VNPT.Web.Portal.Api.Models;
using VNPT.Web.Portal.Base;
using System.Data;
using System.Data.Entity;
using VNPT.Web.Portal.Api.Helper;

namespace VNPT.Web.Portal.Api.Areas.Modules.Controllers
{
    public class BaoCaoThuongNienController : Controller
    {
        // GET: BaoCaoThuongNien
        public ActionResult GetBaoCao()
        {
            using (var context = new WebDbContext())
            {
                var information = Session["PortalInformation"] as PortalInformation;
                if (information != null)
                {
                    information.PortalCode = information.PortalCode.ToLower();
                    HttpCookie cookie = Request.Cookies["Language_Portal"];

                    string lang = "vi";

                    if (cookie != null)
                    {
                        lang = cookie.Value;
                        // Use the cookie value as needed
                    }

                    var groupTable = context.GroupTables.OrderBy(x => x.Order).ToList();

                    //var tabletem = context.TableTemplates.Where


                    return PartialView("GetBaoCao", groupTable);
                }

                return null;
            } 
        }

        public async Task<JsonResult> GetTableTemplateByGrId(Guid gpTableId)
        {
            using (var context = new WebDbContext())
            {
                var tabletp = context.TableTemplates.Where(x => x.GroupTableId == gpTableId).OrderBy(x => x.Order).ToList();
                string json = new JavaScriptSerializer().Serialize(tabletp);
                return Json(json, JsonRequestBehavior.DenyGet);
            }
        }

       

        public async Task<JsonResult> GetColOfTableTemplate(Guid tableId)
        {
            using (var context = new WebDbContext())
            {
                //var qry = context.TableCells.GroupJoin(
                //  context.TableTemplates,
                //  cell => cell.TableTemplateId,
                //  t => t.Id,
                //  (x, y) => new { tcell = x, ttemp = y })
                //    .SelectMany(x => x.ttemp.DefaultIfEmpty(),
                //        (x, y) => new { x.tcell, ttemp = y })
                //    .GroupJoin(context.TableValues,
                //    x => x.CourseStudents.StudentId,
                //    y => y.Id,
                //    (x, y) => new { CoursesCourseStudents = x, Students = y }
                //)
                  //.GroupJoin(
                  //context.TableValues,
                  //cell => cell,
                  //val => val.TableCellId,
                  //(x, y) => new { t = x, col = y })


                //select cell.Value, v.Value as nam, cell.ColSpan, cell.RowSpan, cell.[RowNo]
                //from TableCells cell
                //left join TableTemplates t on t.Id = cell.TableTemplateId
                //left join TableValues v on v.TableCellId = cell.Id
                //where cell.TableColumnId = 'D0A5D2E7-48A8-4EA0-97B1-44D06CC53F98' order by  cell.[RowNo]


                //string json = new JavaScriptSerializer().Serialize(qry);
                //return Json(json, JsonRequestBehavior.DenyGet);
                return null;
            }
        }

   
        public async Task<JsonResult> GetRowOfTableTemplate2(Guid tableId, string year)
        {
            using (var context = new WebDbContext())
            {
                var cols = context.TableColumns.Where(s => s.Status == StatusEnum.Used && s.TableTemplateId == tableId).ToList();
                var cells = context.TableCells.Where(s => s.Status == StatusEnum.Used && s.TableTemplateId == tableId).ToList();
                var values = context.TableValues.Where(s => s.Status == StatusEnum.Used && s.TableTemplateId == tableId && s.Period == year).ToList();
                //var tableInfo = context.TableTemplates.Where(s => s.Status == StatusEnum.Used && s.Id == tableId).FirstOrDefault();
                var data = new
                {
                    //TableInfo = tableInfo,
                    Columns = cols,
                    Cells = cells,
                    Values = values
                };

                string json = new JavaScriptSerializer().Serialize(data);
                return Json(json, JsonRequestBehavior.DenyGet);
                //return null;
            }
        }



        public class GroupTableDTO
        {
            public Guid Id { get; set; }
            public string Name { get; set; }
        }

        public async Task<JsonResult> ExportFile(string year)
        {

            var infomation = Session["PortalInformation"] as PortalInformation;
            if (infomation != null && !string.IsNullOrEmpty(infomation.PortalCode))
            { 
               
                using (var context = new WebDbContext())
            {

                   var inforTruong = context.SysPortals.FirstOrDefault(s => s.Status != StatusEnum.Deleted && s.UnitCode.ToLower() == infomation.PortalCode.ToLower());
                   var inforPhong = context.SysPortals.FirstOrDefault(s => s.Status != StatusEnum.Deleted && s.UnitCode.ToLower() == "PHONGGDDT");

                    // Lấy danh sách các bảng nhóm
                    var tableGroups = await context.GroupTables
                                           .Where(s => s.Status == StatusEnum.Used)
                                           .OrderBy(x => x.Order)
                                           .Select(s => new GroupTableDTO
                                           {
                                               Id = s.Id,
                                               Name = s.Name
                                           })
                                           .ToListAsync();

                List<DataTemplateDTOBaoCao> tables = new List<DataTemplateDTOBaoCao>();

                foreach (var tableGroup in tableGroups)
                {
                    // Tạo đối tượng DataTemplateDTO mới cho từng nhóm bảng
                    DataTemplateDTOBaoCao dataa = new DataTemplateDTOBaoCao
                    {
                        GName = tableGroup.Name,
                        Datas = new List<DataTable1>()
                    };

                    // Lấy các mẫu bảng cho nhóm bảng hiện tại
                    var tableTemplates = await context.TableTemplates
                                                      .Where(x => x.GroupTableId == tableGroup.Id)
                                                      .OrderBy(x => x.Order)
                                                      .ToListAsync();
                    Guid guid = Guid.NewGuid(); // Generate a new Guid

                    foreach (var tableTemplate in tableTemplates)
                    {

                        // Lấy các cột, ô và giá trị cho mẫu bảng hiện tại
                        var cols = await context.TableColumns
                                                .Where(s => s.Status == StatusEnum.Used && s.TableTemplateId == tableTemplate.Id)
                                                .Select(x => new TableColumnT()
                                                {
                                                    Id = x.Id.ToString(),
                                                    Name = x.Name,
                                                    TableTemplateId = x.TableTemplateId.ToString(),
                                                    UnsignName = x.UnsignName,
                                                    RowNo = x.RowNo,
                                                    ColNo = x.ColNo,
                                                    ColSpan = x.ColSpan,
                                                    RowSpan = x.RowSpan,
                                                    Order = x.Order,

                                                 }).OrderBy(x => x.RowNo)
                                                .ToListAsync();
                        var cells = await context.TableCells
                                                .Where(s => s.Status == StatusEnum.Used && s.TableTemplateId == tableTemplate.Id)

                                                    .Select(x => new TableCellT()
                                                    {
                                                        Id = x.Id.ToString(),
                                                        TableTemplateId = x.TableTemplateId.ToString(),
                                                        RowNo = x.RowNo,
                                                        ColSpan = x.ColSpan,
                                                        RowSpan = x.RowSpan,
                                                        UnsignValue = x.UnsignValue,
                                                        MinValue = x.MinValue,
                                                        ValueType = x.ValueType,
                                                        MaxValue = x.MaxValue,
                                                        Value = x.Value,
                                                        TableColumnId = x.TableColumnId.ToString(),
                                                        ReadOnly = x.ReadOnly
                                                    }).OrderBy(x => x.RowNo)
                                                .ToListAsync();
                        var values = await context.TableValues
                                                 .Where(s => s.Status == StatusEnum.Used && s.TableTemplateId == tableTemplate.Id && s.Period == year)
                                                 .Select(x => new TableValueT()
                                                 {
                                                     Id = x.Id.ToString(),
                                                     TableTemplateId= x.TableTemplateId.ToString(),
                                                     TableCellId = x.TableCellId.ToString(),
                                                     InputUnitId = x.InputUnitId.ToString(),
                                                     Period = x.Period,
                                                     Value = x.Value,
                                                     UnsignValue = x.UnsignValue,
                                                 })
                                                 .ToListAsync();

                        var data = new DataTable1()
                        {
                            TName = tableTemplate.Name,
                            TType = tableTemplate.Type,
                            tableColumns = cols,
                            tableCell = cells,
                            tableValue = values
                        };

                        dataa.Datas.Add(data);
                    }

                    tables.Add(dataa);
                }

                DateTime currentDate = DateTime.Now;
                
                string formattedDate = $"ngày {currentDate.Day} tháng {currentDate.Month} năm {currentDate.Year}";

                if (inforPhong == null)
                {
                    inforPhong = new SysPortal();
                    inforPhong.Name = "Phòng Giáo Dục và Đào Tạo";
                }

                // Chuyển dữ liệu vào Dictionary để thay thế trong file Word
                Dictionary<string, string> replacements = new Dictionary<string, string>
                {
                    { "[COSOGIAODUC]", inforTruong.Name.ToUpper() },
                    { "[NAMBAOCAO]", year },
                    { "[COQUANQUANLYTRUCTIEP]", inforPhong.Name.ToUpper() },
                    { "[NGAYTHANGNAM]", formattedDate },
                    
                    // Thêm các cặp khóa-giá trị khác
                };
                
                var timestamp = new DateTimeOffset(DateTime.UtcNow).ToUnixTimeSeconds();

                string templatePath = Server.MapPath("~/Templates/Template_ThongTu.docx");
                string exportPathWord = Server.MapPath($"~/Exports/Export_TT-09-bgd_{currentDate.Day}_{currentDate.Month}_{currentDate.Year}_{timestamp}.docx");
                string exportPathPdf = Server.MapPath($"~/Exports/Export_{year}.pdf");

                WordHelper wordHelper = new WordHelper();
                wordHelper.ReplaceAndExportWord(templatePath, exportPathWord, replacements, tables);
                //wordHelper.ConvertWordToPdf(exportPathWord, exportPathPdf);

                string relativePath = Url.Content($"~/Exports/Export_TT-09-bgd_{currentDate.Day}_{currentDate.Month}_{currentDate.Year}_{timestamp}.docx");
                return Json(new { success = true, path = relativePath, dataObj = tables }, JsonRequestBehavior.AllowGet);
            }
            }
            return null;
        }

        public async Task<JsonResult> GetRowOfTableTemplate(Guid tableId)
        {
            using (var context = new WebDbContext())
            {
                var qry = context.TableTemplates.GroupJoin(
                  context.TableColumns,
                  t => t.Id,
                  col => col.TableTemplateId,
                  (x, y) => new { t = x, col = y }).Where(t => t.t.Id == tableId && t.t.Status != StatusEnum.Deleted)
                   .SelectMany(
                   x => x.col.DefaultIfEmpty(),
                   (x, y) => new {
                       ColId = y.Id,
                       Name = y.Name,
                       ColSpan = y.ColSpan,
                       RowSpan = y.RowSpan,
                       Order = y.Order,
                       //Foo = x.t,
                       //Bar = y
                   }).OrderBy(x => x.Order).ToList();

                string json = new JavaScriptSerializer().Serialize(qry);
                return Json(json, JsonRequestBehavior.DenyGet);
                //return null;
            }
        }
    }
}

public class DataTable1
{
    public string TName { get; set; }
    public string TType { get; set; }
    public List<TableColumnT> tableColumns { get; set; }
    public List<TableCellT> tableCell { get; set; }
    public List<TableValueT> tableValue { get; set; }
}

public class DataTemplateDTOBaoCao
{
    public string GName { get; set; }
    public List<DataTable1> Datas { get; set; }
}