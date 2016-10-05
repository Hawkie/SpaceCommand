using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace APIInterfaces
{
    public class Result<K>
    {
        public K Key { get; private set; }
        public bool Updated { get; private set; }
        public string Description { get; private set; }
        public bool Created { get; private set; }

        public Result(K key, bool updated, bool created, string description = null)
        {
            Created = created;
            Description = description;
            this.Key = key;
            this.Updated = updated;
        }
    }

    public class Record<K, V>
        {
            public V Value { get; private set; }
            public K Key { get; private set; }

            public Record(K key, V value)
            {
                Key = key;
                this.Value = value;
            }
        }
}
