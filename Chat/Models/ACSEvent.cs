using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Chat
{
    public class ACSEvent
    {
        public List<string> sessionThreadIds { get; set; }
        public List<string> sessionThreadModeratorIds { get; set; }
    }
}
