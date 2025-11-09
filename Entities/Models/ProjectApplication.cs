using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entities.Models
{
    public class ProjectApplication
    {
        public int Id { get; set; }
        public int StudentId { get; set; }
        public int ProjectId { get; set; }
        public Student Student { get; set; }
        public Project Project { get; set; }
    }
}
