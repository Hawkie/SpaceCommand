using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using APIDictionary;

using APIInterfaces.Interfaces;
using APIInterfaces.SystemTypes;
using APIDataTypes.Keys;

namespace WebAPIcore.Controllers
{
    [Route("cache/[controller]")]
    public class ValuesController : Controller
    {
        private static IDataLayer<int, string> model = SampleData.SampleNames();
        private static IKeyMapper<ExternalUrl, InternalUrl> map = new KeyMapper<ExternalUrl, InternalUrl>();
        public ValuesController()
        {
        }

        // GET cache/values
        [HttpGet]
        public IEnumerable<string> Get()
        {
            return model.GetAll().Select(x => x.Value); 
        }

        // GET cache/values/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            var v = model.Read(id);
            if (v != null)
                return v.Value;
            return "No result";
        }

        // POST cache/values
        [HttpPost]
        public void Post([FromBody]string value)
        {
            var result = model.Create(value);
        }

        // PUT cache/values/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody]string value)
        {
            var result = model.UpdateCreate(new KeyValuePair<int, string>(id, value));
        }

        // DELETE cache/values/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
            var success = model.Delete(id);
        }
    }
}
