using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace APIInterfaces.SystemTypes
{
    public class Record<SystemKeyT, V>
    {
        public SystemKeyT Key { get; private set; }
        public V Value { get; private set; }
        
        public Record(SystemKeyT key, V value)
        {
            Key = key;
            Value = value;
        }
    }
}
