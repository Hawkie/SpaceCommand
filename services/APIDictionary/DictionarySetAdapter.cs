using APIInterfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using APIInterfaces.Interfaces;
using APIInterfaces.SystemTypes;

namespace APIDictionary
{
    public class DictionarySetAdapter<KeyType, ValueType> : IDataLayer<KeyType, ValueType>
    {
        // key generation

        private Dictionary<KeyType, ValueType> dataCollection { get; }
        private Func<ValueType, KeyType> KeyGen { get; set; }

        public DictionarySetRetriever(IEnumerable<Record<KeyType, ValueType>> dataObjects, Func<ValueType, KeyType> keyGen)
        {
            KeyGen = keyGen;
            this.dataCollection = new Dictionary<KeyType, ValueType>();
            foreach (var d in dataObjects)
                dataCollection.Add(d.Key, d.Value);
        }

        public IEnumerable<Record<KeyType, ValueType>> Find(string queryString = null)
        {
            if (string.IsNullOrEmpty(queryString))
                return dataCollection.Select(kv => new Record<KeyType, ValueType>(kv.Key, kv.Value));
            return new Record<KeyType, ValueType>[] { };
        }

        public Result<KeyType> Create(ValueType value)
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

        public IEnumerable<Result<KeyType>> Create(IEnumerable<ValueType> values)
        {
            var l = new List<Result<KeyType>>();
            foreach (var v in values)
            {
                var result = Create(v);
                if (result.Created) l.Add(result);
            }
            return l;
        }

        public Record<KeyType, ValueType> Read(KeyType key)
        {
            ValueType value = default(ValueType);
            if (dataCollection.TryGetValue(key, out value))
                return new Record<KeyType, ValueType>(key, value);
            return null;
        }


        public IEnumerable<Record<KeyType, ValueType>> Read(IEnumerable<KeyType> keys)
        {
            var l = new List<Record<KeyType, ValueType>>();
            foreach (var k in keys)
            {
                var r = Read(k);
                if (r != null)
                    l.Add(r);
            }
            return l;
        }

        public bool Update(KeyValuePair<KeyType, ValueType> kv)
        {
            if (dataCollection.ContainsKey(kv.Key))
            {
                dataCollection.Remove(kv.Key);
                dataCollection.Add(kv.Key, kv.Value);
                return true;
            }
            return false;
        }

        public IEnumerable<KeyType> Update(IEnumerable<KeyValuePair<KeyType, ValueType>> values)
        {
            var l = new List<KeyType>();
            foreach (var kv in values)
            {
                if (Update(kv))
                    l.Add(kv.Key);
            }
            return l;
        }

        public bool Delete(KeyType key)
        {
            return dataCollection.Remove(key);
        }

        public IEnumerable<KeyType> Delete(IEnumerable<KeyType> keys)
        {
            var l = new List<KeyType>();
            foreach (var k in keys)
            {
                if (Delete(k))
                    l.Add(k);
            }
            return l;
        }
    }

}
