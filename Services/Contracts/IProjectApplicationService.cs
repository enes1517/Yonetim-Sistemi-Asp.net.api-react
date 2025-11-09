using Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Contracts
{
    public interface IProjectApplicationService
    {
        Task<bool> ApplyToProjectAsync(int studentId, int projectId);
        Task<List<Project>> GetStudentProjectsAsync(int studentId);
    }
}
