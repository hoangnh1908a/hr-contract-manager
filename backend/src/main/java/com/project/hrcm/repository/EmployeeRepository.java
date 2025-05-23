package com.project.hrcm.repository;

import com.project.hrcm.entities.Employee;
import com.project.hrcm.models.reponse.EmployeeNameData;
import com.project.hrcm.models.reponse.EmployeeValueData;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface EmployeeRepository
    extends JpaRepository<Employee, Integer>, JpaSpecificationExecutor<Employee> {

  boolean existsByEmail(String email);

  @Query(
      "SELECT new com.project.hrcm.models.reponse.EmployeeNameData(e.id, e.fullName) FROM Employee e")
  List<EmployeeNameData> findEmployeeName();

  @Query(
      value =
          "SELECT new com.project.hrcm.models.reponse.EmployeeValueData(e"
              + ", (SELECT p.name FROM Position p WHERE p.id = e.positionId)"
              + ", (SELECT d.name FROM Department d WHERE d.id = e.departmentId))"
              + " FROM Employee e WHERE e.id = :id")
  Optional<EmployeeValueData> findByIdCustom(Integer id);

  List<Employee> countAllById(Integer id);

  @Query(
      value =
          "SELECT e.* FROM employees e WHERE DATE_ADD(e.hire_date, INTERVAL (SELECT contract_type from contracts where employee_id = e.id and contract_status_id = 1) MONTH )\n"
              + "                   <= DATE_SUB(CURDATE(), INTERVAL 5 MONTH)",
      nativeQuery = true)
  List<Employee> findExpiringEmployee();

  @Query(
      value =
          "SELECT e.full_name as fullName, e.hire_date as hireDate,\n"
              + "       (select name from positions where id = e.position_id) as position,\n"
              + "       (select name from departments where id = e.department_id) as department,\n"
              + "        c.contract_type as contractType,\n"
              + "        adddate(e.hire_date,INTERVAL c.contract_type MONTH) as contractEndDate\n"
              + "       FROM employees e\n"
              + "       LEFT JOIN contracts c ON c.employee_id = e.id and contract_status_id = 1\n"
              + "       WHERE DATE_ADD(e.hire_date, INTERVAL c.contract_type MONTH )\n"
              + "                   <= DATE_SUB(CURDATE(), INTERVAL :monthExpire MONTH)",
      nativeQuery = true)
  List<Object[]> findTableExpiringEmployee(Integer monthExpire);
}
