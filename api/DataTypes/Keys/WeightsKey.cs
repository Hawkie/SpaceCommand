using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;

namespace API.DataTypes.Keys
{
    public struct WeightsKey
    {
        public static WeightsKey FromString(string keyString)
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
                return new WeightsKey(IndexId, Category, Owner, BusinessDate);
            }

            return default(WeightsKey);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="indexName">E.g. ALTVI</param>
        /// <param name="category">E.g. contracts</param>
        /// <param name="owner">E.g. Trading</param>
        /// <param name="businessDate">format yyyyMMdd</param>
        public WeightsKey(string indexName, string category, string owner, DateTime businessDate)
        {
            IndexName = indexName;
            Category = category;
            Owner = owner;
            BusinessDate = businessDate;
        }

        public string IndexName { get; }
        public string Category { get; }
        public string Owner { get; }
        public DateTime BusinessDate { get; }

        public override int GetHashCode()
        {
            return this.ToString().GetHashCode();
        }

        public static bool operator ==(WeightsKey left, WeightsKey right)
        {
            return left.Equals(right);
        }

        public static bool operator !=(WeightsKey left, WeightsKey right)
        {
            return !left.Equals(right);
        }

        public override bool Equals(object obj)
        {
            return this.ToString() == obj.ToString();
        }

        public override string ToString()
        {
            return IndexName + "-" + Category + "-" + Owner + "-" + BusinessDate.ToString("yyyyMMdd");
        }
    }
}
