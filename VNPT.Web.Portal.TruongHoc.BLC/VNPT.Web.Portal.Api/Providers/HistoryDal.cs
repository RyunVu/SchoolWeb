using System;
using Newtonsoft.Json;
using VNPT.Web.Portal.Base;

namespace VNPT.Web.Portal.Api.Providers
{
    public class OtherFromHistory
    {
        public Guid Id { get; set; }
        public Guid HistoryId { get; set; }

        public HistoryActionEnum Action { get; set; }

        public string TableName { get; set; }

        public string Description { get; set; }
    }
    public class HistoryDal
    {
        public static Guid Write(string userId, string tableName, HistoryActionEnum action, string id, object oldVersion, object newVersion, string currentIp, Guid? parentId = null, OtherFromHistory note = null, WebDbContext context = null)
        {
            var guid = Guid.Parse(id);
            return Write(userId, tableName, action, guid, oldVersion, newVersion, currentIp, parentId, note, context);
        }

        public static Guid Write(string userId, string tableName, HistoryActionEnum action, Guid id, object oldVersion, object newVersion, string currentIp, Guid? parentId = null, OtherFromHistory note = null, WebDbContext context = null)
        {
            if (context == null)
            {
                using (context = new WebDbContext())
                {
                    var noteString = "{}";
                    if (note != null)
                    {
                        noteString = JsonConvert.SerializeObject(note);
                    }
                    var history = new History()
                    {
                        Id = Guid.NewGuid(),
                        Action = action,
                        CreateDate = DateTime.Now,
                        CreateUserId = userId,
                        OldVersion = JsonConvert.SerializeObject(oldVersion),
                        NewVersion = JsonConvert.SerializeObject(newVersion),
                        ItemId = id,
                        TableName = tableName,
                        Description = noteString,
                        ParentId = parentId, 
                        CurrentIp = currentIp
                    };
                    context.Histories.Add(history);
                    context.SaveChanges();
                    return history.Id;
                }

            }
            else
            {
                var noteString = "{}";
                if (note != null)
                {
                    noteString = JsonConvert.SerializeObject(note);
                }
                var history = new History()
                {
                    Id = Guid.NewGuid(),
                    Action = action,
                    CreateDate = DateTime.Now,
                    CreateUserId = userId,
                    OldVersion = JsonConvert.SerializeObject(oldVersion),
                    NewVersion = JsonConvert.SerializeObject(newVersion),
                    ItemId = id,
                    TableName = tableName,
                    Description = noteString,
                    ParentId = parentId
                };
                context.Histories.Add(history);
                context.SaveChanges();
                return history.Id;
            }
        }
    }
}