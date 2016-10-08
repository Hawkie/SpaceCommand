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
    /// <typeparam name="SystemKeyT">Key type</typeparam>
    /// <typeparam name="V">Value Type</typeparam>
    public interface IDataLayer<SystemKeyT, V>
    {
        /// <summary>
        /// Read all values including ids
        /// </summary>
        /// <returns></returns>
        IEnumerable<Record<SystemKeyT, V>> GetAll();


        /// <summary>
        /// Query option
        /// </summary>
        /// <param name="keys"></param>
        /// <returns></returns>
        IEnumerable<Record<SystemKeyT, V>> Find(IEnumerable<SystemKeyT> keys);


        // Create
        Result<SystemKeyT> Create(V value);
        IEnumerable<Result<SystemKeyT>> Create(IEnumerable<V> values);

        /// <summary>
        /// Read all or get one by key
        /// </summary>
        /// <returns></returns>
        Record<SystemKeyT, V> Read(SystemKeyT key);
        IEnumerable<Record<SystemKeyT, V>> Read(IEnumerable<SystemKeyT> keys);

        /// <summary>
        /// Update only. Return missing status if not present
        /// </summary>
        /// <param name="kv"></param>
        /// <returns></returns>
        bool Update(KeyValuePair<SystemKeyT, V> kv);
        IEnumerable<SystemKeyT> Update(IEnumerable<KeyValuePair<SystemKeyT, V>> kv);

        /// <summary>
        /// If missing record, add it and get key 
        /// </summary>
        /// <param name="kv"></param>
        /// <returns></returns>
        Result<SystemKeyT> UpdateCreate(KeyValuePair<SystemKeyT, V> kv);
        IEnumerable<Result<SystemKeyT>> UpdateCreate(IEnumerable<KeyValuePair<SystemKeyT, V>> kv);

        /// <summary>
        /// Delete
        /// </summary>
        /// <param name="key"></param>
        /// <returns></returns>
        bool Delete(SystemKeyT key);
        IEnumerable<SystemKeyT> Delete(IEnumerable<SystemKeyT> keys);
    }

}
