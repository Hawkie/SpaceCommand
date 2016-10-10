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

        [Theory]
        [InlineData(0, "TVI-contracts-trader-20161005")]
        [InlineData(1, "TVI-contracts-trader-20160506")]
        public void GetAll_WithExternalKey_GetsData(int i, string ek)
        {
            var l = model.GetAll().Select(kv =>
            new Record<ExternalUrl, WeightsDoc>(map.FindExternal(kv.Key), kv.Value));
            Assert.Equal(ek, l.ElementAt(i).Key.ToString());
        }

        [Theory]
        [InlineData("TVI-contracts-trader-20161005", 2)]
        [InlineData("TVI-contracts-trader-20160506", 2)]
        public void Get_WithExternalKey_GetsWeights(string eks, int count)
        {
            var ek = ExternalUrl.FromString(eks);
            var ik = map.FindInternal(ek);
            var doc = model.Read(ik).Value;
            Assert.Equal(count, doc.Wts.Count);
        }
    }
}
