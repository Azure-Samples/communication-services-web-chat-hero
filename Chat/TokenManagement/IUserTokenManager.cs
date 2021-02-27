// © Microsoft Corporation. All rights reserved.

using Azure.Communication;
using Azure.Core;
using System.Threading.Tasks;

namespace Chat
{
	public interface IUserTokenManager
    {
        Task<(CommunicationUserIdentifier, AccessToken)> GenerateTokenAsync(string resourceConnectionString);
        Task<AccessToken> GenerateTokenAsync(string resourceConnectionString, string identity);
        Task<AccessToken> RefreshTokenAsync(string resourceConnectionString, string expiredToken);
    }
}
