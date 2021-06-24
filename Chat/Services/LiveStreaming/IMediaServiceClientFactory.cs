using Microsoft.Azure.Management.Media;
using System.Threading.Tasks;

namespace Chat.Services.LiveStreaming
{
	public interface IMediaServiceClientFactory
	{
		Task<IAzureMediaServicesClient> CreateMediaServicesClientAsync(LiveStreamSetting config);
	}
}
