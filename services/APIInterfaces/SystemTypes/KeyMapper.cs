using APIInterfaces.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace APIInterfaces.SystemTypes
{
    public class KeyMapper<ExternalKey, InternalKey> : IKeyMapper<ExternalKey, InternalKey>
    {
        private Dictionary<ExternalKey, InternalKey> dataMap { get; }

        public KeyMapper()
        {
            dataMap = new Dictionary<ExternalKey, InternalKey>();
        }

        /// <summary>
        /// Add Mapping
        /// </summary>
        /// <param name="ek"></param>
        /// <param name="ik"></param>
        public void Add(ExternalKey ek, InternalKey ik)
        {
            dataMap.Add(ek, ik);
        }

        public Result<InternalKey> Find(ExternalKey externalKey)
        {
            InternalKey key = default(InternalKey);
            if (dataMap.TryGetValue(externalKey, out key))
                return new Result<InternalKey>(key, true, false, false);
            return null;
        }
    }
}
