using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using API.Interfaces;
using API.DataTypes.Keys;
using API.DataTypes.Values;
using API.Retrievers;
using System.Globalization;

// For more information on enabling Web API for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace WebAPIcore.Controllers
{
    [Route("api/[controller]")]
    public class WeightsController : Controller
    {


        private static IDataLayer<WeightsKey, WeightsData> model = new WeightsRetriever(SampleData.SampleWeights(), (value) => { return default(WeightsKey); });
        
        public WeightsController()
        {
        }

        // GET cache/weights
        [HttpGet]
        public IEnumerable<KeyValuePair<WeightsKey, WeightsData>> Get()
        {
            return model.Find((x) => { return true; });
        }

        // GET api/weights/contracts/trader/20161005/TVI
        [HttpGet("{type}/{eOwner}/{dateString}/{index}")]
        public WeightsData Get(string type, string eOwner, string dateString, string index)
        {
            var provider = CultureInfo.InvariantCulture;
            var date = DateTime.ParseExact(dateString, "yyyyMMdd", provider);
            var k = new WeightsKey(index, type, eOwner, date);
            return model.Read(k);
        }

        // POST cache/weights
        [HttpPost]
        public void Post([FromBody]WeightsData value)
        {
            var result = model.Create(value);
        }

        // PUT cache/weights/5
        //[HttpPut("{id}")]
        //public void Put(ExternalUrl id, [FromBody]WeightsDoc value)
        //{
        //    // create internal key if one deoesn't exist?
        //    // add external / internal mapping and keep permanent record
        //    var kv = new KeyValuePair<ExternalUrl, WeightsDoc>(id, value);
        //    var ik = map.FindInternal(id);
        //    if (ik != default(InternalUrl))
        //    {
        //        if (!model.Update(new KeyValuePair<InternalUrl, WeightsDoc>(ik, value)))
        //        {

        //        }
        //        Console.WriteLine("Record Created={0}, Updated={1}", result.Created, result.Updated);
        //    }
        //    Console.WriteLine("Cannot locate key");
        //}

        // DELETE cache/weights/5
        [HttpDelete("{id}")]
        public void Delete(WeightsKey id)
        {

        }
    }
}
