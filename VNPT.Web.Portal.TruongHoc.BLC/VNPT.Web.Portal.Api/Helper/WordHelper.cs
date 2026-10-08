using DinkToPdf.Contracts;
using DinkToPdf;
using System.Collections.Generic;
using System.Linq;
using System.IO;
using Orientation = DinkToPdf.Orientation;
using System.Text;
using DocumentFormat.OpenXml.Packaging;
using HtmlToOpenXml;
using System.Web.UI.WebControls;
using DocumentFormat.OpenXml;
using DocumentFormat.OpenXml.Wordprocessing;
using Run = DocumentFormat.OpenXml.Wordprocessing.Run;
using Text = DocumentFormat.OpenXml.Wordprocessing.Text;
using NPOI.XWPF.UserModel;

namespace VNPT.Web.Portal.Api.Helper
{
    public class WordHelper
    {
        private readonly IConverter _converter;

        public WordHelper()
        {
            _converter = new SynchronizedConverter(new PdfTools());
        }

        public static void ReplaceTextInElement(OpenXmlElement element, Dictionary<string, string> replacements)
        {
            // Duyệt qua tất cả các phần tử con của element
            foreach (var childElement in element.Elements())
            {
                if (childElement is Paragraph)
                {
                    // Nếu là Paragraph, duyệt qua tất cả các phần tử con của nó
                    foreach (var run in childElement.Elements<Run>())
                    {
                        foreach (var text in run.Elements<Text>())
                        {
                            foreach (var kvp in replacements)
                            {
                                if (text.Text.Contains(kvp.Key))
                                {
                                    text.Text = text.Text.Replace(kvp.Key, kvp.Value);
                                }
                            }
                        }
                    }
                }
                else
                {
                    // Gọi đệ quy để duyệt qua các phần tử con khác
                    ReplaceTextInElement(childElement, replacements);
                }
            }
        }

        public static void ReplaceTextInDocument2(OpenXmlElement body, Dictionary<string, string> replacements)
        {
            foreach (var paragraph in body.Descendants<Paragraph>())
            {
                var runs = paragraph.Elements<Run>().ToList();
                string fullText = string.Join("", runs.Select(r => r.GetFirstChild<Text>()?.Text));

                // Nếu không chứa bất kỳ tag nào thì bỏ qua
                if (!replacements.Keys.Any(tag => fullText.Contains(tag)))
                    continue;

                // Thay thế toàn bộ tag trong full text
                foreach (var kvp in replacements)
                {
                    fullText = fullText.Replace(kvp.Key, kvp.Value);
                }

                // Xoá các Run cũ
                paragraph.RemoveAllChildren<Run>();

                // Tạo 1 Run mới chứa full text đã thay thế
                paragraph.AppendChild(new Run(new Text(fullText)));
            }
        }


        List<TableValueT> tableValues;
        List<TableColumnT> tableColumns;
        List<List<TableColumnT>> tableHeader;
        List<Dictionary<string, TableHandlerT.TableCellValueT>> tableRows;

