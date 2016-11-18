using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Interfaces.SystemTypes
{
    public class Result<SystemKeyT>
    {
        public SystemKeyT Key { get; private set; }
        public bool Found { get; }
        public bool Updated { get; }
        public bool Created { get; private set; }
        public string Description { get; private set; }

        public Result(SystemKeyT key, bool found, bool updated, bool created, string description = null)
        {
            Description = description;
            Key = key;
            Found = found;
            Created = created;
            Updated = updated;
        }
    }
}
