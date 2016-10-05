using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace APIInterfaces
{
    /// <summary>
    /// 
    /// </summary>
    /// <typeparam name="K">Key type</typeparam>
    /// <typeparam name="V">Value Type</typeparam>
    public interface IDataLayer<K, V>
    {
        /// <summary>
        /// Get all values including ids
        /// </summary>
        /// <returns></returns>
        IEnumerable<KeyValuePair<K, V>> GetAll();


        /// <summary>
        /// Query option
        /// </summary>
        /// <param name="keys"></param>
        /// <returns></returns>
        IEnumerable<Record<K, V>> Find(IEnumerable<K> keys);

        /// <summary>
        /// Get all or get one by key
        /// </summary>
        /// <returns></returns>
        Record<K, V> Get(K key);
        IEnumerable<Record<K, V>> Get(IEnumerable<K> keys);

        // Create
        Result<K> Create(V value);
        IEnumerable<Result<K>> Create(IEnumerable<V> values);

        /// <summary>
        /// Update only. Return missing status if not present
        /// </summary>
        /// <param name="kv"></param>
        /// <returns></returns>
        bool Update(KeyValuePair<K, V> kv);
        IEnumerable<K> Update(IEnumerable<KeyValuePair<K, V>> kv);

        /// <summary>
        /// If missing record, add it and get key 
        /// </summary>
        /// <param name="kv"></param>
        /// <returns></returns>
        Result<K> UpdateCreate(KeyValuePair<K, V> kv);
        IEnumerable<Result<K>> UpdateCreate(IEnumerable<KeyValuePair<K, V>> kv);

        /// <summary>
        /// Delete
        /// </summary>
        /// <param name="key"></param>
        /// <returns></returns>
        bool Remove(K key);
        IEnumerable<K> Remove(IEnumerable<K> keys);
    }

}
