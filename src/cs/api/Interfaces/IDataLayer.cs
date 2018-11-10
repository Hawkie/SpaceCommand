using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using API.Interfaces.SystemTypes;

namespace API.Interfaces
{
    /// <summary>
    /// 
    /// </summary>
    /// <typeparam name="SystemKeyType">Key type</typeparam>
    /// <typeparam name="ValueType">Value Type</typeparam>
    public interface IDataLayer<SystemKeyType, ValueType>
    {
        /// <summary>
        /// Searches the values using predicate to match 
        /// </summary>
        /// <param name="selector"></param>
        /// <returns></returns>
        IEnumerable<KeyValuePair<SystemKeyType, ValueType>> Find(Func<ValueType, bool> selector);

        /// <summary>
        /// Read all or get one by key
        /// </summary>
        /// <returns></returns>
        ValueType Read(SystemKeyType key);


        // Create
        SystemKeyType Create(ValueType value);

        /// <summary>
        /// Update only. Return missing status if not present
        /// </summary>
        /// <param name="kv"></param>
        /// <returns></returns>
        bool Update(KeyValuePair<SystemKeyType, ValueType> kv);

        /// <summary>
        /// Delete
        /// </summary>
        /// <param name="key"></param>
        /// <returns></returns>
        bool Delete(SystemKeyType key);
    }

}
