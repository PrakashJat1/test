export const enrollmentIdGenerator = (batch_started_date,batch_no,presentStudent) => {
    
    const start_year = new Date(batch_started_date).getFullYear();
    const paddedStudentNo = String(presentStudent + 1).padStart(3, '0');

    return `ITEP-${start_year}-${batch_no}-${paddedStudentNo}`;
}