using APIInterfaces.SystemTypes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace APIInterfaces.Interfaces
{
    public interface IKeyMapper<ExternalKeyT, InternalKeyT>
    {
        InternalKeyT FindInternal(ExternalKeyT externalKey);
        ExternalKeyT FindExternal(InternalKeyT internalKey);
    }
}
