using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using APIInterfaces.Interfaces;
using APIDataTypes.Keys;
using APIDataTypes.Values;
using APIInterfaces.SystemTypes;
using APIDictionary;

// For more information on enabling Web API for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace WebAPIcore.Controllers
{
    [Route("cache/[controller]")]
    public class WeightsController : Controller
    {
        private static IDataLayer<InternalUrl, WeightsDoc> model = SampleData.SampleWeights();
        private static IKeyMapper<ExternalUrl, InternalUrl> map = SampleData.SampleLogicalMap();
        private static KeyMapper<string, string> logicalOwner = new KeyMapper<string, string>();

        public WeightsController()
        {
            logicalOwner.Add("trader", "index.A");
        }

        // GET: cache/weights
        [HttpGet]
        public IEnumerable<Record<ExternalUrl, WeightsDoc>> Get()
        {
            return model.GetAll().Select(kv =>
                new Record<ExternalUrl, WeightsDoc>(map.FindExternal(kv.Key), kv.Value));
        }



        // GET cache/weights/contracts/trader/20161005/TVI
        [HttpGet("{type}/{eOwner}/{dateString}/{index}")]
        public WeightsDoc Get(string type, string eOwner, string dateString, string index)
        {
            var iLocation = logicalOwner.FindInternal(eOwner);
            if (!string.IsNullOrEmpty(iLocation))
            {
                var ik = new InternalUrl(index, type, iLocation, eOwner, dateString);
                var v = model.Read(ik);
                if (v != null)
                {
                    return v.Value;
                }
            }
            return null;
        }

        // POST cache/weights
        [HttpPost]
        public void Post([FromBody]WeightsDoc value)
        {
            var result = model.Create(value);
        }

        // PUT cache/weights/5
        [HttpPut("{id}")]
        public void Put(ExternalUrl id, [FromBody]WeightsDoc value)
        {
            // create internal key if one deoesn't exist?
            // add external / internal mapping and keep permanent record
            var ik = map.FindInternal(id);
            if (ik != default(InternalUrl))
            {
                var result = model.UpdateCreate(new KeyValuePair<InternalUrl, WeightsDoc>(ik, value));
                Console.WriteLine("Record Created={0}, Updated={1}", result.Created, result.Updated);
            }
            Console.WriteLine("Cannot locate key");
        }

        // DELETE cache/weights/5
        [HttpDelete("{id}")]
        public void Delete(ExternalUrl id)
        {

        }
    }
}
