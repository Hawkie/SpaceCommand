using APIInterfaces.SystemTypes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace APIInterfaces.Interfaces
{
    public interface IKeyMapper<ExternalKeyType, InternalKeyType>
    {
        InternalKeyType FindInternal(ExternalKeyType externalKey);
        ExternalKeyType FindExternal(InternalKeyType internalKey);
    }
}
