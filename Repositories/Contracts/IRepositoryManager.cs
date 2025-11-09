using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repositories.Contracts
{
    public interface IRepositoryManager
    {
        IProjectRepository ProjectRepository { get; }
        IProjectApplicationRepository ApplicationRepository { get; }
        IStudentRepository StudentRepository { get; }
        Task SaveAsync();
    }
}
