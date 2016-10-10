using APIInterfaces.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace APIInterfaces.SystemTypes
{
    public class KeyMapper<ExternalT, InternalT> : IKeyMapper<ExternalT, InternalT>
    {
        private Dictionary<ExternalT, InternalT> dataMap { get; }
        private Dictionary<InternalT, ExternalT> dataReverse { get; }

        public KeyMapper()
        {
            dataMap = new Dictionary<ExternalT, InternalT>();
            dataReverse = new Dictionary<InternalT, ExternalT>();
        }

        /// <summary>
        /// Add Mapping
        /// </summary>
        /// <param name="ek"></param>
        /// <param name="ik"></param>
        public void Add(ExternalT ek, InternalT ik)
        {
            dataMap.Add(ek, ik);
            dataReverse.Add(ik, ek);
        }

        public InternalT FindInternal(ExternalT externalKey)
        {
            var ik = default(InternalT);
            if (!dataMap.TryGetValue(externalKey, out ik))
            {
                Console.WriteLine("Cannot find key: {0}", externalKey);
            }
            return ik;
        }

        public ExternalT FindExternal(InternalT internalKey)
        {
            var ek = default(ExternalT);
            if (!dataReverse.TryGetValue(internalKey, out ek))
            {
                Console.WriteLine("Cannot find key: {0}", internalKey);
            }
            return ek;
        }
    }
}
