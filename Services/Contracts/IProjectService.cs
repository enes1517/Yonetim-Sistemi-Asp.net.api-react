using Entities.Dtos;
using Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Contracts
{
    public interface IProjectService
    {
        Task<bool> CreateProjectAsync(ProjectCreateDto dto);
        Task<bool> UpdateProjectAsync(int projectId,ProjectUpdateDto dto);
        Task<bool> DeleteProjectAsync(int projectId);
        Task<Project> GetProjectByIdAsync(int projectId, bool trackChanges);

        Task<List<Project>> GetProjectAsync(string searchTerm, DateTime? date);
        Task<List<Student>> GetProjectApplicantsAsync(int projectId);
    }
}
