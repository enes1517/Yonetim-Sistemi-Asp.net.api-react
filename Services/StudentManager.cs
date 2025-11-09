using AutoMapper;
using Entities.Dtos;
using Entities.Models;
using Microsoft.AspNetCore.Identity;
using Repositories.Contracts;
using Services.Contracts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Services
{
    public class StudentManager : IStudentService
    {
        private readonly IRepositoryManager _manager;
        private readonly UserManager<IdentityUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;

        public StudentManager(IRepositoryManager manager, UserManager<IdentityUser> userManager, RoleManager<IdentityRole> roleManager)
        {
            _manager = manager;
            _userManager = userManager;
            _roleManager = roleManager;
        }

        // Services/StudentManager.cs
        public async Task<bool> ApproveStudentAsync(int studentId)
        {
            var student = await _manager.StudentRepository.GetOneStudentsAsync(studentId, true);
            if (student == null)
                return false;

            student.Status = "Approved";
            _manager.StudentRepository.Update(student);

            var identityUser = await _userManager.FindByEmailAsync(student.Email);
            if (identityUser != null)
            {
                var existingClaims = await _userManager.GetClaimsAsync(identityUser);
                var studentIdClaim = existingClaims.FirstOrDefault(c => c.Type == "StudentId");

                if (studentIdClaim == null)
                {
                    await _userManager.AddClaimAsync(identityUser,
                        new System.Security.Claims.Claim("StudentId", studentId.ToString()));
                }
            }

            await _manager.SaveAsync();
            return true;
        }

        public async Task<Student> GetStudentByIdAsync(int studentId, bool trackChanges)
        {
            var student = await _manager.StudentRepository.GetOneStudentsAsync(studentId, trackChanges);
            if (student is null)
                throw new Exception("Student not found!");

            return student;
        }

        public async Task<List<Student>> GetStudentsAsync(string search = null, string technology = null, string status = null)
        {
            return await _manager.StudentRepository.GetStudentsAsync(search, technology, status);
        }

        public async Task<IdentityResult> RegisterStudentAsync(StudentRegisterDto model)
        {
            var student = new Student
            {
                Name = model.Name,
                Surname = model.Surname,
                StudentNumber = model.StudentNumber,
                Email = model.Email,
                Technologies = model.Technologies,
                Status = "Pending"
                
            };

            var identityUser = new IdentityUser
            {
                UserName = model.Email,
                Email = model.Email
            };

            var result = await _userManager.CreateAsync(identityUser, model.Password);
            if (!result.Succeeded)
            {
                return result;
            }

            string roleName = "Student";
            if (!await _roleManager.RoleExistsAsync(roleName))
            {
                var roleResult = await _roleManager.CreateAsync(new IdentityRole(roleName));
                if (!roleResult.Succeeded)
                {
                    return roleResult;
                }
            }

            var roleAddResult = await _userManager.AddToRoleAsync(identityUser, roleName);
            if (!roleAddResult.Succeeded)
            {
                return roleAddResult;
            }

            _manager.StudentRepository.Create(student);
            await _manager.SaveAsync();

            return IdentityResult.Success;
        }

        public async Task<bool> RejectStudentAsync(int studentId)
        {
            var student = await _manager.StudentRepository.GetOneStudentsAsync(studentId, true);
            if (student is null)
                return false;

            student.Status = "Rejected";
            _manager.StudentRepository.Update(student);
            await _manager.SaveAsync();
            return true;
        }
    }
}