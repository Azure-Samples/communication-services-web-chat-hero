// © Microsoft Corporation. All rights reserved.

using Chat.Services.LiveStreaming;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;

namespace Chat
{
	public static class ServiceCollectionExtensions
	{
		public static IServiceCollection AddContosoServices(this IServiceCollection serviceCollection, IConfiguration chatConfigurationSection)
		{
			_ = serviceCollection ?? throw new ArgumentNullException(nameof(serviceCollection));

			serviceCollection.Configure<ContosoSettings>(options =>
			{
				options.ChatGatewayUrl = ExtractApiChatGatewayUrl(chatConfigurationSection["ResourceConnectionString"]);
				options.ResourceConnectionString = chatConfigurationSection["ResourceConnectionString"];
			});
			serviceCollection.AddSingleton<IUserTokenManager, UserTokenManager>();
			serviceCollection.AddTransient<IMediaServiceClientFactory, MediaServiceClientFactory>();
			serviceCollection.AddSingleton<ILiveStreamingService, LiveStreamingService>();

			// This is purely for the handshake server
			serviceCollection.AddSingleton<IChatAdminThreadStore, InMemoryChatAdminThreadStore>();
			return serviceCollection;
		}

		private static string ExtractApiChatGatewayUrl(string resourceConnectionString)
		{
			var uri = new Uri(resourceConnectionString.Replace("endpoint=", string.Empty, StringComparison.OrdinalIgnoreCase));
			return $"{uri.Scheme}://{uri.Host}";
		}
	}
}