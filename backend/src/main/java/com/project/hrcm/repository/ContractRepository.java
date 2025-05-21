package com.project.hrcm.repository;

import com.project.hrcm.entities.Contract;
import com.project.hrcm.models.reponse.CustomContractData;
import com.project.hrcm.models.reponse.EmployeeNameData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContractRepository extends JpaRepository<Contract, Integer>, JpaSpecificationExecutor<Contract> {
  boolean existsByFileName(String fileName);
  boolean existsByFileNameEn(String fileName);

  @Query("SELECT new com.project.hrcm.models.reponse.CustomContractData(c.contractStatusId, c.contractType) FROM Contract c")
  List<CustomContractData> findDashBoardTotal();


}
