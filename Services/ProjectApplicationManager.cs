using Entities.Models;
using Repositories.Contracts;
using Services.Contracts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services
{
    public class ProjectApplicationManager : IProjectApplicationService
    {
        private readonly IRepositoryManager _manager;

        public ProjectApplicationManager(IRepositoryManager manager)
        {
            _manager = manager;
        }

        public async Task<bool> ApplyToProjectAsync(int studentId, int projectId)
        {
            var applicationCount = await _manager.ApplicationRepository.GetApplicationCountAsync(studentId);
            if (applicationCount > 3)
            {
                throw new Exception("You can apply for a maximum of 3 projects.");

            }
               
            
            var applicationExist = await _manager.ApplicationRepository.ApplicationExistsAsync(studentId, projectId);
            if (applicationExist)
            {
                throw new Exception("Applicant is not found.");
            }
            var app=new ProjectApplication()
            { 
                ProjectId = projectId,
                StudentId = studentId,
            };

            _manager.ApplicationRepository.Create(app);
          await  _manager.SaveAsync();
            return true;

        }

        public async Task<List<Project>> GetStudentProjectsAsync(int studentId)
        {
           return await _manager.ApplicationRepository.GetStudentProjectAsync(studentId);
        }
    }
}
