using Chat.Services.LiveStreaming;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Chat
{
	[ApiController]
	public class LiveStreamsController : Controller
	{
		private readonly ILiveStreamingService _liveStreamingService;

		public LiveStreamsController(ILiveStreamingService liveStreamingService)
		{
			_liveStreamingService = liveStreamingService;
		}

		[Route("livestream/{roomId}")]
		[HttpPost]
		public async Task<IActionResult> Start(string roomId)
		{
			var startResult = await _liveStreamingService.Start(roomId);

			return this.Ok(startResult);
		}

		[Route("livestream/{roomId}")]
		[HttpDelete]
		public async Task<IActionResult> Stop(string roomId)
		{
			await _liveStreamingService.Stop(roomId);

			return this.Ok();
		}
	}
}
