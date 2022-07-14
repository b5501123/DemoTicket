using Microsoft.AspNetCore.Mvc;
using Demo.API.Request;
using Demo.API.Response;
using Model.Exceptions;
using Model.Enums;
using Model.Models;
using Model.Claims;
using Model.Info;
using Common.Helpers;
using Repository.Repositories.Interface;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace Demo.API.Controllers
{
    public class AuthController : BaseController
    {
        private IUserRepository _userRepository { get; }
        private UserInfo _userInfo { get; }
        public AuthController(IUserRepository userRepository, UserInfo userInfo)
        {
            _userRepository = userRepository;
            _userInfo = userInfo;
        }

        [AllowAnonymous]
        [Route("Login")]
        [HttpPost]
        public async Task<ApiResponse<LogInRes>> Login(LogInReq req)
        {
            var user = await _userRepository.Get(req.Account);
            if (user == null)
            {
                throw new DemoException(ErrorCodeEnum.AccountNotFound);
            }

            if (user.Password != req.Password)
            {
                throw new DemoException(ErrorCodeEnum.PasswordError);
            }

            var token = GetToken(user);

            return ApiResponse<LogInRes>.Ok(new LogInRes { UserId = user.UserID, JwtToken = token });
        }


        [Route("UserInfo")]
        [HttpGet]
        public async Task<ApiResponse<UserInfoRes>> GetUserInfo()
        {
            return ApiResponse<UserInfoRes>.Ok(new UserInfoRes { UserId = _userInfo.UserID, NickName = _userInfo.Name });
        }

        private string GetToken(UserModel user)
        {
            var claims = new List<Claim>
            {
                new Claim(UserClaims.UserID,$"{user.UserID}"),
                new Claim(UserClaims.Account,$"{user.Account}"),
                new Claim(UserClaims.Name,$"{user.Name}"),
                new Claim(UserClaims.Role,$"{user.Role}"),
            };

            return JWTHelper.CreateToken(claims.ToArray());
        }
    };


}