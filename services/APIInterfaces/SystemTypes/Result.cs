using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace APIInterfaces.SystemTypes
{
    public class Result<SystemKeyT>
    {
        public SystemKeyT Key { get; private set; }
        public bool Updated { get; private set; }
        public string Description { get; private set; }
        public bool Created { get; private set; }

        public Result(SystemKeyT key, bool updated, bool created, string description = null)
        {
            Created = created;
            Description = description;
            this.Key = key;
            this.Updated = updated;
        }
    }
}
