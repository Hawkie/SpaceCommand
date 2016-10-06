using APIDataTypes.Keys;
using APIDictionary;
using APIInterfaces.SystemTypes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Xunit;

namespace APITests
{
    public class KeyMapperTests
    {

        [Fact]
        public void PassingTest()
        {
            Assert.Equal(4, 2 + 2);
        }

        [Theory]
        [InlineData("TVI", "index.A")]
        public void Find_WhenExists_ReturnsInternalLocation(string indexId, string location)
        {
            var map = new KeyMapper<ExternalUrl, InternalUrl>();
            var ek = CreateExternalKey(indexId);
            var ik = CreateInternalKey(indexId, location);
            map.Add(ek, ik);
            var result = map.Find(ek);

            Assert.Equal(indexId, result.Key.IndexId);
            Assert.Equal(location, result.Key.Location);
        }

        private static ExternalUrl CreateExternalKey(string indexId)
        {
            return new ExternalUrl("contracts", indexId, "trader", new DateTime(2016, 10, 5));
        }

        private static InternalUrl CreateInternalKey(string indexId, string location)
        {
            return new InternalUrl("contracts", indexId, location, "trader", new DateTime(2016, 10, 5));
        }
    }
}
