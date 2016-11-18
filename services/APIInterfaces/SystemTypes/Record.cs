using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace APIInterfaces.SystemTypes
{
    public class Record<KeyType, ValueType>
    {
        public Record(KeyType key, ValueType value)
        {
            Key = key;
            Value = value;
        }

        public KeyType Key { get; }
        public ValueType Value { get; }
    }
}
