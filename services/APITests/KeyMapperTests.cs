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
            var key = map.FindInternal(ek);

            Assert.Equal(indexId, key.IndexId);
            Assert.Equal(location, key.Location);
        }

        private static ExternalUrl CreateExternalKey(string indexId)
        {
            return new ExternalUrl(indexId, "contracts", "trader", new DateTime(2016, 10, 5));
        }

        private static InternalUrl CreateInternalKey(string indexId, string location)
        {
            return new InternalUrl(indexId, "contracts", location, "trader", new DateTime(2016, 10, 5));
        }
    }
}
