﻿using APIInterfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using APIInterfaces.Interfaces;
using APIInterfaces.SystemTypes;

namespace APIDictionary
{
    public class DictionaryData<KeyType, ValueType> : IDataLayer<KeyType, ValueType>
    {
        // key generation

        private IDictionary<KeyType, ValueType> dataCollection { get; }
        private Func<ValueType, KeyType> KeyGen { get; set; }

        public DictionaryData(IDictionary<KeyType, ValueType> dataObjects, Func<ValueType, KeyType> keyGen)
        {
            this.KeyGen = keyGen;
            this.dataCollection = new Dictionary<KeyType, ValueType>();
            foreach (var d in dataObjects)
                dataCollection.Add(d.Key, d.Value);
        }

        public KeyType Create(ValueType value)
        {
            if (KeyGen != null)
            {
                var k = KeyGen(value);
                if (!dataCollection.ContainsKey(k))
                {
                    dataCollection.Add(k, value);
                    return new Result<KeyType>(k, false, false, true);
                }
                return new Result<KeyType>(k, false, false, false, string.Format("Generated Key already exists {0}", k));
            }
            throw new MissingMemberException("Null Key generator for Create");
        }


        public ValueType Read(KeyType key)
        {
            ValueType value = default(ValueType);
            if (dataCollection.TryGetValue(key, out value))
                return value;
            return null;
        }



        public Result<ValueType> Update(KeyValuePair<KeyType, ValueType> kv)
        {
            if (dataCollection.ContainsKey(kv.Key))
            {
                dataCollection.Remove(kv.Key);
                dataCollection.Add(kv.Key, kv.Value);
                return true;
            }
            return false;
        }

        public Result<ValueType> Delete(KeyType key)
        {
            return dataCollection.Remove(key);
        }
    }
}
