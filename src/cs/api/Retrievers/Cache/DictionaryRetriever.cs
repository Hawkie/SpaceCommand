using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using API.Interfaces;
using API.Interfaces.SystemTypes;

namespace API.Retrievers.Cache
{
    public class DictionaryRetriever<KeyType, ValueType> : IDataLayer<KeyType, ValueType>
    {
        // key generation
        private IDictionary<KeyType, ValueType> dataCollection { get; }
        private Func<ValueType, KeyType> KeyGen { get; set; }

        public DictionaryRetriever(IDictionary<KeyType, ValueType> dataObjects, Func<ValueType, KeyType> keyGen)
        {
            this.KeyGen = keyGen;
            this.dataCollection = new Dictionary<KeyType, ValueType>();
            foreach (var d in dataObjects)
                dataCollection.Add(d.Key, d.Value);
        }

        /// Retrieval
        public IEnumerable<KeyValuePair<KeyType, ValueType>> Find(Func<ValueType, bool> selector)
        {
            return dataCollection.ToList().Where(x => selector(x.Value));
        }

        public ValueType Read(KeyType key)
        {
            var value = default(ValueType);
            if (dataCollection.TryGetValue(key, out value))
                return value;
            return default(ValueType);
        }

        /// <summary>
        /// Persistance
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        public KeyType Create(ValueType value)
        {
            if (KeyGen != null)
            {
                var k = KeyGen(value);
                if (!dataCollection.ContainsKey(k))
                {
                    dataCollection.Add(k, value);
                    return k;
                }
                return default(KeyType);
            }
            throw new MissingMemberException("No key generator set");
        }

        public bool Update(KeyValuePair<KeyType, ValueType> kv)
        {
            var existing = default(ValueType);
            if (dataCollection.TryGetValue(kv.Key, out existing))
            {
                dataCollection.Remove(kv.Key);
                dataCollection.Add(kv.Key, kv.Value);
                return true;
            }
            return false;
        }

        public bool Delete(KeyType key)
        {
            return dataCollection.Remove(key);
        }
    }
}
