// © Microsoft Corporation. All rights reserved.

using Azure.Communication;
using Azure.Communication.Administration;
using Azure.Communication.Administration.Models;
using System.Threading.Tasks;

namespace Chat
{
	public class UserTokenManager : IUserTokenManager
    {
        public async Task<CommunicationUserToken> GenerateTokenAsync(string resourceConnectionString)
        {
            try
            {
                var communicationIdentityClient = new CommunicationIdentityClient(resourceConnectionString);
                var userResponse = await communicationIdentityClient.CreateUserAsync();
                var user = userResponse.Value;
                var tokenResponse = await communicationIdentityClient.IssueTokenAsync(user, scopes: new[] { CommunicationTokenScope.Chat });
                return tokenResponse;
            }
            catch
            {
                throw;
            }
        }

        public async Task<CommunicationUserToken> RefreshTokenAsync(string resourceConnectionString, string identity)
        {
            try
            {
                var communicationIdentityClient = new CommunicationIdentityClient(resourceConnectionString);
                var user = new CommunicationUser(identity);
                var tokenResponse = await communicationIdentityClient.IssueTokenAsync(user, scopes: new[] { CommunicationTokenScope.Chat });
                return tokenResponse;
            }
            catch
            {
                throw;
            }
        }
    }
}
