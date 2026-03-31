package com.miniproject.dateevaluation.repository;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.miniproject.dateevaluation.model.Client;

@Repository
public interface ClientRepository extends CrudRepository<Client, Long>{
    boolean existsByUsername(String username);
    Client findByUsername(String username);
    int countByLoveCode(String loveCode);
}
