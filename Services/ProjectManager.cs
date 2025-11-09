using AutoMapper;
using Entities.Dtos;
using Entities.Models;
using Repositories;
using Repositories.Contracts;
using Services.Contracts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services
{
    public class ProjectManager : IProjectService
    {
        private readonly IRepositoryManager _manager;

        public ProjectManager(IRepositoryManager manager)
        {
            _manager = manager;
        }

        public async Task<bool> CreateProjectAsync(ProjectCreateDto model)
        {
            var project = new Project
            {
                Name = model.Name,
                Description = model.Description,
                Deadline = model.Deadline
            };

            _manager.ProjectRepository.Create(project);
           await _manager.SaveAsync();
            return true;


        }

        public async Task<bool> DeleteProjectAsync(int projectId)
        {
           var project= await GetProjectByIdAsync(projectId,false);
            

            _manager.ProjectRepository.Remove(project);
            await _manager.SaveAsync();
            return true;

        }

        public async Task<List<Student>> GetProjectApplicantsAsync(int projectId)
        {
            return await _manager.ProjectRepository.GetProjectApplicantsAsync(projectId);
        }

        public async Task<List<Project>> GetProjectAsync(string searchTerm, DateTime? date)
        {
            return await _manager.ProjectRepository.GetProjectAsync(searchTerm, date);
        }

        public async Task<Project> GetProjectByIdAsync(int projectId, bool trackChanges)
        {
        var project= await _manager.ProjectRepository.GetOneProjectByIdAsync(projectId, trackChanges);
            if (project is null)
               throw new Exception("Project not found!");

            return project;
        }

        public async Task<bool> UpdateProjectAsync(int projectId, ProjectUpdateDto model)
        {
            var project = await GetProjectByIdAsync(projectId,true);

            project.Name = model.Name;
            project.Description = model.Description;
            project.Deadline = model.Deadline;
            await _manager.SaveAsync();
            return true;

        }
    }
}
