using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using VNPT.Core.Models;

namespace VNPT.Web.Portal.Base
{
    public class GroupTable: BaseModel
    {
        [Key]
        public Guid Id { get; set; }
        public Guid? ParentId { get; set; }
        [MaxLength(1000)]
        public string Name { get; set; }
        [MaxLength(1000)]
        public string UnsignName { get; set; }
        public string Metadata { get; set; }
        public int Order { get; set; }

        [ForeignKey("ParentId")]
        public virtual GroupTable Parent { get; set; }
        public virtual ICollection<GroupTable> Children { get; set; }
    }

    public class TableTemplate : BaseModel
    {
        [Key]
        public Guid Id { get; set; }
        public Guid GroupTableId { get; set; }
        [MaxLength(500)]
        public string Name { get; set; }
        [MaxLength(500)]
        public string UnsignName { get; set; }
        [MaxLength(50)]
        public string Type { get; set; }
        [MaxLength(20)]
        public string PeriodType { get; set; }
        public string Metadata { get; set; }
        public int Order { get; set; }
    }

    public class TableColumn : BaseModel
    {
        [Key]
        public Guid Id { get; set; }
        public Guid TableTemplateId { get; set; }
        [MaxLength(1000)]
        public string Name { get; set; }
        [MaxLength(1000)]
        public string UnsignName { get; set; }
        public int RowNo { get; set; }
        public int ColNo { get; set; }
        public int ColSpan { get; set; }
        public int RowSpan { get; set; }
        public string Metadata { get; set; }
        public int Order { get; set; }
    }

    public class TableCell : BaseModel
    {
        [Key]
        public Guid Id { get; set; }

        public Guid TableTemplateId { get; set; }
        public Guid TableColumnId { get; set; }
        public int RowNo { get; set; }
        public int ColSpan { get; set; }
        public int RowSpan { get; set; }
        [MaxLength(500)]
        public string Value { get; set; }
        [MaxLength(500)]
        public string UnsignValue { get; set; }
        [MaxLength(500)]
        public string MinValue { get; set; }
        [MaxLength(500)]
        public string MaxValue { get; set; }
        [MaxLength(50)]
        public string ValueType { get; set; }
        public bool ReadOnly { get; set; }
        public string Metadata { get; set; }
    }

    public class TableValue : BaseModel
    {
        [Key]
        public Guid Id { get; set; }
        public Guid TableTemplateId { get; set; }
        public Guid TableCellId { get; set; }
        public Guid? InputUnitId { get; set; }
        public string Period { get; set; }
        [MaxLength(500)]
        public string Value { get; set; }
        [MaxLength(500)]
        public string UnsignValue { get; set; }
        public string Metadata { get; set; }
    }
}
