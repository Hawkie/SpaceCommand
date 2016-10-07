using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace APIDataTypes.Keys
{
    public struct InternalUrl
    {
        public InternalUrl(string indexId, string category, string location, string owner, DateTime businessDate)
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

        public override int GetHashCode()
        {
            return this.ToString().GetHashCode();
        }

        public static bool operator==(InternalUrl left, InternalUrl right)
        {
            return left.Equals(right);
        }

        public static bool operator!=(InternalUrl left, InternalUrl right)
        {
            return !left.Equals(right);
        }

        public override bool Equals(object obj)
        {
            return this.ToString() == obj.ToString();
        }

        public override string ToString()
        {
            return IndexId + "-" + Category + "-" + Location + "-" + Owner + "-" + BusinessDate.ToString("yyyyMMdd");
        }
    }
}
