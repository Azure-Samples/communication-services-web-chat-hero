// © Microsoft Corporation. All rights reserved.

using Azure.Communication;
using Azure.Communication.Identity;
using Azure.Core;
using System.Threading.Tasks;

namespace Chat
{
    public class UserTokenManager : IUserTokenManager
    {
        public async Task<(CommunicationUserIdentifier, AccessToken)> GenerateTokenAsync(string resourceConnectionString)
        {
            try
            {
                var communicationIdentityClient = new CommunicationIdentityClient(resourceConnectionString);
                var userResponse = await communicationIdentityClient.CreateUserWithTokenAsync(scopes: new[] { CommunicationTokenScope.Chat });
                return userResponse.Value;
            }
            catch
            {
                throw;
            }
        }

        public async Task<AccessToken> GenerateTokenAsync(string resourceConnectionString, string identity)
		{
            try
            {
                var communicationIdentityClient = new CommunicationIdentityClient(resourceConnectionString);
                var userResponse = await communicationIdentityClient.IssueTokenAsync(new CommunicationUserIdentifier(identity), scopes: new[] { CommunicationTokenScope.Chat });
                return userResponse.Value;
            }
            catch
            {
                throw;
            }
        }

        public async Task<AccessToken> RefreshTokenAsync(string resourceConnectionString, string identity)
        {
            try
            {
                var communicationIdentityClient = new CommunicationIdentityClient(resourceConnectionString);
                var user = new CommunicationUserIdentifier(identity);
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
