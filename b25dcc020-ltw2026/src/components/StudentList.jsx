import StudentItem from "./StudentItem";
const StudentList = ({ students, onDelete }) => {
  return (
    <table border="1" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
      <thead style={{ backgroundColor: '#f0f0f0' }}>
        <tr>
          <th style={{ padding: '8px' }}>ID</th>
          <th>Họ và tên</th>
          <th>Lớp</th>
          <th>Điểm số</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        {students.map((student) => (
          <StudentItem 
            key={student.id} 
            student={student} 
            onDelete={onDelete}
          />
        ))}
      </tbody>
    </table>
  );
};

export default StudentList;