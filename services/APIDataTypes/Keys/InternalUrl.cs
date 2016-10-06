using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace APIDataTypes.Keys
{
    public class InternalUrl
    {
        public InternalUrl(string indexId, string type, string owner, DateTime businessDate)
        {
            IndexId = indexId;
            Type = type;
            Owner = owner;
            BusinessDate = businessDate;
        }

        public string IndexId { get; }
        public string Type { get; }
        public string Owner { get; }
        public DateTime BusinessDate { get; }

        public override string ToString()
        {
            return IndexId + "-" + Type + "-" + Owner + "-" + BusinessDate.ToString("YYYMMdd");
        }
    }
}
