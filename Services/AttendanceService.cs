using AutoMapper;
using ParentTeacherBridge.API.DTO;

using ParentTeacherBridge.API.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

public class AttendanceService : IAttendanceService
{
    private readonly IAttendanceRepository _repository;
    private readonly IMapper _mapper;

    public AttendanceService(IAttendanceRepository repository, IMapper mapper)
    {
        _repository = repository;
        _mapper = mapper;
    }

    public async Task<AttendanceDto> CreateAsync(CreateAttendanceDto dto)
    {
        if (await _repository.AttendanceExistsAsync(dto.StudentId, dto.Date))
            throw new InvalidOperationException("Attendance already marked for this student on the selected date.");

        var attendance = _mapper.Map<Attendance>(dto);
        attendance.MarkedTime = TimeOnly.FromDateTime(DateTime.Now);
        attendance.CreatedAt = DateTime.UtcNow;

        var created = await _repository.AddAsync(attendance);
        return _mapper.Map<AttendanceDto>(created);
    }

    public async Task<AttendanceDto?> UpdateAsync(int id, AttendanceDto dto)
    {
        var attendance = _mapper.Map<Attendance>(dto);
        attendance.AttendanceId = id;
        attendance.UpdatedAt = DateTime.UtcNow;

        var updated = await _repository.UpdateAsync(attendance);
        return updated == null ? null : _mapper.Map<AttendanceDto>(updated);
    }

    public async Task<bool> DeleteAsync(int id) => await _repository.DeleteAsync(id);

    public async Task<AttendanceDto?> GetByIdAsync(int id)
    {
        var attendance = await _repository.GetByIdAsync(id);
        return attendance == null ? null : _mapper.Map<AttendanceDto>(attendance);
    }

    public async Task<IEnumerable<AttendanceDto>> GetByStudentIdAsync(int studentId)
    {
        var records = await _repository.GetByStudentIdAsync(studentId);
        return _mapper.Map<IEnumerable<AttendanceDto>>(records);
    }

    public async Task<IEnumerable<AttendanceDto>> GetByClassAndDateAsync(int classId, DateOnly date)
    {
        var records = await _repository.GetByClassAndDateAsync(classId, date);
        return _mapper.Map<IEnumerable<AttendanceDto>>(records);
    }
}



//using AutoMapper;
//using ParentTeacherBridge.API.DTOs;
//using ParentTeacherBridge.API.Models;

//public class AttendanceService : IAttendanceService
//{
//    private readonly IAttendanceRepository _repository;
//    private readonly IMapper _mapper;

//    public AttendanceService(IAttendanceRepository repository, IMapper mapper)
//    {
//        _repository = repository;
//        _mapper = mapper;
//    }

//    public async Task<AttendanceDTO> CreateAsync(AttendanceDTO dto)
//    {
//        var entity = _mapper.Map<Attendance>(dto);
//        var result = await _repository.AddAsync(entity);
//        return _mapper.Map<AttendanceDTO>(result);
//    }

//    public async Task<AttendanceDTO> UpdateAsync(int id, AttendanceDTO dto)
//    {
//        var existing = await _repository.GetByIdAsync(id);
//        if (existing == null) throw new Exception("Attendance not found");

//        _mapper.Map(dto, existing);
//        var updated = await _repository.UpdateAsync(existing);
//        return _mapper.Map<AttendanceDTO>(updated);
//    }

//    public async Task DeleteAsync(int id) =>
//        await _repository.DeleteAsync(id);

//    public async Task<AttendanceDTO> GetByIdAsync(int id)
//    {
//        var result = await _repository.GetByIdAsync(id);
//        return _mapper.Map<AttendanceDTO>(result);
//    }

//    public async Task<IEnumerable<AttendanceDTO>> GetByStudentIdAsync(int studentId)
//    {
//        var results = await _repository.GetByStudentIdAsync(studentId);
//        return _mapper.Map<IEnumerable<AttendanceDTO>>(results);
//    }
//}