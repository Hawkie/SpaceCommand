using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;

namespace APIDataTypes.Keys
{
    public class ExternalUrl
    {
        public static ExternalUrl FromString(string keyString)
        {
            var sections = keyString.Split('-');
            var provider = CultureInfo.InvariantCulture;
            if (sections.GetLength(0) == 4)
            {
                var IndexId = sections[0];
                var Category = sections[1];
                var Owner = sections[2];
                var BusinessDate = DateTime.MinValue;
                try
                {
                    BusinessDate = DateTime.ParseExact(sections[3], "yyyyMMdd", provider);
                }
                catch(FormatException e)
                {

                }
                return new ExternalUrl(IndexId, Category, Owner, BusinessDate);
            }

            return null;
        }

        public ExternalUrl(string indexId, string category, string owner, DateTime businessDate)
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
            return IndexId + "-" + Category + "-" + Owner + "-" + BusinessDate.ToString("yyyyMMdd");
        }
    }
}
