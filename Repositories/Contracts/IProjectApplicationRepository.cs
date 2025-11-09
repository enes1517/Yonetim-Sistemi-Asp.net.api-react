using Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repositories.Contracts
{
    public interface IProjectApplicationRepository:IRepositoryBase<ProjectApplication>
    {
        Task<List<Project>> GetStudentProjectAsync(int studentId);
        Task<int> GetApplicationCountAsync(int studentId);
        Task<bool> ApplicationExistsAsync(int studentId,int projectId);
    }
}
