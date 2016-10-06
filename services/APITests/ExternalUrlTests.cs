using APIDataTypes.Keys;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Xunit;

namespace APITests
{
    public class ExternalUrlTests
    {
        [Theory]
        [InlineData("TVI-contracts-trader-20161005")]
        public void Ctor_WithString_SetsId(string s)
        {
            var ek = ExternalUrl.FromString(s);
            Assert.Equal("TVI", ek.IndexId);
        }

        [Theory]
        [InlineData("TVI-contracts-trader-20161005")]
        public void Ctor_WithString_SetsCategory(string s)
        {
            var ek = ExternalUrl.FromString(s);
            Assert.Equal("contracts", ek.Category);
        }

        [Theory]
        [InlineData("TVI-contracts-trader-20161005")]
        public void Ctor_WithString_SetsOwner(string s)
        {
            var ek = ExternalUrl.FromString(s);
            Assert.Equal("trader", ek.Owner);
        }

        [Theory]
        [InlineData("TVI-contracts-trader-20161005", "5 Oct 2016")]
        [InlineData("TVI-contracts-trader-20160506", "6 May 2016")]
        public void Ctor_WithString_SetsDate(string s, string ds)
        {
            var ek = ExternalUrl.FromString(s);
            var d = DateTime.Parse(ds);
            Assert.Equal(d, ek.BusinessDate);
        }


    }
}
