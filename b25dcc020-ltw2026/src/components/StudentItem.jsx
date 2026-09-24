const StudentItem = ({student, onDelete}) => {
    const {id,name,score,className} = student;
    return(
        <tr style={{ textAlign: 'center' }}>
        <td>{id}</td>
        <td>{name}</td>
        <td>{className}</td>
        <td>{`${score} điểm`}</td>
        <td>
        <button onClick={() => onDelete(id)}>Xóa</button>
      </td>
    </tr>
  );
};

export default StudentItem;