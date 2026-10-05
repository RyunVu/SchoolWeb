using log4net.Config;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Hosting;
using log4net;

namespace VNPT.Web.Portal.Api.Providers
{
    public class LogService
    {
        public LogService([System.Runtime.CompilerServices.CallerFilePath] string logCategory = "")
        {
            if (logCategory.IndexOfAny(new[] { '\\', '/' }) != -1)
                logCategory = Path.GetFileName(logCategory);
            XmlConfigurator.Configure(new System.IO.FileInfo(HostingEnvironment.MapPath("/Log4Net.config")));
            _logger = LogManager.GetLogger(logCategory);

        }
        private ILog _logger { get; set; }

        public void LogInfo(string message)
        {
            _logger.Info(message);
        }

        public void LogWarn(string message)
        {
            _logger.Warn(message);
        }

        public void LogError(string message)
        {
            _logger.Error(message);
        }

        public void LogError(string message, Exception exception)
        {
            _logger.Error(message, exception);
        }

        public void LogError(string message, string exception)
        {
            _logger.Error($"{message}: {exception}");
        }
    }

}