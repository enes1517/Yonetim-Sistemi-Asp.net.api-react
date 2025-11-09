using Microsoft.EntityFrameworkCore;
using Repositories.Contracts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Repositories
{
    public class RepositoryBase<T> : IRepositoryBase<T>
        where T : class
    {
        protected readonly RepositoryContext _context;

        public RepositoryBase(RepositoryContext context)
        {
            _context = context;
        }

        public void Create(T entity)
        {
            _context.Set<T>().Add(entity);
        }

        public IQueryable<T> GetAll(bool trackChanges)
        {
            return trackChanges
               ? _context.Set<T>() : _context.Set<T>().AsNoTracking();
        }

        public async Task<T?> GetByCondationAsync(Expression<Func<T, bool>> expression, bool trackChanges)
        {
            return trackChanges
                ? await _context.Set<T>().Where(expression).SingleOrDefaultAsync()
                : await _context.Set<T>().Where(expression).AsNoTracking().SingleOrDefaultAsync();
        }

        public void Remove(T entity)
        {
            _context.Set<T>().Remove(entity);

        }

        public void Update(T entity)
        {
            _context.Set<T>().Update(entity);

        }
    }
}
