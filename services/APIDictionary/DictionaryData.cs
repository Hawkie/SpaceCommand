using APIInterfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using APIInterfaces.Interfaces;
using APIInterfaces.SystemTypes;

namespace APIDictionary
{
    public class DictionaryData<InternalT, ValueT> : IDataLayer<InternalT, ValueT>
    {
        // key generation

        private Dictionary<InternalT, ValueT> dataCollection { get; }
        private Func<ValueT, InternalT> KeyGen { get; set; }

        public DictionaryData(IEnumerable<Record<InternalT, ValueT>> dataObjects, Func<ValueT, InternalT> keyGen)
        {
            KeyGen = keyGen;
            this.dataCollection = new Dictionary<InternalT, ValueT>();
            foreach (var d in dataObjects)
                dataCollection.Add(d.Key, d.Value);
        }

        public IEnumerable<Record<InternalT, ValueT>> GetAll()
        {
            return dataCollection.Select(kv => new Record<InternalT, ValueT>(kv.Key, kv.Value));
        }

        public IEnumerable<Record<InternalT, ValueT>> Find(IEnumerable<InternalT> keys)
        {
            throw new NotImplementedException();
        }

        public Result<InternalT> Create(ValueT value)
        {
            if (KeyGen != null)
            {
                var k = KeyGen(value);
                if (!dataCollection.ContainsKey(k))
                {
                    dataCollection.Add(k, value);
                    return new Result<InternalT>(k, false, false, true);
                }
                return new Result<InternalT>(k, false, false, false, string.Format("Generated Key already exists {0}", k));
            }
            throw new MissingMemberException("Null Key generator for Create");
        }

        public IEnumerable<Result<InternalT>> Create(IEnumerable<ValueT> values)
        {
            var l = new List<Result<InternalT>>();
            foreach (var v in values)
            {
                var result = Create(v);
                if (result.Created) l.Add(result);
            }
            return l;
        }

        public Record<InternalT, ValueT> Read(InternalT key)
        {
            ValueT value = default(ValueT);
            if (dataCollection.TryGetValue(key, out value))
                return new Record<InternalT, ValueT>(key, value);
            return null;
        }


        public IEnumerable<Record<InternalT, ValueT>> Read(IEnumerable<InternalT> keys)
        {
            var l = new List<Record<InternalT, ValueT>>();
            foreach (var k in keys)
            {
                var r = Read(k);
                if (r != null)
                    l.Add(r);
            }
            return l;
        }

        public bool Update(KeyValuePair<InternalT, ValueT> kv)
        {
            if (dataCollection.ContainsKey(kv.Key))
            {
                dataCollection.Remove(kv.Key);
                dataCollection.Add(kv.Key, kv.Value);
                return true;
            }
            return false;
        }

        public IEnumerable<InternalT> Update(IEnumerable<KeyValuePair<InternalT, ValueT>> values)
        {
            var l = new List<InternalT>();
            foreach (var kv in values)
            {
                if (Update(kv))
                    l.Add(kv.Key);
            }
            return l;
        }

        public Result<InternalT> UpdateCreate(KeyValuePair<InternalT, ValueT> kv)
        {
            if (this.Update(kv))
            {
                return new Result<InternalT>(kv.Key, true, true, false);
            }
            return this.Create(kv.Value);
        }

        public IEnumerable<Result<InternalT>> UpdateCreate(IEnumerable<KeyValuePair<InternalT, ValueT>> values)
        {
            var r = new List<Result<InternalT>>();
            foreach (var kv in values)
            {
                var result = UpdateCreate(kv);
                r.Add(result);
            }
            return r;
        }

        public bool Delete(InternalT key)
        {
            return dataCollection.Remove(key);
        }

        public IEnumerable<InternalT> Delete(IEnumerable<InternalT> keys)
        {
            var l = new List<InternalT>();
            foreach (var k in keys)
            {
                if (Delete(k))
                    l.Add(k);
            }
            return l;
        }
    }

}
