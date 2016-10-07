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

        [Theory]
        [InlineData("TVI", "index.A")]
        public void Find_WhenExists_ReturnsInternalLocation(string indexId, string location)
        {
            var map = new KeyMapper<ExternalUrl, InternalUrl>();
            var ek = CreateExternalKey(indexId:indexId);
            var ik = CreateInternalKey(indexId:indexId, location:location);
            map.Add(ek, ik);
            var key = map.FindInternal(new ExternalUrl(indexId, "contracts", "trader", new DateTime(2016, 10, 05)));

            Assert.Equal(indexId, key.IndexId);
            Assert.Equal(location, key.Location);
        }

        private static ExternalUrl CreateExternalKey(string indexId = "TVI", string contracts = "contracts")
        {
            return new ExternalUrl(indexId, contracts, "trader", new DateTime(2016, 10, 5));
        }

        private static InternalUrl CreateInternalKey(string indexId = "TVI", string contracts = "contracts", string location = "Index.A")
        {
            return new InternalUrl(indexId, contracts, location, "trader", new DateTime(2016, 10, 5));
        }
    }
}
