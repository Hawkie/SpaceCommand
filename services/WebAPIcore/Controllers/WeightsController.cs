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
        private static IKeyMapper<ExternalUrl, InternalUrl> map = new KeyMapper<ExternalUrl, InternalUrl>();


        // GET: cache/weights
        [HttpGet]
        public IEnumerable<WeightsDoc> Get()
        {
            return model.GetAll().Select(x => x.Value);
        }

        // GET cache/weights/5
        [HttpGet("{id}")]
        public WeightsDoc Get(ExternalUrl id)
        {
            var result = map.Find(id);
            if (result != null)
            {
                var v = model.Get(result.Key);
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
