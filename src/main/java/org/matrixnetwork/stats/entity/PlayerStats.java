package org.matrixnetwork.stats.entity;


import org.json.simple.JSONObject;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
public class PlayerStats {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private
    Long id;

    private float exp;
    private int foodLevel;
    private double loc_x;
    private double loc_y;
    private double loc_z;
    private double money;
    private double health;
    private String gamemode;
    private String lastDamageCause;
    private int remainingAir;
    private LocalDateTime timeStamp;
    private int guildRank;
    private int threatTier;
    private int sfLevel;
    private int prestige;

    @ManyToOne(fetch = FetchType.EAGER, targetEntity = MatrixPlayer.class)
    private MatrixPlayer matrixPlayer;

    public PlayerStats(float exp,
                       int foodLevel,
                       double loc_x,
                       double loc_y,
                       double loc_z,
                       double money,
                       double health,
                       String gamemode,
                       String lastDamageCause,
                       int remainingAir,
                       LocalDateTime timeStamp,
                       int guildRank,
                       int threatTier,
                       int sfLevel,
                       int prestige,
                       MatrixPlayer matrixPlayer) {
        this.exp = exp;
        this.foodLevel = foodLevel;
        this.loc_x = loc_x;
        this.loc_y = loc_y;
        this.loc_z = loc_z;
        this.money = money;
        this.health = health;
        this.gamemode = gamemode;
        this.lastDamageCause = lastDamageCause;
        this.remainingAir = remainingAir;
        this.timeStamp = timeStamp;
        this.setGuildRank(guildRank);
        this.setThreatTier(threatTier);
        this.setSfLevel(sfLevel);
        this.setPrestige(prestige);
        this.matrixPlayer = matrixPlayer;
    }

    public PlayerStats() {

    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public float getExp() {
        return exp;
    }

    public int getFoodLevel() {
        return foodLevel;
    }

    public double getLoc_x() {
        return loc_x;
    }

    public double getLoc_y() {
        return loc_y;
    }

    public double getLoc_z() {
        return loc_z;
    }

    public double getMoney() {
        return money;
    }

    public double getHealth() {
        return health;
    }

    public String getGamemode() {
        return gamemode;
    }

    public String getLastDamageCause() {
        return lastDamageCause;
    }

    public int getRemainingAir() {
        return remainingAir;
    }

    public LocalDateTime getTimeStamp() {
        return timeStamp;
    }

    public JSONObject toJSON() {
        JSONObject jo = new JSONObject();
        jo.put("exp", getExp());
        jo.put("food_level", getFoodLevel());
        JSONObject loc = new JSONObject();
        loc.put("x", getLoc_x());
        loc.put("y", getLoc_y());
        loc.put("z", getLoc_z());
        jo.put("location", loc);
        jo.put("money", getMoney());
        jo.put("health", getHealth());
        jo.put("gamemode", getGamemode());
        jo.put("last_damage_cause", getLastDamageCause());
        jo.put("remaining_air", getRemainingAir());
        jo.put("timestamp", getTimeStamp().toString());
        jo.put("guildRank", getGuildRank());
        jo.put("threatTier", getThreatTier());
        jo.put("sfLevel", getSfLevel());
        jo.put("prestige", getPrestige());

        return jo;
    }

    public int getGuildRank() {
        return guildRank;
    }

    public void setGuildRank(int guildRank) {
        this.guildRank = guildRank;
    }

    public int getThreatTier() {
        return threatTier;
    }

    public void setThreatTier(int threatTier) {
        this.threatTier = threatTier;
    }

    public int getSfLevel() {
        return sfLevel;
    }

    public void setSfLevel(int sfLevel) {
        this.sfLevel = sfLevel;
    }

    public int getPrestige() {
        return prestige;
    }

    public void setPrestige(int prestige) {
        this.prestige = prestige;
    }
}
