using AutoMapper;
using ParentTeacherBridge.API.DTO;
using ParentTeacherBridge.API.Models;
using ParentTeacherBridge.API.Repositories;
using System.Collections.Generic;

public class AttendanceService : IAttendanceService
{
    private readonly IAttendanceRepository _repo;
    private readonly IMapper _mapper;

    public AttendanceService(IAttendanceRepository repo, IMapper mapper)
    {
        _repo = repo;
        _mapper = mapper;
    }

    public AttendanceDto CreateAttendance(AttendanceCreateDto dto)
    {
        var entity = _mapper.Map<Attendance>(dto);
        var created = _repo.Create(entity);
        return _mapper.Map<AttendanceDto>(created);
    }

    public AttendanceDto UpdateAttendance(int id, AttendanceUpdateDto dto)
    {
        var existing = _repo.GetById(id);
        if (existing == null) return null;

        _mapper.Map(dto, existing); //  Maps update DTO into existing entity
        var updated = _repo.Update(id, existing);
        return _mapper.Map<AttendanceDto>(updated);
    }


    public void DeleteAttendance(int id) => _repo.Delete(id);

    public IEnumerable<AttendanceDto> GetAttendanceByStudentId(int studentId)
    {
        var records = _repo.GetByStudentId(studentId);
        return _mapper.Map<IEnumerable<AttendanceDto>>(records);
    }

    //public IEnumerable<AttendanceDto> GetAttendanceByTeacherId(int teacherId)
    //{
    //    var records = _repo.GetByTeacherId(teacherId);
    //    return _mapper.Map<IEnumerable<AttendanceDto>>(records);
    //}

    public IEnumerable<AttendanceDto> GetAttendanceByClassId(int classId)
    {
        var records = _repo.GetByClassId(classId);
        return _mapper.Map<IEnumerable<AttendanceDto>>(records);
    }
}