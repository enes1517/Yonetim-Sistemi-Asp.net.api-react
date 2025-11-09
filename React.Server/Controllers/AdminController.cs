using Entities.Dtos;
using Entities.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Services.Contracts;

namespace React.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")] // Admin yetkisi zorunlu
    public class AdminController : ControllerBase
    {
        private readonly IServiceManager _manager;

        public AdminController(IServiceManager manager)
        {
            _manager = manager;
        }

        // Öğrencileri listeleme ve filtreleme
        [HttpGet("GetStudents")]
        public async Task<IActionResult> GetStudents(
            [FromQuery] string Search = null,
            [FromQuery] string Tech = null,
            [FromQuery] string Status = null)
        {
            try
            {
                var students = await _manager.StudentService.GetStudentsAsync(Search, Tech, Status);
                var studentDtos = students.Select(student => new StudentDto
                {
                    Id = student.Id,
                    Name = student.Name,
                    Surname = student.Surname,
                    StudentNumber = student.StudentNumber,
                    Email = student.Email,
                    Status = student.Status,
                    Technologies = student.Technologies
                }).ToList();

                return Ok(new
                {
                    success = true,
                    data = studentDtos,
                    filters = new { Search, Tech, Status }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "Öğrenciler listelenirken hata oluştu",
                    error = ex.Message
                });
            }
        }

        // Öğrenci onaylama
        [HttpPatch("Students/{id}/Approve")]
        public async Task<IActionResult> ApproveStudent(int id)
        {
            try
            {
                var result = await _manager.StudentService.ApproveStudentAsync(id);

                if (!result)
                {
                    return NotFound(new
                    {
                        success = false,
                        message = $"ID {id} ile öğrenci bulunamadı"
                    });
                }

                return Ok(new
                {
                    success = true,
                    message = "Öğrenci başarıyla onaylandı"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "Öğrenci onaylanırken hata oluştu",
                    error = ex.Message
                });
            }
        }

        // Öğrenci reddetme
        [HttpPatch("Students/{id}/Reject")]
        public async Task<IActionResult> RejectStudent(int id)
        {
            try
            {
                var result = await _manager.StudentService.RejectStudentAsync(id);

                if (!result)
                {
                    return NotFound(new
                    {
                        success = false,
                        message = $"ID {id} ile öğrenci bulunamadı"
                    });
                }

                return Ok(new
                {
                    success = true,
                    message = "Öğrenci başarıyla reddedildi"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "Öğrenci reddedilirken hata oluştu",
                    error = ex.Message
                });
            }
        }

        // Projeleri listeleme ve filtreleme
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

        // Projeye başvuran öğrencileri görüntüleme (PDF'de eksikti)
        [HttpGet("Projects/{projectId}/Applicants")]
        public async Task<IActionResult> GetProjectApplicants(int projectId)
        {
            try
            {
                var applicants = await _manager.ProjectService.GetProjectApplicantsAsync(projectId);

                var applicantDtos = applicants.Select(student => new StudentDto
                {
                    Id = student.Id,
                    Name = student.Name,
                    Surname = student.Surname,
                    StudentNumber = student.StudentNumber,
                    Email = student.Email,
                    Technologies = student.Technologies,
                    Status = student.Status
                }).ToList();

                return Ok(new
                {
                    success = true,
                    data = applicantDtos,
                    count = applicantDtos.Count
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "Başvuranlar listelenirken hata oluştu",
                    error = ex.Message
                });
            }
        }

        // Yeni proje oluşturma
        [HttpPost("CreateProject")]
        public async Task<IActionResult> CreateProject([FromBody] ProjectCreateDto project)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = "Geçersiz proje bilgileri",
                        errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage))
                    });
                }

                await _manager.ProjectService.CreateProjectAsync(project);

                return Ok(new
                {
                    success = true,
                    message = "Proje başarıyla oluşturuldu"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "Proje oluşturulurken hata oluştu",
                    error = ex.Message
                });
            }
        }

        // Proje güncelleme
        [HttpPatch("Projects/{id}")]
        public async Task<IActionResult> EditProject(int id, [FromBody] ProjectUpdateDto dto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = "Geçersiz proje bilgileri",
                        errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage))
                    });
                }

                var result = await _manager.ProjectService.UpdateProjectAsync(id, dto);

                if (!result)
                {
                    return NotFound(new
                    {
                        success = false,
                        message = $"ID'si {id} olan proje bulunamadı"
                    });
                }

                return Ok(new
                {
                    success = true,
                    message = "Proje başarıyla güncellendi"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "Proje güncellenirken hata oluştu",
                    error = ex.Message
                });
            }
        }

        // Proje silme
        [HttpDelete("Projects/{id}")]
        public async Task<IActionResult> DeleteProject(int id)
        {
            try
            {
                var result = await _manager.ProjectService.DeleteProjectAsync(id);

                if (!result)
                {
                    return NotFound(new
                    {
                        success = false,
                        message = $"ID'si {id} olan proje bulunamadı"
                    });
                }

                return Ok(new
                {
                    success = true,
                    message = "Proje başarıyla silindi"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "Proje silinirken hata oluştu",
                    error = ex.Message
                });
            }
        }
    }
}