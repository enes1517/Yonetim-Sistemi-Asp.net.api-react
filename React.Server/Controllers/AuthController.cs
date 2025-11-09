using Entities.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Services.Contracts;
using System.Security.Claims;

namespace React.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [AllowAnonymous]
    public class AuthController : ControllerBase
    {
        private readonly IServiceManager _manager;
        private readonly SignInManager<IdentityUser> _signInManager;
        private readonly UserManager<IdentityUser> _userManager;

        public AuthController(IServiceManager manager, SignInManager<IdentityUser> signInManager, UserManager<IdentityUser> userManager)
        {
            _manager = manager;
            _signInManager = signInManager;
            _userManager = userManager;
        }

        // Öğrenci Kayıt - Admin onayına düşer
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] StudentRegisterDto model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var result = await _manager.StudentService.RegisterStudentAsync(model);

                if (result.Succeeded)
                {
                    return Ok(new
                    {
                        message = "Registration successful. Waiting for admin approval.",
                        status = "Pending"
                    });
                }

                return BadRequest(new { errors = result.Errors });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        // Giriş Yapma - Sadece onaylı öğrenciler ve admin giriş yapabilir
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginViewModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var user = await _userManager.FindByEmailAsync(model.Email);
                if (user == null)
                    return Unauthorized(new { message = "Invalid email or password." });

                var result = await _signInManager.PasswordSignInAsync(
                    user,
                    model.Password,
                    false,
                    lockoutOnFailure: false
                );

                if (!result.Succeeded)
                    return Unauthorized(new { message = "Invalid email or password." });

                // Kullanıcının rolünü kontrol et
                var roles = await _userManager.GetRolesAsync(user);
                var isAdmin = roles.Contains("Admin");

                // Eğer öğrenci ise, onay durumunu kontrol et
                if (!isAdmin)
                {
                    var claims = await _userManager.GetClaimsAsync(user);
                    var studentIdClaim = claims.FirstOrDefault(c => c.Type == "StudentId");

                    if (studentIdClaim != null)
                    {
                        var studentId = int.Parse(studentIdClaim.Value);
                        var student = await _manager.StudentService.GetStudentByIdAsync(studentId, false);

                        if (student.Status != "Approved")
                        {
                            await _signInManager.SignOutAsync();
                            return Unauthorized(new
                            {
                                message = "Your account is not approved yet. Please wait for admin approval.",
                                status = student.Status
                            });
                        }

                        return Ok(new
                        {
                            message = "Login successful",
                            role = "Student",
                            studentId = student.Id,
                            name = student.Name,
                            surname = student.Surname,
                            email = student.Email
                        });
                    }
                    else
                    {
                        await _signInManager.SignOutAsync();
                        return Unauthorized(new
                        {
                            message = "Your account is not approved yet. Please wait for admin approval."
                        });
                    }
                }

                // Admin girişi
                return Ok(new
                {
                    message = "Login successful",
                    role = "Admin",
                    email = user.Email
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        // Çıkış Yapma
        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            try
            {
                await _signInManager.SignOutAsync();
                return Ok(new { message = "Logout successful" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        // Giriş yapan kullanıcının bilgilerini getir
        [HttpGet("me")]
        public async Task<IActionResult> GetCurrentUser()
        {
            try
            {
                if (!User.Identity.IsAuthenticated)
                    return Unauthorized(new { message = "User not authenticated" });

                var user = await _userManager.GetUserAsync(User);
                if (user == null)
                    return NotFound(new { message = "User not found" });

                var roles = await _userManager.GetRolesAsync(user);
                var isAdmin = roles.Contains("Admin");

                if (isAdmin)
                {
                    return Ok(new
                    {
                        role = "Admin",
                        email = user.Email
                    });
                }

                // Öğrenci bilgilerini getir
                var claims = await _userManager.GetClaimsAsync(user);
                var studentIdClaim = claims.FirstOrDefault(c => c.Type == "StudentId");

                if (studentIdClaim != null)
                {
                    var studentId = int.Parse(studentIdClaim.Value);
                    var student = await _manager.StudentService.GetStudentByIdAsync(studentId, false);

                    return Ok(new
                    {
                        role = "Student",
                        studentId = student.Id,
                        name = student.Name,
                        surname = student.Surname,
                        email = student.Email,
                        studentNumber = student.StudentNumber,
                        technologies = student.Technologies,
                        status = student.Status
                    });
                }

                return NotFound(new { message = "Student information not found" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        // Şifre Değiştirme
        [HttpPost("change-password")]
        [Authorize]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var user = await _userManager.GetUserAsync(User);
                if (user == null)
                    return Unauthorized(new { message = "User not authenticated" });

                var result = await _userManager.ChangePasswordAsync(
                    user,
                    model.CurrentPassword,
                    model.NewPassword
                );

                if (result.Succeeded)
                    return Ok(new { message = "Password changed successfully" });

                return BadRequest(new { errors = result.Errors });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }
    }
}