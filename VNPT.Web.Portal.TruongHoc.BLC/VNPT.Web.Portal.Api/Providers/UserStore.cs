using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNet.Identity;
using VNPT.Core.Constants;
using VNPT.Web.Portal.Base;

namespace VNPT.Web.Portal.Api.Providers
{
    public class UserStore<TUser> : IUserLoginStore<TUser, string>,
        IUserClaimStore<TUser, string>,
        IUserRoleStore<TUser, string>,
        IUserPasswordStore<TUser, string>,
        IUserSecurityStampStore<TUser, string>,
        IQueryableUserStore<TUser, string>,
        IUserEmailStore<TUser, string>,
        IUserPhoneNumberStore<TUser, string>,
        IUserTwoFactorStore<TUser, string>,
        IUserLockoutStore<TUser, string>
        where TUser : User
    {
        private readonly WebDbContext _dbContext;

        public UserStore()
        {
        }

        public UserStore(WebDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public IQueryable<TUser> Users => throw new NotImplementedException();

        /// <summary>
        ///     Inserts a claim to the UserClaimsTable for the given user
        /// </summary>
        /// <param name="user">User to have claim added</param>
        /// <param name="claim">Claim to be added</param>
        /// <returns></returns>
        public Task AddClaimAsync(TUser user, Claim claim)
        {
            return Task.FromResult<object>(null);
        }

        /// <summary>
        ///     Returns all claims for a given user
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        public Task<IList<Claim>> GetClaimsAsync(TUser user)
        {
            //ClaimsIdentity identity = userClaimsTable.FindByUserId(user.Id);
            //return Task.FromResult<IList<Claim>>(identity.Claims.ToList());
            return Task.FromResult<IList<Claim>>(new List<Claim>());
        }

        /// <summary>
        ///     Removes a claim froma user
        /// </summary>
        /// <param name="user">User to have claim removed</param>
        /// <param name="claim">Claim to be removed</param>
        /// <returns></returns>
        public Task RemoveClaimAsync(TUser user, Claim claim)
        {
            return Task.FromResult<object>(null);
        }

        /// <summary>
        ///     Set email on user
        /// </summary>
        /// <param name="user"></param>
        /// <param name="email"></param>
        /// <returns></returns>
        public Task SetEmailAsync(TUser user, string email)
        {
            user.Email = email;
            return Task.FromResult(0);
        }

        /// <summary>
        ///     Get email from user
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        public Task<string> GetEmailAsync(TUser user)
        {
            return Task.FromResult(user.Email);
        }

        /// <summary>
        ///     Get if user email is confirmed
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        public Task<bool> GetEmailConfirmedAsync(TUser user)
        {
            //todo: check email confirm
            return Task.FromResult(true);
        }

        /// <summary>
        ///     Set when user email is confirmed
        /// </summary>
        /// <param name="user"></param>
        /// <param name="confirmed"></param>
        /// <returns></returns>
        public Task SetEmailConfirmedAsync(TUser user, bool confirmed)
        {
            //user.EmailConfirmed = confirmed;
            //userTable.Update(user);

            return Task.FromResult(0);
        }

        /// <summary>
        ///     Get user by email
        /// </summary>
        /// <param name="email"></param>
        /// <returns></returns>
        public Task<TUser> FindByEmailAsync(string email)
        {
            if (string.IsNullOrEmpty(email)) return Task.FromResult<TUser>(null);
            var result =
                _dbContext.Users.FirstOrDefault(u =>
                    u.Email.ToLower() == email.ToLower() && u.Status != StatusEnum.Deleted) as TUser;
            return Task.FromResult(result);
        }

        /// <summary>
        ///     Get user lock out end date
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        public Task<DateTimeOffset> GetLockoutEndDateAsync(TUser user)
        {
            return
                Task.FromResult(new DateTimeOffset());
        }


        /// <summary>
        ///     Set user lockout end date
        /// </summary>
        /// <param name="user"></param>
        /// <param name="lockoutEnd"></param>
        /// <returns></returns>
        public Task SetLockoutEndDateAsync(TUser user, DateTimeOffset lockoutEnd)
        {
            return Task.FromResult(0);
        }

        /// <summary>
        ///     Increment failed access count
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        public Task<int> IncrementAccessFailedCountAsync(TUser user)
        {
            return Task.FromResult(0);
        }

        /// <summary>
        ///     Reset failed access count
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        public Task ResetAccessFailedCountAsync(TUser user)
        {
            return Task.FromResult(0);
        }

        /// <summary>
        ///     Get failed access count
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        public Task<int> GetAccessFailedCountAsync(TUser user)
        {
            return Task.FromResult(0);
        }

        /// <summary>
        ///     Get if lockout is enabled for the user
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        public Task<bool> GetLockoutEnabledAsync(TUser user)
        {
            return Task.FromResult(false);
        }

        /// <summary>
        ///     Set lockout enabled for user
        /// </summary>
        /// <param name="user"></param>
        /// <param name="enabled"></param>
        /// <returns></returns>
        public Task SetLockoutEnabledAsync(TUser user, bool enabled)
        {
            return Task.FromResult(0);
        }


        /// <summary>
        ///     Insert a new TUser in the UserTable
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        public Task CreateAsync(TUser user)
        {
            if (user == null)
                throw new ArgumentNullException(nameof(user));

            _dbContext.Users.Add(user);
            return Task.FromResult(_dbContext.SaveChanges());
        }

        /// <summary>
        ///     Returns an TUser instance based on a userId query
        /// </summary>
        /// <param name="userId">The user's Id</param>
        /// <returns></returns>
        public Task<TUser> FindByIdAsync(string userId)
        {
            if (userId == null)
                throw new ArgumentException("Null or empty argument: userId");
            var result =
                _dbContext.Users.FirstOrDefault(u => u.Id == userId && u.Status != StatusEnum.Deleted) as TUser;
            return Task.FromResult(result);
        }

        /// <summary>
        ///     Returns an TUser instance based on a userName query
        /// </summary>
        /// <param name="userName">The user's name</param>
        /// <returns></returns>
        public Task<TUser> FindByNameAsync(string userName)
        {
            if (string.IsNullOrEmpty(userName))
                throw new ArgumentException("Null or empty argument: userName");

            var result =
                _dbContext.Users.FirstOrDefault(u => u.UserName == userName && u.Status != StatusEnum.Deleted) as TUser;
            return Task.FromResult(result);
        }

        /// <summary>
        ///     Updates the UsersTable with the TUser instance values
        /// </summary>
        /// <param name="user">TUser to be updated</param>
        /// <returns></returns>
        public Task UpdateAsync(TUser user)
        {
            if (user == null)
                throw new ArgumentNullException("user");

            _dbContext.Entry(user).State = EntityState.Modified;
            return Task.FromResult(_dbContext.SaveChanges());
        }

        public void Dispose()
        {
        }

        /// <summary>
        ///     Inserts a Login in the UserLoginsTable for a given User
        /// </summary>
        /// <param name="user">User to have login added</param>
        /// <param name="login">Login to be added</param>
        /// <returns></returns>
        public Task AddLoginAsync(TUser user, UserLoginInfo login)
        {
            user.Logins.Add(new UserLogin
            {
                LoginProvider = login.LoginProvider,
                ProviderKey = login.ProviderKey,
                UserId = user.Id
            });
            return Task.FromResult(_dbContext.SaveChanges());
        }

        /// <summary>
        ///     Returns an TUser based on the Login info
        /// </summary>
        /// <param name="login"></param>
        /// <returns></returns>
        public Task<TUser> FindAsync(UserLoginInfo login)
        {
            var loginUser = _dbContext.UserLogins.FirstOrDefault(s =>
                s.LoginProvider == login.LoginProvider && s.ProviderKey == login.ProviderKey);
            if (loginUser == null)
                return Task.FromResult<TUser>(null);
            var user =
                _dbContext.Users.FirstOrDefault(u => u.Id == loginUser.UserId && u.Status != StatusEnum.Deleted) as
                    TUser;
            return Task.FromResult(user);
        }

        /// <summary>
        ///     Returns list of UserLoginInfo for a given TUser
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        public Task<IList<UserLoginInfo>> GetLoginsAsync(TUser user)
        {
            if (user.Logins != null)
                return Task.FromResult<IList<UserLoginInfo>>(user.Logins
                    .Select(s => new UserLoginInfo(s.LoginProvider, s.ProviderKey)).ToList());
            var loginUser = _dbContext.UserLogins.Where(s => s.UserId == user.Id);
            var logins = loginUser.Select(s => new UserLoginInfo(s.LoginProvider, s.ProviderKey))
                .ToList();
            return Task.FromResult<IList<UserLoginInfo>>(logins);
        }

        /// <summary>
        ///     Deletes a login from UserLoginsTable for a given TUser
        /// </summary>
        /// <param name="user">User to have login removed</param>
        /// <param name="login">Login to be removed</param>
        /// <returns></returns>
        public Task RemoveLoginAsync(TUser user, UserLoginInfo login)
        {
            //var lognin = _userTable.RemoveLogins(user, login);
            return Task.FromResult<object>(null);
        }

        /// <summary>
        ///     Deletes a user
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        public Task DeleteAsync(TUser user)
        {
            //if (user != null)
            //    _userTable.Delete(user.Id);

            return Task.FromResult<object>(null);
        }

        /// <summary>
        ///     Returns the PasswordHash for a given TUser
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        public Task<string> GetPasswordHashAsync(TUser user)
        {
            var passwordHash =
                _dbContext.Users.FirstOrDefault(u => u.Id == user.Id && u.Status != StatusEnum.Deleted) as TUser;
            return Task.FromResult(passwordHash?.PasswordHash);
        }

        /// <summary>
        ///     Verifies if user has password
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        public Task<bool> HasPasswordAsync(TUser user)
        {
            var passwordHash =
                _dbContext.Users.FirstOrDefault(u => u.Id == user.Id && u.Status != StatusEnum.Deleted) as TUser;
            return Task.FromResult(!string.IsNullOrEmpty(passwordHash?.PasswordHash));
        }

        /// <summary>
        ///     Sets the password hash for a given TUser
        /// </summary>
        /// <param name="user"></param>
        /// <param name="passwordHash"></param>
        /// <returns></returns>
        public Task SetPasswordHashAsync(TUser user, string passwordHash)
        {
            user.PasswordHash = passwordHash;

            return Task.FromResult<object>(null);
        }

        /// <summary>
        ///     Set user phone number
        /// </summary>
        /// <param name="user"></param>
        /// <param name="phoneNumber"></param>
        /// <returns></returns>
        public Task SetPhoneNumberAsync(TUser user, string phoneNumber)
        {
            var _user = _dbContext.Users.FirstOrDefault(f => f.Id == user.Id && f.Status != StatusEnum.Deleted);
            if (_user != null)
            {
                _user.PhoneNumber = phoneNumber;
                if (_dbContext.SaveChanges() > 0)
                    return Task.FromResult(true);
                return Task.FromResult(false);
            }

            return Task.FromResult(false);
        }

        /// <summary>
        ///     Get user phone number
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        public Task<string> GetPhoneNumberAsync(TUser user)
        {
            //return Task.FromResult("");
            //var passwordHash = _dbContext.Users.FirstOrDefault(u => u.Id == user.Id) as TUser;
            return Task.FromResult(user.PhoneNumber);
        }

        /// <summary>
        ///     Get if user phone number is confirmed
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        public Task<bool> GetPhoneNumberConfirmedAsync(TUser user)
        {
            return Task.FromResult(user.PhoneNumberConfirmed);
        }

        /// <summary>
        ///     Set phone number if confirmed
        /// </summary>
        /// <param name="user"></param>
        /// <param name="confirmed"></param>
        /// <returns></returns>
        public Task SetPhoneNumberConfirmedAsync(TUser user, bool confirmed)
        {
            var _user = _dbContext.Users.FirstOrDefault(f => f.Id == user.Id && f.Status != StatusEnum.Deleted);
            if (_user != null)
            {
                _user.PhoneNumberConfirmed = confirmed;
                if (_dbContext.SaveChanges() > 0)
                    return Task.FromResult(true);
                return Task.FromResult(false);
            }

            return Task.FromResult(false);
        }

        /// <summary>
        ///     Inserts a entry in the UserRoles table
        /// </summary>
        /// <param name="user">User to have GENERAL_CATEGORY added</param>
        /// <param name="roleName">Name of the GENERAL_CATEGORY to be added to user</param>
        /// <returns></returns>
        public Task AddToRoleAsync(TUser user, string roleName)
        {
            if (user == null) throw new ArgumentNullException(@"user");

            if (string.IsNullOrEmpty(roleName))
                throw new ArgumentException("Argument cannot be null or empty: roleName.");

            var roleId = _dbContext.Roles.FirstOrDefault(s => s.Name == roleName && s.Status != StatusEnum.Deleted);
            if (roleId == null) return Task.FromResult<object>(null);
            try
            {
                _dbContext.UserRoles.Add(new UserRole
                {
                    RoleId = roleId.Id,
                    UserId = user.Id
                });
                _dbContext.SaveChanges();
            }
            catch (Exception)
            {
                //
            }

            return Task.FromResult<object>(null);
        }

        /// <summary>
        ///     Returns the roles for a given TUser
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        public Task<IList<string>> GetRolesAsync(TUser user)
        {
            if (user == null)
                throw new ArgumentNullException(nameof(user));

            user = _dbContext.Users.First(s => s.Id == user.Id) as TUser;
            var roles = _dbContext.Roles.ToList().Where(s =>
                    user != null && s.Status != StatusEnum.Deleted && user.Roles.Any(w => w.RoleId == s.Id))
                .Select(s => s.Name).ToList();
            return Task.FromResult<IList<string>>(roles);
        }

        /// <summary>
        ///     Verifies if a user is in a role
        /// </summary>
        /// <param name="user"></param>
        /// <param name="role"></param>
        /// <returns></returns>
        public Task<bool> IsInRoleAsync(TUser user, string role)
        {
            if (user == null)
                throw new ArgumentNullException(nameof(user));

            if (string.IsNullOrEmpty(role))
                throw new ArgumentNullException(nameof(role));

            var roles = _dbContext.Roles.Where(s => s.Status != StatusEnum.Deleted).ToList()
                .Where(s => user.Roles.Any(w => w.RoleId == s.Id))
                .Select(s => s.Name).ToList();
            return Task.FromResult(roles.Exists(s => role == s));
        }

        /// <summary>
        ///     Removes a user from a role
        /// </summary>
        /// <param name="user"></param>
        /// <param name="role"></param>
        /// <returns></returns>
        public Task RemoveFromRoleAsync(TUser user, string role)
        {
            var roleDd = _dbContext.Roles.FirstOrDefault(s => s.Name == role);
            if (roleDd != null)
            {
                var userRoles = _dbContext.UserRoles.FirstOrDefault(s => s.UserId == user.Id && s.RoleId == roleDd.Id);
                if (userRoles != null)
                {
                    _dbContext.UserRoles.Remove(userRoles);
                    _dbContext.SaveChanges();
                }

                return null;
            }

            return null;
        }

        /// <summary>
        ///     Set security stamp
        /// </summary>
        /// <param name="user"></param>
        /// <param name="stamp"></param>
        /// <returns></returns>
        public Task SetSecurityStampAsync(TUser user, string stamp)
        {
            //user.SecurityStamp = stamp;

            return Task.FromResult(0);
        }

        /// <summary>
        ///     Get security stamp
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        public Task<string> GetSecurityStampAsync(TUser user)
        {
            return Task.FromResult("");
        }

        /// <summary>
        ///     Set two factor authentication is enabled on the user
        /// </summary>
        /// <param name="user"></param>
        /// <param name="enabled"></param>
        /// <returns></returns>
        public Task SetTwoFactorEnabledAsync(TUser user, bool enabled)
        {
            return Task.FromResult(0);
        }

        /// <summary>
        ///     Get if two factor authentication is enabled on the user
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        public Task<bool> GetTwoFactorEnabledAsync(TUser user)
        {
            return Task.FromResult(true);
        }

        /// <summary>
        ///     Get user by phoneNumber
        /// </summary>
        /// <param name="phoneNumber"></param>
        /// <returns></returns>
        public Task<TUser> FindByPhoneAsync(string phoneNumber)
        {
            if (string.IsNullOrEmpty(phoneNumber))
                return Task.FromResult<TUser>(null);
            var result =
                _dbContext.Users.FirstOrDefault(u => u.PhoneNumber == phoneNumber && u.Status != StatusEnum.Deleted) as
                    TUser;
            return Task.FromResult(result);
        }
    }
}