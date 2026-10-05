using System;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using Microsoft.AspNet.Identity;
using VNPT.Core.Constants;
using VNPT.Core.Media.DAL;
using VNPT.Core.Media.DAL.Models;
using VNPT.Core.Models;
using VNPT.Web.Portal.Api.Providers;

namespace VNPT.Web.Portal.Api.Controllers
{
    [VnptAuthorization]
    public class MediaController : BaseApiController
    {
        [HttpPost]
        public async Task<IHttpActionResult> UploadFile()
        {
            try
            {
                var folderIdString = HttpContext.Current.Request["FolderId"] ?? "";
                var userId = User.Identity.GetUserName();
                var resultParse = Guid.TryParse(folderIdString, out var folderId);
                var fileType = HttpContext.Current.Request["FileType"] ?? "";
                var hasThumb = (HttpContext.Current.Request["HasThumb"] ?? "").ToLower() == "true";
                var result = await MediaService.UploadFile(new UploadFileModel()
                {
                    UserId = userId,
                    Files = HttpContext.Current.Request.Files,
                    FileType = fileType,
                    FolderId = folderId,
                    HasThumb = hasThumb
                });
                return Json(result);
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                return Json(new ResultModel()
                {
                    Code = ResultCode.UnSuccess,
                    Message = e.Message
                });
            }
        }

        [HttpPost]
        public async Task<IHttpActionResult> GetItemInFolder(FolderInputModel model)
        {
            try
            {
                model.UserId = User.Identity.GetUserName();
                var result = await MediaService.GetItemInFolder(model);
                return Json(result);
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                return Json(new ResultModel()
                {
                    Code = ResultCode.UnSuccess,
                    Message = e.Message
                });
            }
        }

        [HttpPost]
        public async Task<IHttpActionResult> SizeByUser(FolderModel model)
        {
            try
            {
                model.UserId = User.Identity.GetUserName();
                var result = await MediaService.SizeByUser(model);
                return Json(result);
            }
            catch (Exception e)
            {
                return Json(new ResultModel()
                {
                    Code = ResultCode.UnSuccess,
                    Message = e.Message
                });
            }
        }

        [HttpPost]
        public async Task<IHttpActionResult> DeleteFolder(FolderModel model)
        {
            try
            {
                model.UserId = User.Identity.GetUserName();
                var result = await MediaService.DeleteFolder(model);
                return Json(result);
            }
            catch (Exception e)
            {
                return Json(new ResultModel()
                {
                    Code = ResultCode.UnSuccess,
                    Message = e.Message
                });
            }
        }

        [HttpPost]
        public async Task<IHttpActionResult> DeleteFile(FileModel model)
        {
            try
            {
                model.UserId = User.Identity.GetUserName();
                var result = await MediaService.DeleteFile(model);
                return Json(result);
            }
            catch (Exception e)
            {
                return Json(new ResultModel()
                {
                    Code = ResultCode.UnSuccess,
                    Message = e.Message
                });
            }
        }


        [HttpPost]
        public async Task<IHttpActionResult> AddFolder(FolderModel model)
        {
            try
            {
                model.UserId = User.Identity.GetUserName();
                var result = await MediaService.AddFolder(model);
                return Json(result);
            }
            catch (Exception e)
            {
                return Json(new ResultModel()
                {
                    Code = ResultCode.UnSuccess,
                    Message = e.Message
                });
            }
        }
        [HttpPost]
        public async Task<IHttpActionResult> FoldersByUser(FolderModel model)
        {
            try
            {
                model.UserId = User.Identity.GetUserName();
                var result = await MediaService.FoldersByUser(model);
                return Json(result);
            }
            catch (Exception e)
            {
                return Json(new ResultModel()
                {
                    Code = ResultCode.UnSuccess,
                    Message = e.Message
                });
            }
        }

        [HttpPost]
        public async Task<IHttpActionResult> UploadFromUrl(UploadUrlModel model)
        {
            try
            {
                model.UserId = User.Identity.GetUserName();
                var result = await MediaService.UploadFromUrl(model);
                return Json(result);
            }
            catch (Exception e)
            {
                return Json(new ResultModel()
                {
                    Code = ResultCode.UnSuccess,
                    Message = e.Message
                });
            }
        }

    }

}
