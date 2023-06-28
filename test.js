import StudentsPicker from '../components/StudentsPicker';
import StudentsTable from '../components/StudentsTable';
import { fetchStudentData, fetchSchoolData, fetchLegalguardianData } from '../utils';
import { useState, useEffect } from 'react';

const studentsDataComponent = () => {
  const [studentsData, setStudentsData] = useState([]);
  const [schoolsData, setSchoolsData] = useState([]);
  const [legalguardiansData, setLegalguardiansData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const fetchedStudents = [];
      const fetchedSchools = [];
      const fetchedLegalGuardians = [];

      for (const studentId of studentsData) {
        const studentData = await fetchStudentData(studentId);
        fetchedStudents.push(studentData);

        for (const student of studentData) {
          const { schoolId, legalguardianId } = student;
          const schoolData = await fetchSchoolData(schoolId);
          fetchedSchools.push(schoolData);

          const legalguardianData = await fetchLegalguardianData(legalguardianId);
          fetchedLegalGuardians.push(legalguardianData);
        }
      }

      setStudentsData(fetchedStudents);
      setSchoolsData(fetchedSchools);
      setLegalguardiansData(fetchedLegalGuardians);
    };

    fetchData();
  }, []);

  const onStudentsPick = async (studentIds) => {
    const fetchedStudents = [];
    const fetchedSchools = [];
    const fetchedLegalGuardians = [];

    for (const studentId of studentIds) {
      if (!studentsData.find((studentData) => studentData.id === studentId)) {
        const studentData = await fetchStudentData(studentId);
        fetchedStudents.push(studentData);

        for (const student of studentData) {
          const { schoolId, legalguardianId } = student;

          if (!schoolsData.find((schoolData) => schoolData.id === schoolId)) {
            const schoolData = await fetchSchoolData(schoolId);
            fetchedSchools.push(schoolData);
          }

          if (!legalguardiansData.find((legalguardianData) => legalguardianData.id === legalguardianId)) {
            const legalguardianData = await fetchLegalguardianData(legalguardianId);
            fetchedLegalGuardians.push(legalguardianData);
          }
        }
      }
    }

    setStudentsData([...studentsData, ...fetchedStudents]);
    setSchoolsData([...schoolsData, ...fetchedSchools]);
    setLegalguardiansData([...legalguardiansData, ...fetchedLegalGuardians]);
  };

  return (
    <>
      <StudentsPicker onPickHandler={onStudentsPick} />
      <StudentsTable
        studentsData={studentsData}
        schoolsData={schoolsData}
        LegalguardiansData={legalguardiansData}
      />
    </>
  );
};

export default studentsDataComponent;