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

        public Result(K key, bool updated, string description = null)
        {
            Description = description;
            this.Key = key;
            this.Updated = updated;
        }
    }

    public class Record<K, V> : Result<K>
        {
            public V Value { get; private set; }
            public Record(K key, V value, bool success = true) : base(key, success)
            {
                this.Value = value;
            }
        }
}
