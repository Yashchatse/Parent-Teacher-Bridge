using ParentTeacherBridge.API.Models;
using ParentTeacherBridge.API.Repositories;

namespace ParentTeacherBridge.API.Services
{
    public class SchoolClassService : ISchoolClassService
    {
        private readonly ISchoolClassRepository _repo;
        private readonly ITeacherRepository _teacherRepo;
        private readonly ILogger<SchoolClassService> _logger;

        public SchoolClassService(
            ISchoolClassRepository repo,
            ITeacherRepository teacherRepo,
            ILogger<SchoolClassService> logger)
        {
            _repo = repo;
            _teacherRepo = teacherRepo;
            _logger = logger;
        }

        public async Task<IEnumerable<SchoolClass>> GetAllAsync()
        {
            try
            {
                return await _repo.GetAllAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in SchoolClassService.GetAllAsync");
                throw;
            }
        }

        public async Task<SchoolClass?> GetByIdAsync(int id)
        {
            try
            {
                return await _repo.GetByIdAsync(id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in SchoolClassService.GetByIdAsync for ID {ClassId}", id);
                throw;
            }
        }


        public async Task<SchoolClass> CreateAsync(SchoolClass schoolClass)
        {
            try
            {
               

                await _repo.AddAsync(schoolClass);
                return schoolClass;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in SchoolClassService.CreateAsync");
                throw;
            }
        }

        public async Task<SchoolClass?> UpdateAsync(SchoolClass schoolClass)
        {
            try
            {
                var existing = await _repo.GetByIdAsync(schoolClass.ClassId);
                if (existing == null)
                    return null;

                

                await _repo.UpdateAsync(schoolClass);
                return await _repo.GetByIdAsync(schoolClass.ClassId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in SchoolClassService.UpdateAsync for ID {ClassId}", schoolClass.ClassId);
                throw;
            }
        }

        public async Task<bool> DeleteAsync(int id)
        {
            try
            {
                var schoolClass = await _repo.GetByIdAsync(id);
                if (schoolClass == null)
                    return false;


                await _repo.DeleteAsync(schoolClass);
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in SchoolClassService.DeleteAsync for ID {ClassId}", id);
                throw;
            }
        }

       

           
    }
    }
