using APIInterfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using APIInterfaces.Interfaces;
using APIInterfaces.SystemTypes;

namespace APIDictionary
{
    public class DictionaryData<SystemKeyT, V> : IDataLayer<SystemKeyT, V>
    {
        // key generation

        private Dictionary<SystemKeyT, V> dataCollection { get; }
        private Func<V, SystemKeyT> KeyGen { get; set; }

        public DictionaryData(IEnumerable<Record<SystemKeyT, V>> dataObjects, Func<V, SystemKeyT> keyGen)
        {
            KeyGen = keyGen;
            this.dataCollection = new Dictionary<SystemKeyT, V>();
            foreach (var d in dataObjects)
                dataCollection.Add(d.Key, d.Value);
        }

        public IEnumerable<KeyValuePair<SystemKeyT, V>> GetAll()
        {
            return dataCollection.ToList();
        }


        public Record<SystemKeyT, V> Get(SystemKeyT key)
        {
            Record<SystemKeyT, V> record = null;
            V value = default(V);
            if (dataCollection.TryGetValue(key, out value))
                record = new Record<SystemKeyT, V>(key, value);
            return record;
        }


        public IEnumerable<Record<SystemKeyT, V>> Get(IEnumerable<SystemKeyT> keys)
        {
            var l = new List<Record<SystemKeyT, V>>();
            foreach (var k in keys)
            {
                var r = Get(k);
                if (r != null)
                    l.Add(r);
            }
            return l;
        }

        public IEnumerable<Record<SystemKeyT, V>> Find(IEnumerable<SystemKeyT> keys)
        {
            throw new NotImplementedException();
        }

        public Result<SystemKeyT> Create(V value)
        {
            if (KeyGen != null)
            {
                var k = KeyGen(value);
                if (!dataCollection.ContainsKey(k))
                {
                    dataCollection.Add(k, value);
                    return new Result<SystemKeyT>(k, false, true);
                }
                return new Result<SystemKeyT>(k, false, false, string.Format("Generated Key already exists {0}", k));
            }
            throw new MissingMemberException("Null Key generator for Create");
        }

        public IEnumerable<Result<SystemKeyT>> Create(IEnumerable<V> values)
        {
            var l = new List<Result<SystemKeyT>>();
            foreach (var v in values)
            {
                var result = Create(v);
                if (result.Created) l.Add(result);
            }
            return l;
        }

        public bool Update(KeyValuePair<SystemKeyT, V> kv)
        {
            if (dataCollection.ContainsKey(kv.Key))
            {
                dataCollection.Remove(kv.Key);
                dataCollection.Add(kv.Key, kv.Value);
                return true;
            }
            return false;
        }

        public IEnumerable<SystemKeyT> Update(IEnumerable<KeyValuePair<SystemKeyT, V>> values)
        {
            var l = new List<SystemKeyT>();
            foreach (var kv in values)
            {
                if (Update(kv))
                    l.Add(kv.Key);
            }
            return l;
        }

        public Result<SystemKeyT> UpdateCreate(KeyValuePair<SystemKeyT, V> kv)
        {
            if (this.Update(kv))
            {
                return new Result<SystemKeyT>(kv.Key, true, false);
            }
            return this.Create(kv.Value);
        }

        public IEnumerable<Result<SystemKeyT>> UpdateCreate(IEnumerable<KeyValuePair<SystemKeyT, V>> values)
        {
            var r = new List<Result<SystemKeyT>>();
            foreach (var kv in values)
            {
                var result = UpdateCreate(kv);
                r.Add(result);
            }
            return r;
        }

        public bool Remove(SystemKeyT key)
        {
            return dataCollection.Remove(key);
        }

        public IEnumerable<SystemKeyT> Remove(IEnumerable<SystemKeyT> keys)
        {
            var l = new List<SystemKeyT>();
            foreach (var k in keys)
            {
                if (Remove(k))
                    l.Add(k);
            }
            return l;
        }
    }

}
