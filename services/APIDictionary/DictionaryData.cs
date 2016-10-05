using APIInterfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace APIDictionary
{
    public class DictionaryData<K, V> : IDataLayer<K, V>
    {
        // key generation

        private Dictionary<K, V> dataCollection { get; }
        private Func<V, K> KeyGen { get; set; }

        public DictionaryData(IEnumerable<Record<K, V>> dataObjects, Func<V, K> keyGen)
        {
            KeyGen = keyGen;
            this.dataCollection = new Dictionary<K, V>();
            foreach (var d in dataObjects)
                dataCollection.Add(d.Key, d.Value);
        }

        public IEnumerable<KeyValuePair<K, V>> GetAll()
        {
            return dataCollection.ToList();
        }


        public Record<K, V> Get(K key)
        {
            Record<K, V> record = null;
            V value = default(V);
            if (dataCollection.TryGetValue(key, out value))
                record = new Record<K, V>(key, value);
            return record;
        }


        public IEnumerable<Record<K, V>> Get(IEnumerable<K> keys)
        {
            var l = new List<Record<K, V>>();
            foreach (var k in keys)
            {
                var r = Get(k);
                if (r != null)
                    l.Add(r);
            }
            return l;
        }

        public IEnumerable<Record<K, V>> Find(IEnumerable<K> keys)
        {
            throw new NotImplementedException();
        }

        public Result<K> Create(V value)
        {
            if (KeyGen != null)
            {
                var k = KeyGen(value);
                if (!dataCollection.ContainsKey(k))
                {
                    dataCollection.Add(k, value);
                    return new Result<K>(k, false, true);
                }
                return new Result<K>(k, false, false, string.Format("Generated Key already exists {0}", k));
            }
            throw new MissingMemberException("Null Key generator for Create");
        }

        public IEnumerable<Result<K>> Create(IEnumerable<V> values)
        {
            var l = new List<Result<K>>();
            foreach (var v in values)
            {
                var result = Create(v);
                if (result.Created) l.Add(result);
            }
            return l;
        }

        public bool Update(KeyValuePair<K, V> kv)
        {
            if (dataCollection.ContainsKey(kv.Key))
            {
                dataCollection.Remove(kv.Key);
                dataCollection.Add(kv.Key, kv.Value);
                return true;
            }
            return false;
        }

        public IEnumerable<K> Update(IEnumerable<KeyValuePair<K, V>> values)
        {
            var l = new List<K>();
            foreach (var kv in values)
            {
                if (Update(kv))
                    l.Add(kv.Key);
            }
            return l;
        }

        public Result<K> UpdateCreate(KeyValuePair<K, V> kv)
        {
            if (this.Update(kv))
            {
                return new Result<K>(kv.Key, true, false);
            }
            return this.Create(kv.Value);
        }

        public IEnumerable<Result<K>> UpdateCreate(IEnumerable<KeyValuePair<K, V>> values)
        {
            var r = new List<Result<K>>();
            foreach (var kv in values)
            {
                var result = UpdateCreate(kv);
                r.Add(result);
            }
            return r;
        }

        public bool Remove(K key)
        {
            return dataCollection.Remove(key);
        }

        public IEnumerable<K> Remove(IEnumerable<K> keys)
        {
            var l = new List<K>();
            foreach (var k in keys)
            {
                if (Remove(k))
                    l.Add(k);
            }
            return l;
        }
    }

}
