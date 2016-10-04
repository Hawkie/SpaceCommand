using APIDictionary;
using APIInterfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace APIDictionary
{
    public static class SampleData
    {
        public static IDataLayer<int, string> SampleNames()
        {
            var f = new Func<string, int>((s) => { return 3; });
            var l = new List<Record<int, string>>();
            l.Add(new Record<int, string>(1, "Paul"));
            l.Add(new Record<int, string>(5, "Emma"));
            return new DictionaryData<int, string>(l, f);
        }
    }
}
