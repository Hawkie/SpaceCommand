using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace APIInterfaces.SystemTypes
{
    public class KeyMapItem<ExternalT, InternalT>
    {
        public KeyMapItem(ExternalT externalKey, InternalT internalKey)
        {
            ExternalKey = externalKey;
            InternalKey = internalKey;
        }

        public ExternalT ExternalKey { get; }
        public InternalT InternalKey { get; }
    }
}
