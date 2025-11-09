using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Repositories;
using Repositories.Contracts;
using Services;
using Services.Contracts;

namespace React.Server.Infrastructure.Extensions
{
    public static class ServiceExtensions
    {
        public static void ConfigureDbContext(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContext<RepositoryContext>(options =>
            {
                options.UseSqlServer(configuration.GetConnectionString("mssqlconnection"),
                b => b.MigrationsAssembly("React.Server"));

                options.EnableSensitiveDataLogging(true);
            });

        }
        public static void ConfigureIdentity(this IServiceCollection services)
        {
            services.AddIdentity<IdentityUser, IdentityRole>(options =>
            {
                options.SignIn.RequireConfirmedAccount = false;
                options.User.RequireUniqueEmail = true;
                options.Password.RequireUppercase = false;
                options.Password.RequireLowercase = false;
                options.Password.RequireDigit = false;
                options.Password.RequiredLength = 6;
            })
           .AddEntityFrameworkStores<RepositoryContext>();
        }

        public static void ConfigureRepositoryRegistrations(this IServiceCollection services)
        {
            services.AddScoped<IRepositoryManager, RepositoryManager>();
            services.AddScoped<IStudentRepository, StudentRepository>();
            services.AddScoped<IProjectRepository, ProjectRepository>();
            services.AddScoped<IProjectApplicationRepository, ProjectApplicationRepository>();
        }
        public static void ConfigureServiceRegistrations(this IServiceCollection services)
        {
            services.AddScoped<IStudentService, StudentManager>();
            services.AddScoped<IProjectService, ProjectManager>();
            services.AddScoped<IProjectApplicationService, ProjectApplicationManager>();
            services.AddScoped<IServiceManager, ServiceManager>();
        }
        public static void ConfigureRouting(this IServiceCollection services)
        {
            services.AddRouting(Options =>
            {
                Options.LowercaseQueryStrings = true;
                Options.AppendTrailingSlash = false;
            });
        }
        public static void ConfigureApplicationCookie(this IServiceCollection services)
        {
            services.ConfigureApplicationCookie(Options =>
            {
                Options.LoginPath = new PathString("/Auth/Login");
                Options.ReturnUrlParameter = CookieAuthenticationDefaults.ReturnUrlParameter;
                Options.ExpireTimeSpan = TimeSpan.FromMinutes(10);
                Options.AccessDeniedPath = new PathString("/Auth/Login");
            });
        }
        public static async void ConfigureDefaultAdminUser(this IApplicationBuilder app)
        {
            const string adminUser = "Admin";
            const string adminPassword = "Admin+123456";
            const string adminEmail = "enesipek@gmail.com";

            using (var scope = app.ApplicationServices.CreateScope())
            {
                var userManager = scope.ServiceProvider.GetRequiredService<UserManager<IdentityUser>>();
                var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();

                var user = await userManager.FindByEmailAsync(adminUser);

                if (user == null)
                {
                    user = new IdentityUser
                    {
                        UserName = adminUser,
                        Email = adminEmail,
                    };

                    var result = await userManager.CreateAsync(user, adminPassword);
                    if (!result.Succeeded)
                    {
                        throw new Exception("Varsayılan admin kullanıcısı oluşturulamadı.");
                    }

                    if (!await roleManager.RoleExistsAsync("Admin"))
                    {
                        var role = new IdentityRole("Admin");
                        var roleResult = await roleManager.CreateAsync(role);
                        if (!roleResult.Succeeded)
                        {
                            throw new Exception("Admin rolü oluşturulamadı.");
                        }
                    }

                    var addToRoleResult = await userManager.AddToRoleAsync(user, "Admin");
                    if (!addToRoleResult.Succeeded)
                    {
                        throw new Exception("Admin kullanıcısına rol atanamadı.");
                    }
                }

            }

        }
    }
}
