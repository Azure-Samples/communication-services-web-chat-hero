// © Microsoft Corporation. All rights reserved.

using Azure.Communication.Administration.Models;
using System.Collections.Generic;

namespace Chat
{
	public interface IChatAdminThreadStore
	{
		Dictionary<string, CommunicationUserToken> Store { get; }
		Dictionary<string, ContosoUserConfigModel> UseConfigStore { get; }
	}
}
