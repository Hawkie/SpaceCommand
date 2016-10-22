using System.Collections;
using System.Collections.Generic;
using System.Linq;

namespace APIDataTypes.Values
{

    public class WeightsDoc
    {
        public WeightsDoc(IEnumerable<Weight> weights)
        {
            Weights = weights.ToList();
        }

        public WeightsDoc(IEnumerable weights)
        {
            Weights = new List<Weight>(weights.Cast<Weight>());
        }

        public List<Weight> Weights { get; }

        public double Constant { get; }
    }
}
