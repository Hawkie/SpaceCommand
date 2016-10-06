using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace APIDataTypes.Keys
{
    public class ExternalUrl
    {
        public ExternalUrl(string category, string indexId, string owner, DateTime businessDate)
        {
            IndexId = indexId;
            Category = category;
            Owner = owner;
            BusinessDate = businessDate;
        }

        public string IndexId { get; }
        public string Category { get; }
        public string Owner { get; }
        public DateTime BusinessDate { get; }

        public override string ToString()
        {
            return IndexId + "-" + Category + "-" + Owner + "-" + BusinessDate.ToString("YYYMMdd");
        }
    }
}
