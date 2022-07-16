using Microsoft.AspNetCore.Mvc;
using Demo.API.Request;
using Demo.API.Response;
using Model.Exceptions;
using Model.Enums;
using Model.Models;
using Model.Claims;
using Model.Info;
using Common.Helpers;
using Domain.Domains;
using Common.Extensions;
using Model;
using Repository.Repositories.Interface;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace Demo.API.Controllers
{
    public class TicketController : BaseController
    {
        private ITicketRepository _ticketRepository { get; }
        private UserInfo _userInfo { get; }
        public TicketController(ITicketRepository ticketRepository, UserInfo userInfo)
        {
            _ticketRepository = ticketRepository;
            _userInfo = userInfo;
        }

        [Route("List")]
        [HttpGet]
        public async Task<ApiListResponse<TicketModel>> List([FromQuery]TicketSearchReq req)
        {
            var option = req.BuildOption();
            var ticketOption = req.BuildTicketOption();

            var res = await _ticketRepository.List(option,ticketOption);


            return ApiListResponse<TicketModel>.Ok(res,option);
        }

        [Route("Option")]
        [HttpGet]
        public async Task<ApiResponse<OptionRes>> Option()
        {
            var res = new OptionRes();

            res.Add("Severity", EnumExtension.GetOption<SeverityEnum>().ToArray());
            res.Add("TicketType", EnumExtension.GetOption<TicketTypeEnum>().ToArray());

            return ApiResponse<OptionRes>.Ok(res);
        }

        [Route("")]
        [HttpPost]
        public async Task<ApiResponse<bool>> Create(TicketCreateReq req)
        {
            var model = req.Reflect<TicketModel>();
            model.CreateBy = _userInfo.Name;
            var isOk = VerifyDomain.VerifyTicket(model.Type, (RoleEnum)_userInfo.Role, ActionEnum.Create);
            if (!isOk)
            {
                throw new DemoException(ErrorCodeEnum.ActionError);
            }

            await _ticketRepository.Create(model);
            return ApiResponse<bool>.Ok(true);
        }

        [Route("{id}")]
        [HttpPut]
        public async Task<ApiResponse<bool>> Update(int id, [FromBody] TicketUpdateReq req)
        {
            var model = req.Reflect<TicketModel>();
            model.TicketID = id;

            var old = await _ticketRepository.Get(id);
            if (old == null)
            {
                throw new DemoException(ErrorCodeEnum.DataNotFound);
            }
            var isOk = VerifyDomain.VerifyTicket(old.Type, (RoleEnum)_userInfo.Role, ActionEnum.Update);
            if (!isOk)
            {
                throw new DemoException(ErrorCodeEnum.ActionError);
            }

            var isUpdate = await _ticketRepository.Update(model);

            if (isUpdate == 0)
            {
                throw new DemoException(ErrorCodeEnum.DataUpdateError);
            }
            return ApiResponse<bool>.Ok(true);
        }

        [Route("{id}/Resolve")]
        [HttpPut]
        public async Task<ApiResponse<bool>> Resolve(int id)
        {

            var old = await _ticketRepository.Get(id);
            if (old == null)
            {
                throw new DemoException(ErrorCodeEnum.DataNotFound);
            }
            var isOk = VerifyDomain.VerifyTicket(old.Type, (RoleEnum)_userInfo.Role, ActionEnum.Resolve);
            if (!isOk)
            {
                throw new DemoException(ErrorCodeEnum.ActionError);
            }

            if (old.IsResolved)
            {
                throw new DemoException(ErrorCodeEnum.DataUpdateError, "Ticket Resolved");
            }

            var isUpdate = await _ticketRepository.Resolve(id);

            if (isUpdate == 0)
            {
                throw new DemoException(ErrorCodeEnum.DataUpdateError);
            }
            return ApiResponse<bool>.Ok(true);
        }

        [Route("{id}")]
        [HttpDelete]
        public async Task<ApiResponse<bool>> Delete(int id)
        {
            var old = await _ticketRepository.Get(id);
            if (old == null)
            {
                throw new DemoException(ErrorCodeEnum.DataNotFound);
            }
            var isOk = VerifyDomain.VerifyTicket(old.Type, (RoleEnum)_userInfo.Role, ActionEnum.Delete);
            if (!isOk)
            {
                throw new DemoException(ErrorCodeEnum.ActionError);
            }

            var isDelete = await _ticketRepository.Delete(id);

            if (isDelete == 0)
            {
                throw new DemoException(ErrorCodeEnum.DataUpdateError);
            }

            return ApiResponse<bool>.Ok(true);
        }

    };


}