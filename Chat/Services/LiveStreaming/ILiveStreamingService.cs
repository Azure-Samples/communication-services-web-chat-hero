using Chat.Models;
using System.Threading.Tasks;

namespace Chat.Services.LiveStreaming
{
	public interface ILiveStreamingService
	{
		Task<LiveStreamStartedResult> Start(string roomId);
		Task Stop(string roomId);
	}
}
