using API.DataTypes.Keys;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Xunit;

namespace API.Tests
{
    public class WeightsKeyTests
    {
        [Theory]
        [InlineData("TVI-contracts-trader-20161005")]
        public void Ctor_WithString_SetsId(string s)
        {
            var ek = WeightsKey.FromString(s);
            Assert.Equal("TVI", ek.IndexName);
        }

        [Theory]
        [InlineData("TVI-contracts-trader-20161005")]
        public void Ctor_WithString_SetsCategory(string s)
        {
            var ek = WeightsKey.FromString(s);
            Assert.Equal("contracts", ek.Category);
        }

        [Theory]
        [InlineData("TVI-contracts-trader-20161005")]
        public void Ctor_WithString_SetsOwner(string s)
        {
            var ek = WeightsKey.FromString(s);
            Assert.Equal("trader", ek.Owner);
        }

        [Theory]
        [InlineData("TVI-contracts-trader-20161005", "5 Oct 2016")]
        [InlineData("TVI-contracts-trader-20160506", "6 May 2016")]
        public void Ctor_WithString_SetsDate(string s, string ds)
        {
            var ek = WeightsKey.FromString(s);
            var d = DateTime.Parse(ds);
            Assert.Equal(d, ek.BusinessDate);
        }


    }
}
