using System;
using Xunit;
using System.Linq;
using System.Collections.Generic;
using API.Retrievers;
using API.Interfaces.SystemTypes;

namespace API.Tests
{
    public class DictionaryDataTests
    {
        [Fact]
        public void GetAll_Size_IsTwo()
        {
            var l = SampleData.SampleNames();
            Assert.Equal(2, l.Find((x)=> { return true; }).Count());
        }

        [Fact]
        public void Get_WithPredicate_Returns()
        {
            var l = SampleData.SampleNames();
            Assert.Equal(5, l.Find((x) => { return x.Value == "Emma"; }).SingleOrDefault().Value.Key);
        }

        [Theory]
        [InlineData(1, "Paul")]
        [InlineData(5, "Emma")]
        public void Get_IfExists_Pass(int id, string name)
        {
            var l = SampleData.SampleNames();
            var n = l.Read(id).Value;
            Assert.Equal(name, n);
        }

        [Theory]
        [InlineData(1, "Sophie")]
        public void Update_IfExists_Pass(int id, string name)
        {
            var l = SampleData.SampleNames();
            l.Update(new KeyValuePair<int, Record<int, string>>(id, new Record<int, string>(id, name)));
            Assert.Equal("Sophie", l.Read(id).Value);
        }

        [Theory]
        [InlineData(2, "Claudia")]
        public void Update_IfNotExists_Fail(int id, string name)
        {
            var l = SampleData.SampleNames();
            l.Update(new KeyValuePair<int, Record<int, string>>(id, new Record<int, string>(id, name)));
            Assert.Equal(null, l.Read(id));
        }

        [Theory]
        [InlineData("Claudia")]
        public void Create_IfNotExists_Pass(string name)
        {
            var l = SampleData.SampleNames();
            var result = l.Create(new Record<int, string>(3, name));
            Console.WriteLine("New Id = {0}", result);
            Assert.Equal(3, l.Read(result).Key);
        }

        [Theory]
        [InlineData("Emma")]
        [InlineData("Paul")]
        public void Create_IfExists_Pass(string name)
        {
            var l = SampleData.SampleNames();
            var result = l.Create(new Record<int, string>(3, name));
            Console.WriteLine("New Id = {0}", result);
            Assert.Equal(3, l.Read(result).Key);
        }

        [Theory]
        [InlineData(5)]
        [InlineData(1)]
        public void Remove_IfExists_Removed(int id)
        {
            var l = SampleData.SampleNames();
            var success = l.Delete(id);
            Assert.Equal(null, l.Read(id));
        }

        [Theory]
        [InlineData(2)]
        [InlineData(3)]
        public void Remove_IfNotExists_Silent(int id)
        {
            var l = SampleData.SampleNames();
            var success = l.Delete(id);
            Assert.Equal(null, l.Read(id));
        }

        //[Theory]
        //[InlineData(1, "Sophie")]
        //public void UpdateCreate_IfExists_Updates(int id, string newName)
        //{
        //    var l = SampleData.SampleNames();
        //    var result = l.UpdateCreate(new KeyValuePair<int, string>(id, newName));
        //    Assert.Equal(true, result.Updated);
        //}

        //[Theory]
        //[InlineData(2, "Sophie")]
        //public void UpdateCreate_IfNotExists_Creates(int id, string newName)
        //{
        //    var l = SampleData.SampleNames();
        //    var result = l.UpdateCreate(new KeyValuePair<int, string>(id, newName));
        //    Assert.Equal(false, result.Updated);
        //}

        //[Theory]
        //[InlineData(2, "Sophie")]
        //public void UpdateCreate_KeyGenExists_Creates(int id, string newName)
        //{
        //    var l = SampleData.SampleNames();
        //    var k1 = l.Create(newName);
        //    var result = l.UpdateCreate(new KeyValuePair<int, string>(id, newName));
        //    Assert.Equal(false, result.Updated);
        //}
    }
}


