using APIInterfaces.SystemTypes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace APIInterfaces.Interfaces
{
    public interface IKeyMapper<ExternalKeyT, InternalKeyT>
    {
        Result<InternalKeyT> Find(ExternalKeyT externalKey);
    }
}
