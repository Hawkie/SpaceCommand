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
        private Dictionary<InternalKey, ExternalKey> dataReverse { get; }

        public KeyMapper()
        {
            dataMap = new Dictionary<ExternalKey, InternalKey>();
            dataReverse = new Dictionary<InternalKey, ExternalKey>();
        }

        /// <summary>
        /// Add Mapping
        /// </summary>
        /// <param name="ek"></param>
        /// <param name="ik"></param>
        public void Add(ExternalKey ek, InternalKey ik)
        {
            dataMap.Add(ek, ik);
            dataReverse.Add(ik, ek);
        }

        public InternalKey FindInternal(ExternalKey externalKey)
        {
            var ik = default(InternalKey);
            if (!dataMap.TryGetValue(externalKey, out ik))
            {
                Console.WriteLine("Cannot find key: {0}", externalKey);
            }
            return ik;
        }

        public ExternalKey FindExternal(InternalKey internalKey)
        {
            var ek = default(ExternalKey);
            if (!dataReverse.TryGetValue(internalKey, out ek))
            {
                Console.WriteLine("Cannot find key: {0}", internalKey);
            }
            return ek;
        }
    }
}
