// © Microsoft Corporation. All rights reserved.

using Azure.Core;
using System.Collections.Generic;
using System.Text.Json;

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
			initializeHardCodedValues();
		}

		private void initializeHardCodedValues()
        {
			var eventInfo = new ACSEvent
			{
				Id = "acs_ve_06_07_2021",
				ChatSessionThreadId = "19:EV6bzyGuXSRPBmp2bo4BHlbjsfyLLtFOkB8KjZiHb201@thread.v2",
				ChatSessionThreadModeratorId = "8:acs:85c99b9e-f6e1-408c-90d9-e37b6ad0e7c3_0000000a-baee-fdc5-28c5-593a0d000c27",

				Rooms = new List<ACSRoom>()
				{
					new ACSRoom
					{
						Id = "room1",
						ChatSessionThreadId = "19:4YD7S71M4TG0HEQWahNcgYfQ4KsYPjPdkKgHmDpEoSc1@thread.v2",
						ChatSessionThreadModeratorId = "8:acs:85c99b9e-f6e1-408c-90d9-e37b6ad0e7c3_0000000a-baef-95a7-28c5-593a0d000c31",
						CallingSessionId = "4fa24250-d478-11eb-a4fa-bb783cfd38e0"
					}
				}
			};

			Store.Add("acs_ve_06_07_2021", JsonSerializer.Serialize(eventInfo));
		}
	}
}
