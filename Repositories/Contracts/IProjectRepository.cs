using Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repositories.Contracts
{
    public interface IProjectRepository:IRepositoryBase<Project>
    {
        Task<List<Project>> GetProjectAsync(string searchTerm,DateTime? date);
        Task<Project> GetOneProjectByIdAsync(int projectId, bool trackChanges);
        Task<List<Student>> GetProjectApplicantsAsync(int projectId);
    }
}
