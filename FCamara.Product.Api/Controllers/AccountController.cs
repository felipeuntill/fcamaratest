using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using FCamara.Domain.Entity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using FCamara.Product.Api.Models;
using FCamara.Product.Api.Models.AccountViewModels;
using FCamara.Product.Api.Models.Request;
using FCamara.Product.Api.Models.Response;
using FCamara.Product.Api.Services;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace FCamara.Product.Api.Controllers
{
    [Authorize]
    public class AccountController : Controller
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly IEmailSender _emailSender;
        private readonly ISmsSender _smsSender;
        private readonly ILogger _logger;
        private readonly string _externalCookieScheme;

        public AccountController(
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager,
            IOptions<IdentityCookieOptions> identityCookieOptions,
            IEmailSender emailSender,
            ISmsSender smsSender,
            ILoggerFactory loggerFactory)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _externalCookieScheme = identityCookieOptions.Value.ExternalCookieAuthenticationScheme;
            _emailSender = emailSender;
            _smsSender = smsSender;
            _logger = loggerFactory.CreateLogger<AccountController>();
        }

        // POST: /Account/Login
        [HttpPost]
        [AllowAnonymous]
        public async Task<LoginResponse> Login([FromBody] LoginRequest model)
        {
            var response = new LoginResponse
            {
                Message = "Usuário ou senha inválidos",
                Success = false,
            };

            if (!ModelState.IsValid) return response;

            var result = await _signInManager.PasswordSignInAsync(model.Username, model.Password, model.RememberMe,
                lockoutOnFailure: false);

            if (result.Succeeded)
            {
                var user = await _userManager.FindByEmailAsync(model.Username);
                var stamp = user.SecurityStamp;

                response.Success = result.Succeeded;
                response.Message = "Usuário autenticado com sucesso";
                response.Token = stamp;
                return response;
            }

            if (result.IsLockedOut)
                response.Message = "Usuário bloqueado por excesso de tentativas";

            return response;
        }


        // POST: /Account/Register
        [HttpPost]
        [AllowAnonymous]
        public async Task<RegisterResponse> Register([FromBody] RegisterRequest model)
        {
            var response = new RegisterResponse
            {
                Message = "Não foi possível registrar o usuário",
                Success = false
            };

            if (model.PasswordConf != model.Password)
                response.Message = "A senha e confirmação da senha devem ser iguais";

            if (model.Password.Length < 8)
                response.Message = "A senha precisa conter no minimo 8 caracteres";

            if (!ModelState.IsValid) return response;

            var user = new ApplicationUser {UserName = model.Username, Email = model.Username};
            var result = await _userManager.CreateAsync(user, model.Password);

            if (result.Succeeded)
            {
                await _signInManager.SignInAsync(user, isPersistent: false);
                response.Success = result.Succeeded;
                response.Message = "Usuário registrado com sucesso";
            }

            return response;
        }

        // POST: /Account/Logout
        [HttpPost]
        public async Task<LogoutResponse> Logout()
        {
            await _signInManager.SignOutAsync();

            return new LogoutResponse
            {
                Message = "O usuário foi desconectado do sistema",
                Success = false
            };
        }


        // GET: /Account/Users
        [HttpGet]
        [AllowAnonymous]
        public async Task<List<ApplicationUser>> Users()
        {
           return await _userManager.Users.ToListAsync();
        }
    }
}