        public void ReplaceAndExportWord(string templatePath, string exportPath, Dictionary<string, string> replacements, List<DataTemplateDTOBaoCao> tables)
        {
            // Sao chép file mẫu để tạo file mới
            File.Copy(templatePath, exportPath, true);

            using (WordprocessingDocument wordDocument = WordprocessingDocument.Open(exportPath, true))
            {
                // Lấy MainDocumentPart
                MainDocumentPart mainPart = wordDocument.MainDocumentPart;

                var body = wordDocument.MainDocumentPart.Document.Body;

                ReplaceTextInElement(body, replacements);

                if (mainPart != null)
                {
                    // Chuyển đổi HTML sang Open XML
                    var converter = new HtmlConverter(mainPart);

                    int gNameIndex = 1;
                    // Chèn các bảng vào tài liệu Word
                    foreach (var item in tables)
                    {
                        //var container = new StringBuilder();
                        string romanNumeral = ToRoman(gNameIndex);
                        var table = new StringBuilder();

                        // Thêm tiêu đề nhóm bảng
                        table.Append("<p style='margin-top:5px; margin-bottom:5px; font-size: 14px; font-family: Times New Roman, sans-serif;font-weight: bold'>");
                        table.Append(romanNumeral + ". " + item.GName.ToUpper());
                        table.Append("</p>");

                        int tNameIndex = 1;
                        foreach (var dataItem in item.Datas)
                        {
                            tableHeader = PopulateTableHeader(dataItem.tableColumns ?? new List<TableColumnT>());
                            tableValues = dataItem.tableValue ?? new List<TableValueT>();
                            tableColumns = PopulateTableCols(dataItem.tableColumns ?? new List<TableColumnT>());
                            tableRows = PopulateTableRows(dataItem.tableCell, tableValues);

                            if (dataItem.TType == "TABLE")
                            {
                                table.Append("<p style='margin-bottom:5px;font-size: 14px; font-family: Times New Roman, sans-serif;font-weight: bold'>");
                                table.Append(tNameIndex + ". " + dataItem.TName);
                                table.Append("</p>");

                                table.Append("<table border='1' width='595px' style='margin-bottom:10px;width: 595px;font-size: 14px; font-family: Times New Roman, sans-serif;'>");

                                // Tạo phần đầu của bảng
                                table.Append("<thead style='width: 100%;display:inline-block;padding-bottom: 30px;font-size: 16px; font-family: Times New Roman, sans-serif;'>");
                                foreach (var headerRow in tableHeader)
                                {
                                    table.Append("<tr>");
                                    foreach (var th in headerRow)
                                    {
                                        table.AppendFormat("<th colspan=\"{0}\" rowspan=\"{1}\" style='font-size: 14px; font-family: Times New Roman, sans-serif;font-weight: bold'>{2}</th>",
                                            th.ColSpan, th.RowSpan, th.Name);
                                    }
                                    table.Append("</tr>");
                                }
                                table.Append("</thead>");

                                // Tạo phần thân của bảng
                                table.Append("<tbody style='width: 100%;font-size: 14px; font-family: Times New Roman, sans-serif;'>");
                                foreach (var row in tableRows)
                                {
                                    table.Append("<tr>");
                                    foreach (var col in tableColumns)
                                    {
                                        var cellValue = row.ContainsKey(col.Id) ? row[col.Id].Value : string.Empty;
                                        table.AppendFormat("<td class=\"align-middle\" style=\"font-size: 14px; font-family: Times New Roman, sans-serif;\">{0}</td>", cellValue);
                                    }
                                    table.Append("</tr>");
                                }
                                table.Append("</tbody>");

                                table.Append("</table>");

                            }
                            else if(dataItem.TType == "LIST")
                            {
                                table.Append("<ul class=\"cusUl\"></ul>");

                                foreach (var row in tableRows)
                                {
                                    StringBuilder li = new StringBuilder();
                                    li.Append("<li style='margin-bottom:5px;font-size: 14px; font-family: Times New Roman, sans-serif;'>");

                                    for (int index = 0; index < tableColumns.Count; index++)
                                    {
                                        var col = tableColumns[index];
                                        var value = row[col.Id]?.Value ?? string.Empty;

                                        StringBuilder span = new StringBuilder();
                                        if (index == 0)
                                        {
                                            span.AppendFormat("<span style='font-size: 14px; font-family: Times New Roman, sans-serif;' >- {0}:", value);
                                        }
                                        else
                                        {
                                            span.AppendFormat(" {0}</span>", value);
                                        }
                                        li.Append(span.ToString());
                                    }
                                    li.Append("</li>");
                                   
                                    table.Append(li.ToString());
                                }

                            } else
                            {
                                foreach (var itee in dataItem.tableCell)
                                {
                                    table.Append("<p style='margin-bottom:5px;margin-top:5px;font-size: 14px; font-family: Times New Roman, sans-serif;'>");
                                    table.Append(itee.Value);
                                    table.Append("</p>");
                                }
                            }

                            tNameIndex++;
                        }

                        var paragraphs = converter.Parse(table.ToString());

                        foreach (var paragraph in paragraphs)
                        {
                            mainPart.Document.Body.Append(paragraph);
                        }

                        gNameIndex++;
                    }

                    var chuKy = new StringBuilder();
                    chuKy.Append("<p style='margin-left:220px;text-align:center;margin-bottom:5px;margin-top:15px;font-size: 14px; font-family: Times New Roman, sans-serif;font-weight: bold'>THỦ TRƯỞNG ĐƠN VỊ</p>");
                    chuKy.Append("<p style='margin-left:215px;text-align:center;margin-top:5px;font-size: 14px; font-family: Times New Roman, sans-serif;'>(ký tên và đóng dấu)</p>");

                    var paChuKy = converter.Parse(chuKy.ToString());

                    foreach (var tt in paChuKy)
                    {
                        mainPart.Document.Body.Append(tt);
                    }

                    mainPart.Document.Save();
                }

            }
        }

        public List<List<TableColumnT>> PopulateTableHeader(List<TableColumnT> columns)
        {
            var groupByRow = columns.GroupBy(c => c.RowNo);
            var rows = groupByRow.OrderBy(g => g.Key)
                                 .Select(g => g.OrderBy(c => c.Order).ToList())
                                 .ToList();
            return rows;
        }

        public List<TableColumnT> PopulateTableCols(List<TableColumnT> columns)
        {
            return columns.Where(col => col.ColSpan <= 1)
                          .OrderBy(col => col.ColNo)
                          .ToList();
        }

