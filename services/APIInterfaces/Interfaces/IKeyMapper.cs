using APIInterfaces.SystemTypes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace APIInterfaces.Interfaces
{
    public interface IKeyMapper<ExternalT, InternalT>
    {
        InternalT FindInternal(ExternalT externalKey);
        ExternalT FindExternal(InternalT internalKey);
    }
}
