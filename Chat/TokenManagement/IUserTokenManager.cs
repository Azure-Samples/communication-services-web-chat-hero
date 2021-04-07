// © Microsoft Corporation. All rights reserved.

using Azure.Communication.Identity;
using Azure.Core;
using System.Threading.Tasks;

namespace Chat
{
	public interface IUserTokenManager
    {
        Task<CommunicationUserIdentifierAndToken> GenerateTokenAsync(string resourceConnectionString);
        Task<AccessToken> GenerateTokenAsync(string resourceConnectionString, string identity);
        Task<AccessToken> RefreshTokenAsync(string resourceConnectionString, string expiredToken);
    }
}
