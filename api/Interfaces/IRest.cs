using API.Interfaces.SystemTypes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Interfaces
{
    public interface IRest<ExternalT, ValueT>
    {


        /// <summary>
        /// 
        /// </summary>
        /// <param name="ek"></param>
        /// <returns></returns>
        ValueT Get(ExternalT ek);

        /// <summary>
        /// 
        /// </summary>
        /// <param name="value"></param>
        void Post(ValueT value);

        /// <summary>
        /// 
        /// </summary>
        /// <param name="ek"></param>
        /// <param name="value"></param>
        void Put(ExternalT ek, ValueT value);

        /// <summary>
        /// 
        /// </summary>
        /// <param name="ek"></param>
        void Delete(ExternalT ek);
    }
}
