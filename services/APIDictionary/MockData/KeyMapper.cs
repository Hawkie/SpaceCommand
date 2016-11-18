using APIInterfaces.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace APIInterfaces.SystemTypes
{
    public class KeyMapper<ExternalKeyType, InternalKeyType> : IKeyMapper<ExternalKeyType, InternalKeyType>
    {
        private Dictionary<ExternalKeyType, InternalKeyType> dataForward { get; }
        private Dictionary<InternalKeyType, ExternalKeyType> dataReverse { get; }

        public KeyMapper()
        {
            dataForward = new Dictionary<ExternalKeyType, InternalKeyType>();
            dataReverse = new Dictionary<InternalKeyType, ExternalKeyType>();
        }

        /// <summary>
        /// Add Mapping
        /// </summary>
        /// <param name="ek"></param>
        /// <param name="ik"></param>
        public void Add(ExternalKeyType ek, InternalKeyType ik)
        {
            dataForward.Add(ek, ik);
            dataReverse.Add(ik, ek);
        }

        public InternalKeyType FindInternal(ExternalKeyType externalKey)
        {
            var ik = default(InternalKeyType);
            if (!dataForward.TryGetValue(externalKey, out ik))
            {
                Console.WriteLine("Cannot find key: {0}", externalKey);
            }
            return ik;
        }

        public ExternalKeyType FindExternal(InternalKeyType internalKey)
        {
            var ek = default(ExternalKeyType);
            if (!dataReverse.TryGetValue(internalKey, out ek))
            {
                Console.WriteLine("Cannot find key: {0}", internalKey);
            }
            return ek;
        }
    }
}
