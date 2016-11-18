using APIDataTypes.Keys;
using APIInterfaces.Interfaces;
using APIInterfaces.SystemTypes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace APIDataTypes.KeyMappers
{
    public class UrlMapper : IKeyMapper<WeightKey, InternalUrl>
    {
        // map trading to specific location
        private KeyMapper<string, string> ownerToLocation = new KeyMapper<string, string>();

        public UrlMapper(IEnumerable<KeyMapItem<string, string>> map)
        {
            foreach (var row in map)
            {
                ownerToLocation.Add(row.ExternalKey, row.InternalKey);
            }
        }


        public InternalUrl FindInternal(WeightKey ek)
        {
            var location = ownerToLocation.FindInternal(ek.Owner);
            if (location != default(string))
            {
                var ik = new InternalUrl(ek.IndexId, ek.Category, location, ek.Owner, ek.BusinessDate);
                return ik;
            }
            return default(InternalUrl);
        }

        public WeightKey FindExternal(InternalUrl ik)
        {
            var ek = new ExternalUrl(ik.IndexId, ik.Category, ik.Owner, ik.BusinessDate);
            return ek;
        }

        public void Add(string owner, string location)
        {
            ownerToLocation.Add(owner, location);
        }
    }
}
