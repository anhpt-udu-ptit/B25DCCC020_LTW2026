import {useState } from "react";
import StudentList from "./components/StudentList";
import ptitLogo from './assets/image.png';
const initialStudent = [
  {
    id: "B25001",
    name: "Nguyen Van A",
    score: 8.5,
    className: "D2501",
  },
  {
    id: "B25002",
    name: "Pham Van B",
    score: 5,
    className: "D2502",
  },
  {
    id: "B25003",
    name: "Nguyen Thi C",
    score: 0,
    className: "D2503",
  }
];

const App = () => {

  const [students, setStudents] = useState(initialStudent);
  const [formData,setFormatData] = useState({name:'',score:'',className:''});
  const [filterType, setFilterType] = useState('ALL');
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const {name, value} = e.target;
    setFormatData({...formData, [name]: value});
  };

  const handleAddStudent = (e) => {
    e.preventDefault();
    const {name,score,className} = formData;
    const numberScore = parseFloat(score);

    if(!name || !score || !className){
    setError('Vui lòng điền đầy đủ thông tin !!!')
    return;
  }
  if(0>numberScore || numberScore>10){
    setError('Làm gì có ai có điểm như này?')
    return;
  }

  setError("");

  const newStudent = {
    id: `B25${Date.now()}`,
    name,
    score: numberScore,
    className,
  };
  
  setStudents([...students, newStudent]);
  
  setFormatData({ name: '', score: '', className: '' }); 
  };



  const handleDeleteButtom = (id) => {
  setStudents(students.filter(student => student.id !== id));
  };

const filteredStudents = students.filter(student => {
  if (filterType === 'GIOI') return student.score >= 8;
  if (filterType === 'TRUOT') return student.score < 5;
  return true;
});

const totalStudents = filteredStudents.length;
const avgScore = totalStudents > 0 
  ? filteredStudents.reduce((sum, student) => sum + student.score, 0) / totalStudents 
  : 0;

return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <img 
      src={ptitLogo} 
      alt="PTIT Logo" 
      style={{ height: '60px', width: 'auto', objectFit: 'contain' }} 
      />
      <h2>Quản lý Điểm Sinh viên</h2>

      <form onSubmit={handleAddStudent} style={{ marginBottom: '20px' }}>
        <input 
          name="name" 
          placeholder="Họ và tên" 
          value={formData.name} 
          onChange={handleInputChange} 
          style={{ marginRight: '10px', padding: '5px' }}
        />
        <input 
          name="className" 
          placeholder="Lớp" 
          value={formData.className} 
          onChange={handleInputChange} 
          style={{ marginRight: '10px', padding: '5px' }}
        />
        <input 
          name="score" 
          type="number" 
          step="0.1" 
          placeholder="Điểm số" 
          value={formData.score} 
          onChange={handleInputChange} 
          style={{ marginRight: '10px', padding: '5px' }}
        />
        <button type="submit" style={{ padding: '6px 15px' }}>Thêm sinh viên</button>
      </form>

      {error && <p style={{ color: 'red', marginTop: '-10px' }}>{error}</p>}

      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <button 
          onClick={() => setFilterType('ALL')} 
          style={{ fontWeight: filterType === 'ALL' ? 'bold' : 'normal' }}>
          Tất cả
        </button>
        <button 
          onClick={() => setFilterType('GIOI')} 
          style={{ fontWeight: filterType === 'GIOI' ? 'bold' : 'normal' }}>
          Sinh viên Giỏi (&gt;= 8)
        </button>
        <button 
          onClick={() => setFilterType('TRUOT')} 
          style={{ fontWeight: filterType === 'TRUOT' ? 'bold' : 'normal' }}>
          Sinh viên bị Trượt (&lt; 5)
        </button>
      </div>

      <div style={{ padding: '10px', backgroundColor: '#f0f5ff', marginBottom: '20px' }}>
        <p style={{ margin: '5px 0' }}><strong>{`Tổng số lượng: ${totalStudents} sinh viên`}</strong></p>
        <p style={{ margin: '5px 0' }}><strong>{`Điểm trung bình: ${avgScore.toFixed(2)}`}</strong></p>
      </div>

      <StudentList 
        students={filteredStudents} 
        onDelete={handleDeleteButtom} 
      />
    </div>
  );
};

export default App;