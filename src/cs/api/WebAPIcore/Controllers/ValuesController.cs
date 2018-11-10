using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

using API.Interfaces;
using API.Interfaces.SystemTypes;
using API.DataTypes.Keys;
using API.Retrievers;

namespace WebAPIcore.Controllers
{
    [Route("api/[controller]")]
    public class ValuesController : Controller
    {
        private static IDataLayer<int, Record<int, string>> model = SampleData.SampleNames();
        
        public ValuesController()
        {
        }

        // GET cache/values
        [HttpGet]
        public IEnumerable<KeyValuePair<int, Record<int, string>>> Get()
        {
            return model.Find((x) => { return true; }); 
        }

        // GET cache/values/5
        [HttpGet("{id}")]
        public Record<int, string> Get(int id)
        {
            return model.Read(id);
        }

        // POST cache/values
        [HttpPost]
        public void Post([FromBody]Record<int,string> value)
        {
            var result = model.Create(value);
        }

        // PUT cache/values/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody]Record<int, string> value)
        {
            var kv = new KeyValuePair<int, Record<int, string>>(id, value);
            if (!model.Update(kv))
            {
                var k = model.Create(kv.Value);
            }
        }

        // DELETE cache/values/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
            var success = model.Delete(id);
        }
    }
}
