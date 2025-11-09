using Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repositories.Extensions
{
    public static class StudentRepositoryExtensions
    {
        public static IQueryable<Student> FilteredbySearchTerm(this IQueryable<Student> students,string searchTerm)
        {
           
            if (string.IsNullOrWhiteSpace(searchTerm))
                return students;

            return students.Where(s=>s.Name.ToLower().Contains(searchTerm.ToLower()) || 
            s.Surname.ToLower().Contains(searchTerm.ToLower()) ||
            s.StudentNumber.ToLower().Contains(searchTerm.ToLower()));
        }
        public static IQueryable<Student> FilteredbyTech(this IQueryable<Student> students, string Tech)
        {
            if (string.IsNullOrWhiteSpace(Tech))
                return students;

            var techLower = Tech.ToLower();
            return students.Where(s => s.Technologies.Any(t => t.ToLower().Contains(techLower)));
        }
        public static IQueryable<Student> FilteredbyStatus(this IQueryable<Student> students, string status)
        {

            if (string.IsNullOrWhiteSpace(status))
                return students;

            return students.Where(s => s.Status.ToString().ToLower().Equals(status.ToLower()));

        }
    }
}
