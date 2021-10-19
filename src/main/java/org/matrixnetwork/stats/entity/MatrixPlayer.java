package org.matrixnetwork.stats.entity;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import java.util.List;
import java.util.UUID;

@Entity
public class MatrixPlayer {
    @Id
    UUID uuid;

    @OneToMany(mappedBy = "order", fetch = FetchType.LAZY)
    private List<CurrencyData> transactions;

    //region Constructors
    public MatrixPlayer(UUID uuid, List<CurrencyData> transactions) {
        this.uuid = uuid;
        this.transactions = transactions;
    }

    public MatrixPlayer(UUID uuid) {
        this.uuid = uuid;
    }

    public MatrixPlayer() {

    }
    //endregion

    //region Getters and Setters
    public UUID getUUID() {
        return uuid;
    }

    public void setUUID(UUID id) {
        this.uuid = id;
    }

    public List<CurrencyData> getTransactions() {
        return transactions;
    }

    public void setTransactions(List<CurrencyData> transactions) {
        this.transactions = transactions;
    }
    //endregion
}
