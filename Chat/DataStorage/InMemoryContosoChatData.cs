// © Microsoft Corporation. All rights reserved.

using Azure.Core;
using System.Collections.Generic;

namespace Chat
{
	public class InMemoryChatAdminThreadStore : IChatAdminThreadStore
	{
		public Dictionary<string, string> Store { get; }

		public Dictionary<string, ContosoUserConfigModel> UseConfigStore { get; }

		/// <summary>
		/// To maintain a storage of all of the chat threads and their associated moderater "users" to add in new users
		/// </summary>
		public InMemoryChatAdminThreadStore()
		{
			Store = new Dictionary<string, string>();
			UseConfigStore = new Dictionary<string, ContosoUserConfigModel>();
		}
	}
}
