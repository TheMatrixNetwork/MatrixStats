package org.matrixnetwork.stats.entity;

import javax.persistence.*;
import java.util.List;
import java.util.UUID;

@Entity
public class MatrixPlayer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private
    Long id;

    String uuid;

    private String username;

    @OneToMany(mappedBy = "matrixPlayer", fetch = FetchType.EAGER)
    private List<CurrencyData> transactions;

    //region Constructors
    public MatrixPlayer(String uuid, List<CurrencyData> transactions, String username) {
        this.uuid = uuid;
        this.transactions = transactions;
        this.username = username;
    }

    public MatrixPlayer(String uuid, String username) {
        this(uuid, null, username);
    }

    public MatrixPlayer() {

    }
    //endregion

    //region Getters and Setters
    public String getUUID() {
        return uuid;
    }

    public void setUUID(String id) {
        this.uuid = id;
    }

    public List<CurrencyData> getTransactions() {
        return transactions;
    }

    public void setTransactions(List<CurrencyData> transactions) {
        this.transactions = transactions;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
    //endregion
}
