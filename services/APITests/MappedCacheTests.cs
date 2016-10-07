using APIDataTypes.Keys;
using APIDataTypes.Values;
using APIDictionary;
using APIInterfaces.Interfaces;
using APIInterfaces.SystemTypes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Xunit;

namespace APITests
{
    public class MappedCacheTests
    {

        private static IDataLayer<InternalUrl, WeightsDoc> model = SampleData.SampleWeights();
        private static IKeyMapper<ExternalUrl, InternalUrl> map = SampleData.SampleMap();

        [Fact]
        public void a()
        {
            var l = model.GetAll().Select(kv =>
            new Record<ExternalUrl, WeightsDoc>(map.FindExternal(kv.Key), kv.Value));
            Assert.Equal("TVI", l.FirstOrDefault().Key.IndexId);
        }
    }
}
