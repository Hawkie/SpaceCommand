using System.Collections;
using System.Collections.Generic;
using System.Linq;

namespace APIDataTypes.Values
{

    public class WeightsDoc
    {
        public WeightsDoc(IEnumerable<Weight> wts)
        {
            Wts = wts.ToList();
        }

        public WeightsDoc(IEnumerable wts)
        {
            Wts = new List<Weight>(wts.Cast<Weight>());
        }

        public List<Weight> Wts { get; }
    }
}
