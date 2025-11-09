using Entities.Dtos;
using Entities.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Services.Contracts;
using System.Security.Claims;

namespace React.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Student")] // Student yetkisi zorunlu
    public class StudentController : ControllerBase
    {
        private readonly IServiceManager _manager;

        public StudentController(IServiceManager manager)
        {
            _manager = manager;
        }

        // Tüm projeleri listeleme ve filtreleme
        [HttpGet("GetProjects")]
        public async Task<IActionResult> GetProjects(
            [FromQuery] string Search = null,
            [FromQuery] DateTime? date = null)
        {
            try
            {
                var projects = await _manager.ProjectService.GetProjectAsync(Search, date);
                var projectDtos = projects.Select(project => new ProjectDto
                {
                    Id = project.Id,
                    Name = project.Name,
                    Description = project.Description,
                    Deadline = project.Deadline
                }).ToList();

                return Ok(new
                {
                    success = true,
                    data = projectDtos,
                    filters = new { Search, date }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "Projeler listelenirken hata oluştu",
                    error = ex.Message
                });
            }
        }

        // Projeye başvurma (maksimum 3 proje)
        [HttpPost("ApplyProject")]
        public async Task<IActionResult> ApplyProject([FromBody] ProjectApplicationDto dto)
        {
            try
            {
                // Kullanıcının StudentId'sini claim'den al
                var studentIdClaim = User.FindFirst("StudentId")?.Value;

                if (string.IsNullOrEmpty(studentIdClaim))
                {
                    return Unauthorized(new
                    {
                        success = false,
                        message = "Öğrenci bilgisi bulunamadı"
                    });
                }

                int studentId = int.Parse(studentIdClaim);

                var result = await _manager.ProjectApplicationService
                    .ApplyToProjectAsync(studentId, dto.ProjectId);

                return Ok(new
                {
                    success = true,
                    message = "Projeye başarıyla başvurdunuz"
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    success = false,
                    message = ex.Message
                });
            }
        }

        // Öğrencinin katıldığı projeleri görüntüleme (PDF'de Hesap Sayfası)
        [HttpGet("MyProjects")]
        public async Task<IActionResult> GetMyProjects()
        {
            try
            {
                var studentIdClaim = User.FindFirst("StudentId")?.Value;

                if (string.IsNullOrEmpty(studentIdClaim))
                {
                    return Unauthorized(new
                    {
                        success = false,
                        message = "Öğrenci bilgisi bulunamadı"
                    });
                }

                int studentId = int.Parse(studentIdClaim);

                var projects = await _manager.ProjectApplicationService
                    .GetStudentProjectsAsync(studentId);

                var projectDtos = projects.Select(project => new ProjectDto
                {
                    Id = project.Id,
                    Name = project.Name,
                    Description = project.Description,
                    Deadline = project.Deadline
                }).ToList();

                return Ok(new
                {
                    success = true,
                    data = projectDtos,
                    count = projectDtos.Count,
                    remainingApplications = 3 - projectDtos.Count
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "Projeler listelenirken hata oluştu",
                    error = ex.Message
                });
            }
        }

        // Öğrencinin profil bilgilerini görüntüleme (PDF'de Profil Sayfası)
        [HttpGet("Profile")]
        public async Task<IActionResult> GetProfile()
        {
            try
            {
                var studentIdClaim = User.FindFirst("StudentId")?.Value;

                if (string.IsNullOrEmpty(studentIdClaim))
                {
                    return Unauthorized(new
                    {
                        success = false,
                        message = "Öğrenci bilgisi bulunamadı"
                    });
                }

                int studentId = int.Parse(studentIdClaim);

                var student = await _manager.StudentService.GetStudentByIdAsync(studentId, false);

                var projects = await _manager.ProjectApplicationService
                    .GetStudentProjectsAsync(studentId);

                return Ok(new
                {
                    success = true,
                    student = new StudentDto
                    {
                        Id = student.Id,
                        Name = student.Name,
                        Surname = student.Surname,
                        StudentNumber = student.StudentNumber,
                        Email = student.Email,
                        Technologies = student.Technologies,
                        Status = student.Status
                    },
                    projects = projects.Select(p => new ProjectDto
                    {
                        Id = p.Id,
                        Name = p.Name,
                        Description = p.Description,
                        Deadline = p.Deadline
                    }).ToList(),
                    applicationCount = projects.Count,
                    remainingApplications = 3 - projects.Count
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "Profil bilgileri alınırken hata oluştu",
                    error = ex.Message
                });
            }
        }
    }
}