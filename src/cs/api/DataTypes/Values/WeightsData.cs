using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;

namespace API.DataTypes.Values
{

    public class WeightsData
    {
        public WeightsData(string indexName, string category, string owner, DateTime businessDate, IEnumerable<WeightItemData> weights)
        {
            Weights = weights.ToList();
            Owner = owner;
            IndexName = indexName;
            BusinessDate = businessDate;
            Category = category;
        }

        public WeightsData(IEnumerable weights)
        {
            Weights = new List<WeightItemData>(weights.Cast<WeightItemData>());
        }

        public List<WeightItemData> Weights { get; }

        public double Constant { get; }
        public string Owner { get; }
        public string IndexName { get; }
        public DateTime BusinessDate { get; }
        public string Category { get; }
    }
}
