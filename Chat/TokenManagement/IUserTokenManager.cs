// © Microsoft Corporation. All rights reserved.

using Azure.Communication.Administration.Models;
using System.Threading.Tasks;

namespace Chat
{
	public interface IUserTokenManager
    {
        Task<CommunicationUserToken> GenerateTokenAsync(string resourceConnectionString);
        Task<CommunicationUserToken> RefreshTokenAsync(string resourceConnectionString, string expiredToken);
    }
}
