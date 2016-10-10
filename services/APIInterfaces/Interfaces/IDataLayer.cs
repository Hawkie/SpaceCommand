using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using APIInterfaces.SystemTypes;

namespace APIInterfaces.Interfaces
{
    /// <summary>
    /// 
    /// </summary>
    /// <typeparam name="InternalT">Key type</typeparam>
    /// <typeparam name="V">Value Type</typeparam>
    public interface IDataLayer<InternalT, V>
    {
        /// <summary>
        /// Read all values including ids
        /// </summary>
        /// <returns></returns>
        IEnumerable<Record<InternalT, V>> GetAll();

        /// <summary>
        /// Query option
        /// </summary>
        /// <param name="keys"></param>
        /// <returns></returns>
        IEnumerable<Record<InternalT, V>> Find(IEnumerable<InternalT> keys);

        // Create
        Result<InternalT> Create(V value);
        IEnumerable<Result<InternalT>> Create(IEnumerable<V> values);

        /// <summary>
        /// Read all or get one by key
        /// </summary>
        /// <returns></returns>
        Record<InternalT, V> Read(InternalT key);
        IEnumerable<Record<InternalT, V>> Read(IEnumerable<InternalT> keys);

        /// <summary>
        /// Update only. Return missing status if not present
        /// </summary>
        /// <param name="kv"></param>
        /// <returns></returns>
        bool Update(KeyValuePair<InternalT, V> kv);
        IEnumerable<InternalT> Update(IEnumerable<KeyValuePair<InternalT, V>> kv);

        /// <summary>
        /// If missing record, add it and get key 
        /// </summary>
        /// <param name="kv"></param>
        /// <returns></returns>
        Result<InternalT> UpdateCreate(KeyValuePair<InternalT, V> kv);
        IEnumerable<Result<InternalT>> UpdateCreate(IEnumerable<KeyValuePair<InternalT, V>> kv);

        /// <summary>
        /// Delete
        /// </summary>
        /// <param name="key"></param>
        /// <returns></returns>
        bool Delete(InternalT key);
        IEnumerable<InternalT> Delete(IEnumerable<InternalT> keys);
    }

}
