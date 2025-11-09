using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entities.Dtos
{
    public record class StudentDto
    {
        public int Id { get; init; }
        public string Name { get; init; }
        public string Surname { get; init; }
        public string StudentNumber { get; init; }
        public string Email { get; init; }
        public List<string> Technologies { get; set; }
        public string Status { get; init; }
    }
}
