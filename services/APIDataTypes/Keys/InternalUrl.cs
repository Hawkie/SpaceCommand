using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace APIDataTypes.Keys
{
    public class InternalUrl
    {
        public InternalUrl(string category, string indexId, string location, string owner, DateTime businessDate)
        {
            
            IndexId = indexId;
            Category = category;
            Owner = owner;
            BusinessDate = businessDate;
            Location = location;
        }

        public string IndexId { get; }
        public string Category { get; }
        public string Owner { get; }
        public DateTime BusinessDate { get; }
        public string Location { get; }

        public override string ToString()
        {
            return IndexId + "-" + Category + "-" + Owner + "-" + BusinessDate.ToString("YYYMMdd");
        }
    }
}
