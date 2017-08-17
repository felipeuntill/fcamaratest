using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FCamara.Product.Api.Models.Response
{
    public class LoginResponse : BaseResponse
    {
        public string Token { get; set; }
    }
}
