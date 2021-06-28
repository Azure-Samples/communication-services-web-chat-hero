using Microsoft.Azure.Management.Media;
using Microsoft.Identity.Client;
using Microsoft.Rest;
using System.Threading.Tasks;

namespace Chat.Services.LiveStreaming
{
	public class MediaServiceClientFactory : IMediaServiceClientFactory
	{
		public static readonly string TokenType = "Bearer";

		public async Task<IAzureMediaServicesClient> CreateMediaServicesClientAsync(LiveStreamSetting config)
		{
			ServiceClientCredentials credentials = await GetCredentialsAsync(config);

			return new AzureMediaServicesClient(config.ArmEndpoint, credentials)
			{
				SubscriptionId = config.SubscriptionId,
			};
		}

		private async Task<ServiceClientCredentials> GetCredentialsAsync(LiveStreamSetting config)
		{
			// Use ConfidentialClientApplicationBuilder.AcquireTokenForClient to get a token using a service principal with symmetric key

			var scopes = new[] { config.ArmAadAudience + "/.default" };

			var app = ConfidentialClientApplicationBuilder.Create(config.AadClientId)
				.WithClientSecret(config.AadSecret)
				.WithAuthority(AzureCloudInstance.AzurePublic, config.AadTenantId)
				.Build();

			var authResult = await app.AcquireTokenForClient(scopes)
				.ExecuteAsync()
				.ConfigureAwait(false);

			return new TokenCredentials(authResult.AccessToken, TokenType);
		}
	}
}
