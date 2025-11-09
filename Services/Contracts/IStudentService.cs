using Entities.Dtos;
using Entities.Models;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Contracts
{
    public interface IStudentService
    {
        Task<IdentityResult> RegisterStudentAsync(StudentRegisterDto studentRegisterDto);
        Task<bool> ApproveStudentAsync(int studentId);
        Task<bool> RejectStudentAsync(int studentId);
        Task<List<Student>> GetStudentsAsync(string search = null, string technology = null, string status = null);
        Task<Student> GetStudentByIdAsync(int studentId, bool trackChanges);
    }
}