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
        private static IKeyMapper<ExternalUrl, InternalUrl> map = SampleData.SampleMap();


        // GET: cache/weights
        [HttpGet]
        public IEnumerable<Record<ExternalUrl, WeightsDoc>> Get()
        {
            return model.GetAll().Select(kv =>
                new Record<ExternalUrl, WeightsDoc>(map.FindExternal(kv.Key), kv.Value));
        }

        

        // GET cache/weights/TVI-contracts-trader-20161005
        [HttpGet("{id}")]
        public WeightsDoc Get(ExternalUrl ek)
        {
            var ik = map.FindInternal(ek);
            if (ik == default(InternalUrl))
            {
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
        }

        // PUT cache/weights/5
        [HttpPut("{id}")]
        public void Put(ExternalUrl id, [FromBody]WeightsDoc value)
        {
        }

        // DELETE cache/weights/5
        [HttpDelete("{id}")]
        public void Delete(ExternalUrl id)
        {
        }
    }
}
