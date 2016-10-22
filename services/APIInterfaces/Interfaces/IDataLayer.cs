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
    /// <typeparam name="SystemKeyType">Key type</typeparam>
    /// <typeparam name="ValueType">Value Type</typeparam>
    public interface IDataLayer<SystemKeyType, ValueType>
    {
        /// <summary>
        /// Read all values including ids
        /// </summary>
        /// <returns></returns>
        IEnumerable<Record<SystemKeyType, ValueType>> GetAll();

        /// <summary>
        /// Query option
        /// </summary>
        /// <param name="keys"></param>
        /// <returns></returns>
        IEnumerable<Record<SystemKeyType, ValueType>> Find(string queryString);

        // Create
        Result<SystemKeyType> Create(ValueType value);
        IEnumerable<Result<SystemKeyType>> Create(IEnumerable<ValueType> values);

        /// <summary>
        /// Read all or get one by key
        /// </summary>
        /// <returns></returns>
        Record<SystemKeyType, ValueType> Read(SystemKeyType key);
        IEnumerable<Record<SystemKeyType, ValueType>> Read(IEnumerable<SystemKeyType> keys);

        /// <summary>
        /// Update only. Return missing status if not present
        /// </summary>
        /// <param name="kv"></param>
        /// <returns></returns>
        bool Update(KeyValuePair<SystemKeyType, ValueType> kv);
        IEnumerable<SystemKeyType> Update(IEnumerable<KeyValuePair<SystemKeyType, ValueType>> kv);

        /// <summary>
        /// If missing record, add it and get key 
        /// </summary>
        /// <param name="kv"></param>
        /// <returns></returns>
        Result<SystemKeyType> UpdateCreate(KeyValuePair<SystemKeyType, ValueType> kv);
        IEnumerable<Result<SystemKeyType>> UpdateCreate(IEnumerable<KeyValuePair<SystemKeyType, ValueType>> kv);

        /// <summary>
        /// Delete
        /// </summary>
        /// <param name="key"></param>
        /// <returns></returns>
        bool Delete(SystemKeyType key);
        IEnumerable<SystemKeyType> Delete(IEnumerable<SystemKeyType> keys);
    }

}
