using Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repositories.Contracts
{
    public interface IStudentRepository:IRepositoryBase<Student>
    {
       Task<List<Student>> GetStudentsAsync(string searchTerm,string tech,string status);
       Task<Student> GetOneStudentsAsync(int studentId,bool trackChanges);
       

    }
}
