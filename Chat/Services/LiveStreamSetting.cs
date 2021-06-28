using Microsoft.Extensions.Configuration;
using System;

namespace Chat.Services
{
	public class LiveStreamSetting
	{
		private readonly IConfiguration _config;

		public LiveStreamSetting(IConfiguration config)
		{
			_config = config.GetSection("LiveStreaming");
		}

		public string SubscriptionId
		{
			get { return _config["SubscriptionId"]; }
		}

		public string ResourceGroup
		{
			get { return _config["ResourceGroup"]; }
		}

		public string AccountName
		{
			get { return _config["AccountName"]; }
		}

		public string AadTenantId
		{
			get { return _config["AadTenantId"]; }
		}

		public string AadClientId
		{
			get { return _config["AadClientId"]; }
		}

		public string AadSecret
		{
			get { return _config["AadSecret"]; }
		}

		public Uri ArmAadAudience
		{
			get { return new Uri(_config["ArmAadAudience"]); }
		}

		public Uri AadEndpoint
		{
			get { return new Uri(_config["AadEndpoint"]); }
		}

		public Uri ArmEndpoint
		{
			get { return new Uri(_config["ArmEndpoint"]); }
		}

		public string StorageContainerName
		{
			get { return _config["StorageContainerName"]; }
		}

		public string StorageAccountName
		{
			get { return _config["StorageAccountName"]; }
		}

		public string StorageAccountKey
		{
			get { return _config["StorageAccountKey"]; }
		}

	}
}