        public List<Dictionary<string, TableHandlerT.TableCellValueT>> PopulateTableRows(List<TableCellT> cells, List<TableValueT> tableValues1)
        {
            var groupByRow = cells.GroupBy(c => c.RowNo);
            var result = groupByRow.OrderBy(g => g.Key)
                                   .Select(g =>
                                   {
                                       var obj = new Dictionary<string, TableHandlerT.TableCellValueT>();
                                       foreach (var cell in g)
                                       {
                                           var tbtValue = tableValues1.FirstOrDefault(v => v.TableCellId == cell.Id);
                                           obj[cell.TableColumnId] = new TableHandlerT.TableCellValueT
                                           {
                                               Value = cell.ReadOnly ? cell.Value : tbtValue?.Value,
                                               //cell.Value,
                                               TableCellId = cell.Id,
                                               ReadOnly = cell.ValueType == "READONLY"
                                           };
                                       }
                                       return obj;
                                   })
                                   .ToList();
            return result;
        }

        //function populateTableRows(cells, tableValues)
        //{
        //    // Group cells by RowNo
        //    var groupByRow = { };
        //    $.each(cells, function(index, cell) {
        //        if (!groupByRow[cell.RowNo])
        //        {
        //            groupByRow[cell.RowNo] = [];
        //        }
        //        groupByRow[cell.RowNo].push(cell);
        //    });

        //    // Sort keys in ascending order and parse groupByRow to an array
        //    var result = $.map(Object.keys(groupByRow).sort(function(a, b) {
        //        return a - b;
        //    }), function(key) {
        //        var cells = groupByRow[key];
        //        var obj = { };

        //        $.each(cells, function(index, cell) {
        //            var tbtValue = tableValues.find(function(v) {
        //                return v.TableCellId === cell.Id;
        //            }) || { };

        //            obj[cell.TableColumnId] = {
        //                Value: cell.ReadOnly? cell.Value: tbtValue.Value,
        //                TableCellId: cell.Id,
        //                ReadOnly: cell.ReadOnly
        //            };
        //        });

        //        return obj;
        //    });

        //    return result;
        //}

        public void ConvertWordToPdf(string wordPath, string pdfPath)
        {
            // Đọc nội dung file Word
            string wordContent = File.ReadAllText(wordPath);

            // Chuyển đổi từ Word sang HTML rồi từ HTML sang PDF
            var pdfDocument = new HtmlToPdfDocument()
            {
                GlobalSettings = {
                ColorMode = ColorMode.Color,
                Orientation = Orientation.Portrait,
                PaperSize = PaperKind.A4
            },
                Objects = {
                new ObjectSettings()
                {
                    PagesCount = true,
                    HtmlContent = wordContent,
                    WebSettings = { DefaultEncoding = "utf-8" },
                    HeaderSettings = { FontName = "Arial", FontSize = 9, Right = "Page [page] of [toPage]", Line = true },
                    FooterSettings = { FontName = "Arial", FontSize = 9, Line = true, Center = "Footer" }
                }
            }
            };

            byte[] pdf = _converter.Convert(pdfDocument);
            File.WriteAllBytes(pdfPath, pdf);
        }

        public static string ToRoman(int number)
        {
            if (number < 1 || number > 3999) return string.Empty;
            string[] thousands = { "", "M", "MM", "MMM" };
            string[] hundreds = { "", "C", "CC", "CCC", "CD", "D", "DC", "DCC", "DCCC", "CM" };
            string[] tens = { "", "X", "XX", "XXX", "XL", "L", "LX", "LXX", "LXXX", "XC" };
            string[] ones = { "", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX" };
            return thousands[number / 1000] +
                   hundreds[(number % 1000) / 100] +
                   tens[(number % 100) / 10] +
                   ones[number % 10];
        }

    }

}

public class TableDataT
{
    public string GName { get; set; }
    //public List<Table> Datas { get; set; }
}

public class TableT
{
    public string TName { get; set; }
    public List<TableColumnT> TableColumns { get; set; }
    public List<TableCellT> TableCell { get; set; }
    public List<TableValueT> TableValue { get; set; }
}

public class TableColumnT
{
    public string Id { get; set; }
    public string TableTemplateId { get; set; }
    public string Name { get; set; }
    public string UnsignName { get; set; }
    public int RowNo { get; set; }
    public int ColNo { get; set; }
    public int ColSpan { get; set; }
    public int RowSpan { get; set; }
    public int Order { get; set; }
}

public class TableCellT
{
    public string Id { get; set; }
    public string TableTemplateId { get; set; }
    public string TableColumnId { get; set; }
    public int RowNo { get; set; }
    public int ColSpan { get; set; }
    public int RowSpan { get; set; }
    public string Value { get; set; }
    public string UnsignValue { get; set; }
    public string MinValue { get; set; }
    public string MaxValue { get; set; }
    public string ValueType { get; set; }
    public bool ReadOnly { get; set; }
}

public class TableValueT
{
    public string Id { get; set; }
    public string TableTemplateId { get; set; }
    public string TableCellId { get; set; }
    public string InputUnitId { get; set; }
    public string Period { get; set; }
    public string Value { get; set; }
    public string UnsignValue { get; set; }
}

public class TableHandlerT
{

    public class TableCellValueT
    {
        public string Value { get; set; }
        public string TableCellId { get; set; }
        public bool ReadOnly { get; set; }
    }
}
