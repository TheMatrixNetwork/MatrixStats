package org.matrixnetwork.stats.entity;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
public class CurrencyData {
    @Id
    private
    Long id;

    private double amount;

    private LocalDateTime time;

    @ManyToOne(targetEntity = MatrixPlayer.class)
    private MatrixPlayer matrixPlayer;

    //region Constructors
    public CurrencyData(double amount, LocalDateTime time, MatrixPlayer player) {
        this.amount = amount;
        this.time = time;
        this.matrixPlayer = player;
    }

    public CurrencyData() {
    }
    //endregion

    //region Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public LocalDateTime getTime() {
        return time;
    }

    public void setTime(LocalDateTime time) {
        this.time = time;
    }

    @Override
    public String toString() {
        return "CurrencyTransaction{" +
                "id=" + id +
                ", amount=" + amount +
                ", time=" + time +
                '}';
    }

    public MatrixPlayer getMatrixPlayer() {
        return matrixPlayer;
    }

    public void setMatrixPlayer(MatrixPlayer matrixPlayer) {
        this.matrixPlayer = matrixPlayer;
    }
    //endregion
}
